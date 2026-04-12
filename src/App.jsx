import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
            <Analytics />
        </Router>
    );
}

export default App;
