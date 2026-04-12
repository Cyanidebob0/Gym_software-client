import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SETTINGS } from '../../data/mockData';
import usePendingCount from '../../hooks/usePendingCount';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    CreditCard,
    CalendarCheck,
    RotateCcw,
    Megaphone,
    BarChart3,
    Settings,
    LogOut,
    Dumbbell,
    Menu,
    X,
} from 'lucide-react';

const NAV = [
    { to: '/owner',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
    { to: '/owner/members',    label: 'Members',    icon: Users },
    { to: '/owner/plans',      label: 'Plans',      icon: ClipboardList },
    { to: '/owner/payments',   label: 'Payments',   icon: CreditCard },
    { to: '/owner/attendance', label: 'Attendance',  icon: CalendarCheck },
    { to: '/owner/refunds',    label: 'Refunds',    icon: RotateCcw },
    { to: '/owner/broadcast',  label: 'Broadcast',  icon: Megaphone },
    { to: '/owner/reports',    label: 'Reports',    icon: BarChart3 },
    { to: '/owner/settings',   label: 'Settings',   icon: Settings, bottom: true },
];

const OwnerLayout = () => {
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    const pendingCount = usePendingCount();

    const mainNav = NAV.filter((n) => !n.bottom);
    const bottomNav = NAV.filter((n) => n.bottom);

    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            {/* Mobile toggle */}
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="lg:hidden fixed top-4 left-4 z-40 bg-[#141414] border border-white/10 text-white w-9 h-9 rounded-lg shadow flex items-center justify-center"
                aria-label="Toggle menu"
            >
                {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Overlay */}
            {open && (
                <button
                    type="button"
                    onClick={close}
                    className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                    aria-label="Close menu"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen w-60 bg-[#111111] text-white flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-white/5`}>
                {/* Gym name */}
                <div className="px-5 py-5 mt-2 lg:mt-0 border-b border-white/5">
                    <div className="flex items-center gap-2.5 mb-1">
                        <Dumbbell size={20} className="text-[#e65100]" />
                        <h2 className="text-base font-extrabold text-white truncate">{SETTINGS.gymName}</h2>
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Owner Panel</p>
                </div>

                {/* Main nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                    {mainNav.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={close}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-[#e65100] text-white shadow-lg shadow-[#e65100]/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={18} className="flex-shrink-0" />
                            {label}
                            {label === 'Members' && pendingCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                                    {pendingCount}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="px-3 pb-4 space-y-0.5 border-t border-white/5 pt-3">
                    {bottomNav.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={close}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-[#e65100] text-white shadow-lg shadow-[#e65100]/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={18} className="flex-shrink-0" />
                            {label}
                        </NavLink>
                    ))}

                    {/* Owner info */}
                    <div className="flex items-center gap-3 px-3 py-2 mt-1">
                        <div className="w-7 h-7 rounded-full bg-[#e65100]/20 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                            {user?.email?.charAt(0).toUpperCase() ?? 'O'}
                        </div>
                        <p className="text-xs text-gray-500 truncate flex-1">{user?.email}</p>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-8 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default OwnerLayout;
