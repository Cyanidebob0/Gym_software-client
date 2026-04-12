import { Link } from 'react-router-dom';
import {
    DollarSign,
    Building2,
    Users,
    MapPin,
    Clock,
    Activity,
    ArrowUpRight,
    Settings,
    ScrollText,
    Zap,
} from 'lucide-react';

const AdminDashboard = () => {
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="min-h-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1">{today}</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Platform overview & system health</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Total Revenue */}
                <div className="col-span-2 bg-[#141414] border border-white/5 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Revenue</p>
                        <span className="text-[10px] sm:text-xs bg-emerald-400/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <ArrowUpRight size={10} /> +12% MoM
                        </span>
                    </div>
                    <p className="text-3xl sm:text-5xl font-extrabold text-white leading-none">$45,000</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Across all registered gyms</p>
                </div>

                {/* Total Gyms */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Gyms</p>
                        <div className="w-8 h-8 rounded-lg bg-[#e65100]/10 flex items-center justify-center">
                            <Building2 size={16} className="text-[#e65100]" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">12</p>
                    <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                        <ArrowUpRight size={12} /> 2 added this month
                    </p>
                </div>

                {/* Active Users */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Active Users</p>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Users size={16} className="text-blue-400" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">1,234</p>
                    <p className="text-[10px] sm:text-xs text-blue-400 font-semibold mt-2 flex items-center gap-1">
                        <ArrowUpRight size={12} /> 98 joined this week
                    </p>
                </div>

                {/* New Gyms */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">New Gyms</p>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <MapPin size={16} className="text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">2</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">This month</p>
                </div>

                {/* Pending Approvals */}
                <div className="bg-[#141414] border border-amber-400/20 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-400">Pending</p>
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                            <Clock size={16} className="text-amber-400" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">3</p>
                    <p className="text-[10px] sm:text-xs text-amber-400 font-semibold mt-2">Gym approvals waiting</p>
                </div>

                {/* Platform Health */}
                <div className="col-span-2 bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Platform Health</p>
                        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            All Systems Operational
                        </span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: 'API Server', pct: 99 },
                            { label: 'Database', pct: 97 },
                            { label: 'Auth Service', pct: 100 },
                        ].map(({ label, pct }) => (
                            <div key={label}>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>{label}</span>
                                    <span className="text-emerald-400 font-semibold">{pct}% uptime</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity + Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-3 bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-[#e65100]" /> Recent Activity
                    </h3>
                    <ul className="space-y-3">
                        {[
                            { text: 'New gym "FitZone Bangalore" registered', time: '2h ago', color: 'bg-[#e65100]' },
                            { text: 'User bhuvanannappa@gmail.com logged in', time: '3h ago', color: 'bg-blue-400' },
                            { text: 'System config updated by super admin', time: '5h ago', color: 'bg-gray-400' },
                            { text: 'Payment of $3,200 received from GymX', time: '1d ago', color: 'bg-emerald-400' },
                            { text: 'New user registration from Sweat Zone', time: '1d ago', color: 'bg-purple-400' },
                        ].map(({ text, time, color }) => (
                            <li key={text} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                                <span className="flex-1 text-xs sm:text-sm text-gray-300">{text}</span>
                                <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Links */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'System Config', to: '/admin/config', icon: Settings, color: 'text-[#e65100]', bg: 'bg-[#e65100]/10' },
                            { label: 'Audit Logs', to: '/admin/logs', icon: ScrollText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                        ].map(({ label, to, icon: Icon, color, bg }) => (
                            <Link
                                key={label}
                                to={to}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-[#e65100]/20 transition-all text-sm font-medium text-gray-300"
                            >
                                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={16} className={color} />
                                </div>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* System Info */}
                    <div className="mt-5 pt-4 border-t border-white/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">System Info</p>
                        <div className="space-y-2">
                            {[
                                ['Version', 'v1.0.0'],
                                ['Environment', 'Production'],
                                ['Last Deploy', '2 days ago'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between text-xs">
                                    <span className="text-gray-500">{k}</span>
                                    <span className="text-gray-300 font-medium">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
