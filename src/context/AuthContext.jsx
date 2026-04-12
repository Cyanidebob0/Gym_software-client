import { createContext, useContext, useState, useEffect, useRef } from 'react';
import supabase from '../services/supabase';
import api from '../services/api';
import { appConfig } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const profileRef = useRef(null);
    const profileLoadRef = useRef(null);

    useEffect(() => {
        profileRef.current = profile;
    }, [profile]);

    const syncAndLoadProfile = async (authUser) => {
        if (!authUser) {
            profileLoadRef.current = null;
            setProfile(null);
            return null;
        }

        if (profileRef.current?.id === authUser.id) {
            return profileRef.current;
        }

        if (profileLoadRef.current?.userId === authUser.id) {
            return profileLoadRef.current.promise;
        }

        const promise = (async () => {
            await api.post('/v1/auth/sync', { name: authUser.user_metadata?.name || '' }).catch(() => {});

            try {
                const response = await api.get('/v1/auth/me');
                const serverProfile = response.data?.data ?? null;
                setProfile(serverProfile);
                return serverProfile;
            } catch {
                setProfile(null);
                return null;
            }
        })();

        profileLoadRef.current = {
            userId: authUser.id,
            promise,
        };

        return promise.finally(() => {
            if (profileLoadRef.current?.userId === authUser.id) {
                profileLoadRef.current = null;
            }
        });
    };

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            const authUser = session?.user ?? null;
            setUser(authUser);
            await syncAndLoadProfile(authUser);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const authUser = session?.user ?? null;
            setUser(authUser);

            if (!authUser) {
                profileLoadRef.current = null;
                setProfile(null);
                setLoading(false);
                return;
            }

            await syncAndLoadProfile(authUser);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const serverProfile = await syncAndLoadProfile(data.user);
        return { user: data.user, profile: serverProfile };
    };

    const register = async (email, password, name, phone) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone },
            },
        });
        if (error) throw error;
        return data.user;
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${appConfig.appUrl}/auth/callback?mode=user`,
            },
        });
        if (error) throw error;
    };

    const forgotPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${appConfig.appUrl}/reset-password`,
        });
        if (error) throw error;
    };

    const resetPassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        profileLoadRef.current = null;
        setUser(null);
        setProfile(null);
    };

    const role = profile?.role ?? null;

    const value = {
        user,
        profile,
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
