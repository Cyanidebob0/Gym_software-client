import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // In a real app, you would make an API call here.
        // const response = await api.post('/auth/login', { email, password });
        // const { user, token } = response.data;

        // For now, we simulate a successful login based on email
        // This is just for demonstration purposes until the backend is connected

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let mockUser = { id: 1, email, name: 'Test User' };
        let mockToken = 'mock-jwt-token';

        if (email.includes('admin')) mockUser.role = 'super_admin';
        else if (email.includes('owner')) mockUser.role = 'owner';
        else mockUser.role = 'member';

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockToken);

        return mockUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        role: user?.role,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
