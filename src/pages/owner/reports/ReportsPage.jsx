import { useEffect, useState } from 'react';
import memberService from '../../../services/memberService';
import paymentService from '../../../services/paymentService';
import dashboardService from '../../../services/dashboardService';
import { BarChart, LineChart } from '../../../components/owner/MiniChart';
import {
    BarChart3,
    Users,
    UserX,
    RefreshCw,
    DollarSign,
    TrendingUp,
    CalendarCheck,
} from 'lucide-react';

export default function ReportsPage() {
    const [stats, setStats] = useState({ active: 0, expired: 0, expiringSoon: 0, total: 0 });
    const [revenue, setRevenue] = useState({ month: 0, year: 0 });
    const [loading, setLoading] = useState(true);
    const [charts, setCharts] = useState({
        monthlyRevenue: [],
        weeklyAttendance: [],
        memberGrowth: [],
    });

    useEffect(() => {
        Promise.all([
            memberService.getStats().then(setStats).catch(() => {}),
            Promise.all([paymentService.getMonthlyRevenue(), paymentService.getYearlyRevenue()])
                .then(([month, year]) => setRevenue({ month, year }))
                .catch(() => {}),
            dashboardService.getDashboard().then(setCharts).catch(() => {}),
        ]).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const renewalRate = stats.total > 0
        ? Math.round((stats.active / stats.total) * 100)
        : 0;

    const weeklyData = charts.weeklyAttendance || [];
    const avgDailyAttendance = weeklyData.length > 0
        ? Math.round(weeklyData.reduce((s, d) => s + d.value, 0) / weeklyData.length)
        : 0;

    const memberGrowthData = charts.memberGrowth || [];
    const newThisMonth = memberGrowthData.length >= 2
        ? memberGrowthData[memberGrowthData.length - 1].value - memberGrowthData[memberGrowthData.length - 2].value
        : stats.total;

    const summaryCards = [
        { label: 'New Members', value: newThisMonth, icon: Users, color: 'text-[#e65100]', bg: 'bg-[#e65100]/10' },
        { label: 'Expired', value: stats.expired, icon: UserX, color: 'text-red-400', bg: 'bg-red-400/10' },
        { label: 'Renewal Rate', value: `${renewalRate}%`, icon: RefreshCw, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Monthly Revenue', value: `₹${revenue.month.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Yearly Revenue', value: `₹${revenue.year.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { label: 'Avg Attendance', value: avgDailyAttendance, icon: CalendarCheck, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    ];

    const placeholder = [{ label: '-', value: 0 }];

    return (
        <div className="min-h-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <BarChart3 size={24} className="text-[#e65100]" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Reports</h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Gym performance overview</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
                {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-[#141414] border border-white/5 rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 leading-tight">{label}</p>
                            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon size={14} className={color} />
                            </div>
                        </div>
                        <p className="text-lg sm:text-2xl font-extrabold text-white">{value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <ChartCard title="Revenue Report" subtitle="Last 6 months (₹)">
                    <BarChart data={charts.monthlyRevenue?.length ? charts.monthlyRevenue : placeholder} color="#e65100" height={130} />
                </ChartCard>
                <ChartCard title="Attendance Report" subtitle="This week (daily check-ins)">
                    <LineChart data={weeklyData.length ? weeklyData : placeholder} color="#3b82f6" height={130} />
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ChartCard title="Membership Growth" subtitle="Total members — last 6 months">
                    <LineChart data={memberGrowthData.length ? memberGrowthData : placeholder} color="#10b981" height={130} />
                </ChartCard>

                {/* Membership Breakdown */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#e65100] mb-4">Membership Breakdown</p>
                    <div className="space-y-4">
                        {[
                            { label: 'Active', value: stats.active, total: stats.total, color: 'bg-emerald-400', text: 'text-emerald-400' },
                            { label: 'Expired', value: stats.expired, total: stats.total, color: 'bg-red-400', text: 'text-red-400' },
                            { label: 'Expiring Soon', value: stats.expiringSoon, total: stats.total, color: 'bg-amber-400', text: 'text-amber-400' },
                        ].map(({ label, value, total, color, text }) => {
                            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                            return (
                                <div key={label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">{label}</span>
                                        <span className={`font-semibold ${text}`}>{value} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChartCard({ title, subtitle, children }) {
    return (
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#e65100]">{title}</span>
                <span className="text-[10px] sm:text-xs text-gray-500">{subtitle}</span>
            </div>
            {children}
        </div>
    );
}
