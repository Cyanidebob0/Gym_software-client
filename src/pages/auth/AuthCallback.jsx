import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../services/supabase';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user, profile, role, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate('/login');
            return;
        }

        // Never fall through to member routing until the server-side profile is loaded.
        if (!profile) {
            return;
        }

        const pendingPasswordSetupRaw = sessionStorage.getItem('pendingPasswordSetup');
        const pendingPasswordSetup = pendingPasswordSetupRaw ? JSON.parse(pendingPasswordSetupRaw) : null;

        if (role === 'owner') {
            sessionStorage.removeItem('pendingPasswordSetup');
            supabase.auth.signOut().finally(() => {
                navigate('/login', {
                    replace: true,
                    state: {
                        mode: 'owner',
                        oauthOwnerNotice: true,
                    },
                });
            });
            return;
        }

        if (
            pendingPasswordSetup
            && role === 'member'
            && user.email?.toLowerCase() === pendingPasswordSetup.email?.toLowerCase()
        ) {
            supabase.auth.updateUser({ password: pendingPasswordSetup.password })
                .then(({ error }) => {
                    sessionStorage.removeItem('pendingPasswordSetup');

                    if (error) {
                        navigate('/login', {
                            replace: true,
                            state: {
                                passwordSetupError: 'Could not save your password. Please try again.',
                            },
                        });
                        return;
                    }

                    navigate('/member', {
                        replace: true,
                        state: {
                            passwordSetupSuccess: 'Password saved. You can now sign in with Google or email and password.',
                        },
                    });
                });
            return;
        }

        if (role === 'super_admin') {
            navigate('/admin', { replace: true });
            return;
        }

        navigate('/member', { replace: true });
    }, [user, profile, role, loading, navigate]);

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center">
            <div className="text-white text-center">
                <div className="login-callback__spinner" />
                <p style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginTop: '1rem' }}>
                    SIGNING YOU IN...
                </p>
            </div>
        </div>
    );
};

export default AuthCallback;
