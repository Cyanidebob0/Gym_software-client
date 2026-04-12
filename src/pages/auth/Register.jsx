import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const { register, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await register(form.email, form.password, form.name, form.phone);

            try {
                const { profile, profileLoaded } = await login(form.email, form.password);
                if (!profileLoaded) {
                    navigate('/login', {
                        replace: true,
                        state: {
                            passwordSetupError: 'Account created, but we could not verify your role yet. Please sign in again in a moment.',
                        },
                    });
                    return;
                }

                const role = profile?.role ?? 'member';

                if (role === 'super_admin') {
                    navigate('/admin');
                } else if (role === 'owner') {
                    navigate('/owner');
                } else {
                    navigate('/member');
                }
            } catch {
                navigate('/login');
            }
        } catch (err) {
            const msg = err.message?.toLowerCase() ?? '';
            if (msg.includes('already registered') || msg.includes('user already exists')) {
                setError('An account with this email already exists. Please sign in instead.');
            } else if (msg.includes('password')) {
                setError('Password must be at least 6 characters.');
            } else if (msg.includes('invalid email')) {
                setError('Please enter a valid email address.');
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div ref={pageRef} className="login-page">
            <div className="login-left">
                <div className="login-left__bg register-left__bg" aria-hidden="true" />
                <div className="login-left__overlay" aria-hidden="true" />
                <div className="login-left__content">
                    <Link to="/" className="login-left__logo">
                        <img src="/logo.jpeg" alt="Sweat Zone" className="login-left__logo-img" />
                    </Link>
                    <div className="login-left__headline">
                        <span className="login-left__big block">JOIN</span>
                        <span className="login-left__big login-left__big--accent block">TODAY</span>
                    </div>
                    <p className="login-left__tagline">Your transformation starts here.</p>
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

                    <div className="login-form-wrap__header">
                        <span className="login-form-wrap__eyebrow">CREATE ACCOUNT</span>
                        <h2 className="login-form-wrap__title">Get<br />started.</h2>
                    </div>

                    {error && (
                        <div className="login-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="login-success">
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="login-form">
                        <div className="login-form__row">
                            <div className="login-field">
                                <label className="login-field__label" htmlFor="reg-name">FULL NAME</label>
                                <input
                                    id="reg-name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="login-field__input"
                                />
                            </div>
                            <div className="login-field">
                                <label className="login-field__label" htmlFor="reg-phone">PHONE</label>
                                <input
                                    id="reg-phone"
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="98XXXXXXXX"
                                    className="login-field__input"
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label className="login-field__label" htmlFor="reg-email">EMAIL</label>
                            <input
                                id="reg-email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="login-field__input"
                            />
                        </div>

                        <div className="login-form__row">
                            <div className="login-field">
                                <label className="login-field__label" htmlFor="reg-password">PASSWORD</label>
                                <div className="login-field__password-wrap">
                                    <input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="........"
                                        className="login-field__input login-field__input--password"
                                    />
                                    <button type="button" className="login-field__eye" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password">
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

                            <div className="login-field">
                                <label className="login-field__label" htmlFor="reg-confirm">CONFIRM</label>
                                <div className="login-field__password-wrap">
                                    <input
                                        id="reg-confirm"
                                        type={showConfirm ? 'text' : 'password'}
                                        name="confirm"
                                        value={form.confirm}
                                        onChange={handleChange}
                                        required
                                        placeholder="........"
                                        className="login-field__input login-field__input--password"
                                    />
                                    <button type="button" className="login-field__eye" onClick={() => setShowConfirm((value) => !value)} aria-label="Toggle confirm password">
                                        {showConfirm ? (
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
                        </div>

                        <button type="submit" className="login-submit" disabled={loading}>
                            {loading ? 'CREATING ACCOUNT' : 'CREATE ACCOUNT'}
                            {loading ? (
                                <span className="btn-spinner" />
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </form>
                    <p className="login-register-link">
                        Already have an account?{' '}
                        <Link to="/login" className="login-register-link__anchor">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
        </>
    );
};

export default Register;
