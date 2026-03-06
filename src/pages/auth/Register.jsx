import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
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
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        // registration logic goes here
    };

    return (
        <div ref={pageRef} className="login-page">

            {/* Left — branding panel */}
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

            {/* Right — form panel */}
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
                                        placeholder="••••••••"
                                        className="login-field__input login-field__input--password"
                                    />
                                    <button type="button" className="login-field__eye" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
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
                                        placeholder="••••••••"
                                        className="login-field__input login-field__input--password"
                                    />
                                    <button type="button" className="login-field__eye" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password">
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

                        <button type="submit" className="login-submit">
                            CREATE ACCOUNT
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>

                    <div className="login-divider">
                        <span className="login-divider__line" />
                        <span className="login-divider__text">OR</span>
                        <span className="login-divider__line" />
                    </div>

                    <button type="button" className="login-google">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="login-google__icon">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="login-register-link">
                        Already have an account?{' '}
                        <Link to="/login" className="login-register-link__anchor">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
