import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useUnreadBroadcasts from '../../hooks/useUnreadBroadcasts';
import {
    LayoutDashboard,
    CalendarCheck,
    CreditCard,
    Megaphone,
    User,
    LogOut,
    Dumbbell,
    Activity,
    Menu,
    X,
} from 'lucide-react';

const NAV_LINKS = [
    { to: '/member',            label: 'Dashboard',     icon: LayoutDashboard, end: true },
    { to: '/member/attendance', label: 'Attendance',     icon: CalendarCheck,   end: false },
    { to: '/member/workouts',   label: 'Workouts',      icon: Activity,        end: false },
    { to: '/member/payments',   label: 'Payments',       icon: CreditCard,      end: false },
    { to: '/member/broadcasts', label: 'Announcements',  icon: Megaphone,       end: false },
    { to: '/member/profile',    label: 'Profile',        icon: User,            end: false },
];

const MemberLayout = () => {
    const { logout, user } = useAuth();
    const { unreadCount, markAsRead } = useUnreadBroadcasts(user?.id);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hideSidebar, setHideSidebar] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    const navClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isActive
                ? 'bg-[#e65100] text-white shadow-lg shadow-[#e65100]/25'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
        }`;

    // Full-screen mode: no sidebar, centered content
    if (hideSidebar) {
        return (
            <div className="min-h-screen bg-[#0a0a0a]">
                <main className="min-h-screen p-4 sm:p-6 md:p-8">
                    <Outlet context={{ setHideSidebar, markAsRead }} />
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            {/* Mobile menu toggle */}
            <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-[#1a1a1a] border border-white/10 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium"
                aria-label="Toggle member menu"
            >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    aria-label="Close menu overlay"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-[240px] bg-[#111111] border-r border-white/5 text-white flex flex-col transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                {/* Brand */}
                <div className="px-5 py-6 border-b border-white/5">
                    <div className="flex items-center gap-2.5 mt-10 lg:mt-0">
                        <Dumbbell size={24} className="text-[#e65100]" />
                        <h2 className="text-lg font-extrabold tracking-tight">
                            <span className="text-[#e65100]">SWEAT</span>
                            <span className="text-white"> ZONE</span>
                        </h2>
                    </div>
                    {user?.email && (
                        <p className="text-[11px] text-gray-500 mt-2 truncate">{user.email}</p>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-5 overflow-y-auto">
                    <ul className="space-y-1">
                        {NAV_LINKS.map((link) => {
                            const Icon = link.icon;
                            const badge = link.to === '/member/broadcasts' ? unreadCount : 0;
                            return (
                                <li key={link.to}>
                                    <NavLink
                                        to={link.to}
                                        end={link.end}
                                        className={navClass}
                                        onClick={closeMobileMenu}
                                    >
                                        <Icon size={18} className="flex-shrink-0" />
                                        {link.label}
                                        {badge > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                                                {badge > 99 ? '99+' : badge}
                                            </span>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 lg:ml-[240px] min-h-screen p-4 sm:p-6 md:p-8 pt-16 lg:pt-8">
                <Outlet context={{ setHideSidebar, markAsRead }} />
            </main>
        </div>
    );
};

export default MemberLayout;
