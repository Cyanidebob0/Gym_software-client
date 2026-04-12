import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user, role, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode') ?? 'member';

        if (!user) {
            navigate('/login');
            return;
        }
        if (mode === 'admin' && role === 'super_admin') navigate('/admin');
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
