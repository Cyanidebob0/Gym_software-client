import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Modal from '../../components/owner/Modal';
import api from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [ownerOauthModalOpen, setOwnerOauthModalOpen] = useState(false);
    const [passwordSetupModalOpen, setPasswordSetupModalOpen] = useState(false);
    const [passwordSetup, setPasswordSetup] = useState({ password: '', confirm: '' });
    const [passwordSetupError, setPasswordSetupError] = useState('');
    const location = useLocation();
    const [mode, setMode] = useState(location.state?.mode === 'owner' ? 'owner' : 'user');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.login-form-wrap', {
                y: 30,
                opacity: 0,
                duration: 0.85,
                ease: 'power3.out',
                delay: 0.15,
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (location.state?.mode === 'owner') {
            setMode('owner');
        }

        if (location.state?.oauthOwnerNotice) {
            setOwnerOauthModalOpen(true);
        }

        if (location.state?.passwordSetupError) {
            setError(location.state.passwordSetupError);
        }
    }, [location.state]);

    const checkGooglePasswordSetupEligibility = async (targetEmail) => {
        const response = await api.post('/v1/auth/account-status', { email: targetEmail });
        return response.data?.data?.canSetupPasswordViaGoogle === true;
    };

    const startPasswordSetupWithGoogle = async () => {
        setPasswordSetupError('');

        if (passwordSetup.password.length < 6) {
            setPasswordSetupError('Password must be at least 6 characters.');
            return;
        }

        if (passwordSetup.password !== passwordSetup.confirm) {
            setPasswordSetupError('Passwords do not match.');
            return;
        }

        sessionStorage.setItem('pendingPasswordSetup', JSON.stringify({
            email: email.trim(),
            password: passwordSetup.password,
        }));

        setLoading(true);
        await loginWithGoogle();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { profile, profileLoaded } = await login(email, password);
            if (!profileLoaded) {
                setError('Signed in, but we could not verify your account yet. Please try again in a moment.');
                return;
            }

            const role = profile?.role ?? 'member';

            if (role === 'super_admin') {
                navigate('/admin');
            } else if (role === 'owner') {
                if (mode === 'owner') {
                    navigate('/owner');
                } else {
                    setError('Please use the Owner tab to sign in.');
                }
            } else if (mode === 'user') {
                navigate('/member');
            } else {
                setError('You are not authorised as a gym owner.');
            }
        } catch (err) {
            if (err?.response?.status === 429) {
                setError('Too many requests right now. Please wait a minute and try again.');
                console.error(err);
                return;
            }

            try {
                const eligible = await checkGooglePasswordSetupEligibility(email);
                if (eligible) {
                    setPasswordSetupModalOpen(true);
                    setError('');
                } else {
                    setError('Invalid email or password. Please try again.');
                }
            } catch {
                setError('Invalid email or password. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (err) {
            setError('Google sign-in failed. Please try again.');
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <>
        <div ref={pageRef} className="login-page">
            <div className="login-left">
                <div className="login-left__bg" aria-hidden="true" />
                <div className="login-left__overlay" aria-hidden="true" />
                <div className="login-left__content">
                    <Link to="/" className="login-left__logo">
                        <img src="/logo.jpeg" alt="Sweat Zone" className="login-left__logo-img" />
                    </Link>
                    <div className="login-left__headline">
                        <span className="login-left__big block">SWEAT</span>
                        <span className="login-left__big login-left__big--accent block">ZONE</span>
                    </div>
                    <p className="login-left__tagline">Train hard. Live strong.</p>
                </div>
            </div>

            <div className="login-right">
                <div className="login-form-wrap">
                    <Link to="/" className="login-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </Link>

                    <div className="login-tabs">
                        <button
                            type="button"
                            className={`login-tab${mode === 'user' ? ' login-tab--active' : ''}`}
                            onClick={() => { setMode('user'); setError(''); }}
                        >
                            USER
                        </button>
                        <button
                            type="button"
                            className={`login-tab${mode === 'owner' ? ' login-tab--active' : ''}`}
                            onClick={() => { setMode('owner'); setError(''); }}
                        >
                            OWNER
                        </button>
                    </div>

                    <div className="login-form-wrap__header">
                        <span className="login-form-wrap__eyebrow">
                            {mode === 'owner' ? 'OWNER ACCESS' : 'MEMBER ACCESS'}
                        </span>
                        <h2 className="login-form-wrap__title">Welcome<br />back.</h2>
                    </div>

                    {error && (
                        <div className="login-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="login-form">
                        <div className="login-field">
                            <label className="login-field__label" htmlFor="login-email">EMAIL</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="login-field__input"
                            />
                        </div>

                        <div className="login-field">
                            <label className="login-field__label" htmlFor="login-password">PASSWORD</label>
                            <div className="login-field__password-wrap">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="........"
                                    className="login-field__input login-field__input--password"
                                />
                                <button
                                    type="button"
                                    className="login-field__eye"
                                    onClick={() => setShowPassword((value) => !value)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" />
                                            <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="login-forgot">
                            <Link to="/forgot-password" state={{ mode }} className="login-forgot__link">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="login-submit" disabled={loading}>
                            {loading ? 'SIGNING IN' : 'SIGN IN'}
                            {loading ? (
                                <span className="btn-spinner" />
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </form>

                    {mode === 'user' && (
                        <>
                            <div className="login-divider">
                                <span className="login-divider__line" />
                                <span className="login-divider__text">OR</span>
                                <span className="login-divider__line" />
                            </div>

                            <button type="button" className="login-google" onClick={handleGoogle} disabled={loading}>
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="login-google__icon">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        </>
                    )}

                    {mode === 'user' && (
                        <p className="login-register-link">
                            New here?{' '}
                            <Link to="/register" className="login-register-link__anchor">Create an account</Link>
                        </p>
                    )}

                    {mode === 'owner' && (
                        <p className="login-register-link">
                            Owner accounts are created by admin only.
                        </p>
                    )}
                </div>
            </div>
        </div>
        <Modal
            isOpen={ownerOauthModalOpen}
            onClose={() => setOwnerOauthModalOpen(false)}
            title="Use Owner Sign-In"
            size="sm"
        >
            <div className="space-y-4">
                <p className="text-sm leading-6 text-gray-300">
                    This account is registered as an owner. Please switch to the Owner tab and sign in using your email and password.
                </p>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setOwnerOauthModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-[#e65100] text-white text-sm font-semibold hover:bg-[#f57c00] transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal>
        <Modal
            isOpen={passwordSetupModalOpen}
            onClose={() => {
                setPasswordSetupModalOpen(false);
                setPasswordSetup({ password: '', confirm: '' });
                setPasswordSetupError('');
            }}
            title="Google Account Found"
            size="sm"
        >
            <div className="space-y-4">
                <p className="text-sm leading-6 text-gray-300">
                    This email is already linked to Google sign-in. If you want, you can set a password for the same account and then use either Google or email and password.
                </p>
                <div className="space-y-3">
                    <input
                        type="password"
                        value={passwordSetup.password}
                        onChange={(e) => setPasswordSetup((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="New password"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/50"
                    />
                    <input
                        type="password"
                        value={passwordSetup.confirm}
                        onChange={(e) => setPasswordSetup((prev) => ({ ...prev, confirm: e.target.value }))}
                        placeholder="Retype password"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/50"
                    />
                </div>
                {passwordSetupError && (
                    <p className="text-sm text-red-400">{passwordSetupError}</p>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setPasswordSetupModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={startPasswordSetupWithGoogle}
                        className="px-4 py-2 rounded-xl bg-[#e65100] text-white text-sm font-semibold hover:bg-[#f57c00] transition-colors"
                    >
                        Save Password
                    </button>
                </div>
            </div>
        </Modal>
        </>
    );
};

export default Login;
