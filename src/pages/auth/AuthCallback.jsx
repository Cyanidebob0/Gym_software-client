import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user, role, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate('/login');
            return;
        }
        // Route by effective role from AuthContext (whitelist-aware).
        // super_admin always lands on /admin; the `mode` query param is only
        // a hint and shouldn't override authoritative role.
        if (role === 'super_admin') navigate('/admin');
        else if (role === 'owner') navigate('/owner');
        else navigate('/member');
    }, [user, role, loading, navigate]);

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
