import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-8xl font-black text-primary mb-4">404</h1>
            <p className="text-xl text-neutral-400 mb-8">Page not found.</p>
            <Link to="/" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
