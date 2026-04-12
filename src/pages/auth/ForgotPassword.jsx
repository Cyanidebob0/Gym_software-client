import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();
    const location = useLocation();
    const mode = location.state?.mode ?? 'member';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err) {
            const msg = err.message ?? '';
            if (msg.toLowerCase().includes('invalid email') || msg.toLowerCase().includes('unable to validate')) {
                setError('Please enter a valid email address.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
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
                        <span className="login-left__big block">RESET</span>
                        <span className="login-left__big login-left__big--accent block">ACCESS</span>
                    </div>
                    <p className="login-left__tagline">We'll get you back in.</p>
                </div>
            </div>

            <div className="login-right">
                <div className="login-form-wrap">
                    <Link to="/login" state={{ mode }} className="login-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to sign in
                    </Link>

                    <div className="login-form-wrap__header">
                        <span className="login-form-wrap__eyebrow">
                            {mode === 'admin' ? 'ADMIN' : 'MEMBER'} · FORGOT PASSWORD
                        </span>
                        <h2 className="login-form-wrap__title">Forgot<br />password?</h2>
                    </div>

                    {error && (
                        <div className="login-error"><span>{error}</span></div>
                    )}

                    {sent ? (
                        <div className="login-success">
                            <span>Reset link sent! Check your inbox and follow the link to set a new password.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="login-form">
                            <div className="login-field">
                                <label className="login-field__label" htmlFor="fp-email">EMAIL</label>
                                <input
                                    id="fp-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="login-field__input"
                                />
                            </div>
                            <button type="submit" className="login-submit" disabled={loading}>
                                {loading ? 'SENDING' : 'SEND RESET LINK'}
                                {loading
                                    ? <span className="btn-spinner" />
                                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                }
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
