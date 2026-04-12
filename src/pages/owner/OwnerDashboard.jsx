import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, LineChart } from '../../components/owner/MiniChart';
import memberService from '../../services/memberService';
import paymentService from '../../services/paymentService';
import attendanceService from '../../services/attendanceService';
import dashboardService from '../../services/dashboardService';
import {
    DollarSign,
    Users,
    UserX,
    TrendingUp,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity,
} from 'lucide-react';

const OwnerDashboard = () => {
    const [stats, setStats] = useState({ active: 0, expired: 0, expiringSoon: 0 });
    const [revenue, setRevenue] = useState({ month: 0, year: 0 });
    const [attend, setAttend] = useState({ total: 0, present: 0 });
    const [allMembers, setAllMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [charts, setCharts] = useState({
        monthlyRevenue: [],
        revenueChange: { change: 0, direction: 'up' },
        weeklyAttendance: [],
        memberGrowth: [],
    });

    useEffect(() => {
        Promise.all([
            memberService.getStats().then(setStats).catch(() => {}),
            memberService.getAll().then(setAllMembers).catch(() => {}),
            Promise.all([paymentService.getMonthlyRevenue(), paymentService.getYearlyRevenue()])
                .then(([month, year]) => setRevenue({ month, year }))
                .catch(() => {}),
            attendanceService.getTodayStats().then(setAttend).catch(() => {}),
            dashboardService.getDashboard().then(setCharts).catch(() => {}),
        ]).finally(() => setLoading(false));
    }, []);

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const totalMembers = stats.active + stats.expired + stats.expiringSoon;
    const retentionRate = totalMembers > 0 ? Math.round((stats.active / totalMembers) * 100) : 0;

    const recentMembers = [...allMembers]
        .sort((a, b) => (b.joinDate || '').localeCompare(a.joinDate || ''))
        .slice(0, 5);

    const expiringMembers = allMembers
        .filter((m) => m.status === 'expiring_soon')
        .slice(0, 4);

    const revChange = charts.revenueChange || { change: 0, direction: 'up' };
    const RevIcon = revChange.direction === 'up' ? ArrowUpRight : ArrowDownRight;
    const revColor = revChange.direction === 'up' ? 'text-emerald-400' : 'text-red-400';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1">{today}</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Your gym at a glance</p>
                </div>
                <Link
                    to="/owner/members/new"
                    className="flex items-center gap-2 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 w-fit"
                >
                    <Plus size={16} /> Register Member
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Revenue</p>
                        <div className="w-8 h-8 rounded-lg bg-[#e65100]/10 flex items-center justify-center">
                            <DollarSign size={16} className="text-[#e65100]" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">₹{revenue.month.toLocaleString('en-IN')}</p>
                    <p className={`text-[10px] sm:text-xs ${revColor} font-semibold mt-2 flex items-center gap-1`}>
                        <RevIcon size={12} /> {revChange.change > 0 ? `${revChange.direction === 'up' ? '+' : '-'}${revChange.change}% from last month` : 'No change'}
                    </p>
                </div>

                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Active Members</p>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Users size={16} className="text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">{stats.active}</p>
                    <p className="text-[10px] sm:text-xs text-amber-400 font-semibold mt-2 flex items-center gap-1">
                        <ArrowUpRight size={12} /> {stats.expiringSoon} expiring soon
                    </p>
                </div>

                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Expired Members</p>
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <UserX size={16} className="text-red-400" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">{stats.expired}</p>
                    <p className="text-[10px] sm:text-xs text-red-400 font-semibold mt-2 flex items-center gap-1">
                        {stats.expired > 0 ? <><ArrowDownRight size={12} /> Need renewal</> : <><ArrowUpRight size={12} /> All good</>}
                    </p>
                </div>

                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Retention Rate</p>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <TrendingUp size={16} className="text-blue-400" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-white">{retentionRate}%</p>
                    <p className="text-[10px] sm:text-xs text-blue-400 font-semibold mt-2 flex items-center gap-1">
                        {totalMembers > 0
                            ? <><ArrowUpRight size={12} /> {stats.active} of {totalMembers} active</>
                            : 'No members yet'}
                    </p>
                </div>
            </div>

            {/* Charts + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Revenue Growth */}
                <div className="lg:col-span-2 bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white">Revenue Growth</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Last 6 months</p>
                        </div>
                        <span className="text-[10px] sm:text-xs bg-emerald-400/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-full">
                            YTD: ₹{revenue.year.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <BarChart data={charts.monthlyRevenue.length ? charts.monthlyRevenue : [{ label: '-', value: 0 }]} color="#e65100" height={140} />
                </div>

                {/* Recent Activity */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                            <Activity size={16} className="text-[#e65100]" /> Recent Activity
                        </h3>
                    </div>
                    {recentMembers.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-6">No members yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentMembers.map((m) => (
                                <li key={m.id} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                                        {m.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-semibold text-white truncate">{m.name}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500">{m.planName}</p>
                                    </div>
                                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${
                                        m.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' :
                                        m.status === 'expiring_soon' ? 'bg-amber-400/10 text-amber-400' :
                                        'bg-red-400/10 text-red-400'
                                    }`}>
                                        {m.status === 'expiring_soon' ? 'Expiring' : m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link to="/owner/members" className="block text-center text-xs text-[#e65100] hover:text-[#f57c00] font-semibold mt-4 transition-colors">
                        View all members →
                    </Link>
                </div>
            </div>

            {/* Attendance + Expiring Memberships */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Attendance Trend */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white">Weekly Attendance</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Daily check-ins this week</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12} /> Today: {attend.total}
                            </span>
                        </div>
                    </div>
                    <LineChart data={charts.weeklyAttendance.length ? charts.weeklyAttendance : [{ label: '-', value: 0 }]} color="#3b82f6" height={130} />
                </div>

                {/* Expiring Memberships */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white">Expiring Memberships</h3>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Members expiring within 7 days</p>
                        </div>
                        <span className="text-[10px] sm:text-xs bg-amber-400/10 text-amber-400 font-semibold px-2.5 py-1 rounded-full">
                            {stats.expiringSoon} members
                        </span>
                    </div>
                    {expiringMembers.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-6">No memberships expiring soon.</p>
                    ) : (
                        <div className="space-y-2">
                            {expiringMembers.map((m) => (
                                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-white truncate">{m.name}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500">{m.planName} · Exp: {m.expiryDate}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/owner/members/${m.id}`}
                                        className="text-[10px] sm:text-xs font-semibold text-[#e65100] hover:text-[#f57c00] whitespace-nowrap transition-colors"
                                    >
                                        Renew →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link to="/owner/members?filter=expiring_soon" className="block text-center text-xs text-[#e65100] hover:text-[#f57c00] font-semibold mt-4 transition-colors">
                        View all expiring →
                    </Link>
                </div>
            </div>

            {/* Member Growth */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">Member Growth</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Total members — last 6 months</p>
                    </div>
                    <span className="text-[10px] sm:text-xs bg-emerald-400/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-full">
                        {totalMembers} total
                    </span>
                </div>
                <LineChart data={charts.memberGrowth.length ? charts.memberGrowth : [{ label: '-', value: 0 }]} color="#10b981" height={130} />
            </div>
        </div>
    );
};

export default OwnerDashboard;
