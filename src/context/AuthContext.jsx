import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../services/supabase';
import api from '../services/api';
import { ADMIN_ALLOWED_EMAILS } from '../constants/adminEmails';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth state changes (login, logout, OAuth callback)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            // Sync user to server DB on first sign-in or OAuth
            if (event === 'SIGNED_IN' && session?.user) {
                const u = session.user;
                api.post('/v1/auth/sync', { name: u.user_metadata?.name || '' }).catch(() => {});
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    };

    const register = async (email, password, name, phone, role = 'member') => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone, role },
            },
        });
        if (error) throw error;
        return data.user;
    };

    const loginWithGoogle = async (mode = 'member') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?mode=${mode}`,
            },
        });
        if (error) throw error;
    };

    const forgotPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    };

    const resetPassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const emailLower = user?.email?.toLowerCase() ?? '';
    const role = ADMIN_ALLOWED_EMAILS.includes(emailLower)
        ? 'super_admin'
        : (user?.app_metadata?.role ?? user?.user_metadata?.role ?? 'member');

    const value = {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
        role,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
