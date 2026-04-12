import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await resetPassword(password);
            navigate('/login');
        } catch (err) {
            setError(err.message ?? 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-left__bg" aria-hidden="true" />
                <div className="login-left__overlay" aria-hidden="true" />
                <div className="login-left__content">
                    <Link to="/" className="login-left__logo">
                        <img src="/logo.jpeg" alt="Sweat Zone" className="login-left__logo-img" />
                    </Link>
                    <div className="login-left__headline">
                        <span className="login-left__big block">NEW</span>
                        <span className="login-left__big login-left__big--accent block">PASSWORD</span>
                    </div>
                    <p className="login-left__tagline">Choose a strong password.</p>
                </div>
            </div>

            <div className="login-right">
                <div className="login-form-wrap">
                    <div className="login-form-wrap__header">
                        <span className="login-form-wrap__eyebrow">RESET PASSWORD</span>
                        <h2 className="login-form-wrap__title">Set new<br />password.</h2>
                    </div>

                    {error && (
                        <div className="login-error"><span>{error}</span></div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="login-form">
                            <div className="login-field">
                                <label className="login-field__label" htmlFor="rp-password">NEW PASSWORD</label>
                                <div className="login-field__password-wrap">
                                    <input
                                        id="rp-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                <label className="login-field__label" htmlFor="rp-confirm">CONFIRM PASSWORD</label>
                                <div className="login-field__password-wrap">
                                    <input
                                        id="rp-confirm"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="login-field__input login-field__input--password"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="login-submit" disabled={loading}>
                                {loading ? 'UPDATING' : 'UPDATE PASSWORD'}
                                {loading
                                    ? <span className="btn-spinner" />
                                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                }
                            </button>
                        </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
