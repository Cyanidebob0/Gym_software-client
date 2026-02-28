import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-dark-light rounded-xl shadow-2xl p-8 border border-neutral-800">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>
                <p className="text-neutral-400 text-center">Registration functionality coming soon.</p>
                <p className="mt-4 text-center text-neutral-400 text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
