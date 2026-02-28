import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'super_admin') navigate('/admin');
            else if (user.role === 'owner') navigate('/owner');
            else navigate('/member');
        } catch (err) {
            setError('Failed to login');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-dark-light rounded-xl shadow-2xl p-8 border border-neutral-800">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-neutral-400 mb-2 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@test.com, owner@test.com, or user@test.com"
                            className="w-full bg-dark border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-neutral-400 mb-2 text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-dark border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors duration-300">
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-neutral-500">
                    <p>Demo Credentials:</p>
                    <p>Admin: admin@test.com</p>
                    <p>Owner: owner@test.com</p>
                    <p>Member: user@test.com</p>
                </div>
                <p className="mt-4 text-center text-neutral-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
