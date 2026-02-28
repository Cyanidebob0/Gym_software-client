import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MemberLayout = () => {
    const { logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden fixed top-4 left-4 z-40 bg-[#34495e] text-white px-3 py-2 rounded-md shadow"
                aria-label="Toggle member menu"
            >
                {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>

            {mobileMenuOpen && (
                <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="lg:hidden fixed inset-0 z-30 bg-black/40"
                    aria-label="Close menu overlay"
                />
            )}

            <aside className={`fixed lg:static top-0 left-0 z-40 h-full w-[250px] bg-[#34495e] text-white p-4 flex flex-col transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <h2 className="mb-8 mt-12 lg:mt-0 text-xl font-bold">Member Area</h2>
                <nav className="flex-1">
                    <ul className="list-none p-0">
                        <li className="mb-4"><Link to="/member" onClick={closeMobileMenu} className="text-gray-200 hover:text-primary transition-colors">Dashboard</Link></li>
                        <li className="mb-4"><Link to="/member/attendance" onClick={closeMobileMenu} className="text-gray-200 hover:text-primary transition-colors">My Attendance</Link></li>
                        <li className="mb-4"><Link to="/member/payments" onClick={closeMobileMenu} className="text-gray-200 hover:text-primary transition-colors">My Payments</Link></li>
                        <li className="mb-4"><Link to="/member/profile" onClick={closeMobileMenu} className="text-gray-200 hover:text-primary transition-colors">Profile</Link></li>
                    </ul>
                </nav>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">Logout</button>
            </aside>

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto lg:ml-0">
                <Outlet />
            </main>
        </div>
    );
};

export default MemberLayout;
