import { useEffect, useState, useMemo } from 'react';
import memberService from '../../services/memberService';
import {
    Dumbbell,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Home,
    Target,
    Sun,
    Sunset,
    Moon,
    Timer,
    Award,
    AlertCircle,
    ChevronRight as ChevronR,
} from 'lucide-react';

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const calculateStreaks = (dates) => {
    if (!dates.length) return { current: 0, longest: 0 };
    const sorted = [...dates].sort((a, b) => a.localeCompare(b));
    const today = new Date();
    let current = 0;
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (dates.includes(d.toISOString().split('T')[0])) current++;
        else break;
    }
    let longest = 1, streak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000;
        if (diff === 1) { streak++; longest = Math.max(longest, streak); }
        else streak = 1;
    }
    return { current, longest };
};

const getBestDay = (dates) => {
    if (!dates.length) return '—';
    const counts = [0, 0, 0, 0, 0, 0, 0];
    dates.forEach((d) => { counts[new Date(d).getDay()]++; });
    const max = Math.max(...counts);
    if (max === 0) return '—';
    const idx = counts.indexOf(max);
    return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][idx];
};

// Parse "HH:MM" or "HH:MM:SS" to hours as float
const parseTimeToHours = (t) => {
    if (!t) return null;
    const parts = t.split(':');
    return parseInt(parts[0], 10) + parseInt(parts[1] || '0', 10) / 60;
};

const Attendance = () => {
    const [attendanceDates, setAttendanceDates] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        Promise.all([
            memberService.getMemberAttendance(),
            memberService.getMemberAttendanceRecords(),
        ]).then(([dates, recs]) => {
            setAttendanceDates(dates);
            setRecords(recs);
        }).finally(() => setLoading(false));
    }, []);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();
    const prevPadding = Array.from({ length: firstDay }, (_, i) => ({
        day: prevMonthDays - firstDay + 1 + i,
        isOtherMonth: true,
    }));
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        isOtherMonth: false,
    }));
    const totalCells = prevPadding.length + currentDays.length;
    const nextPadding = Array.from({ length: (7 - (totalCells % 7)) % 7 }, (_, i) => ({
        day: i + 1,
        isOtherMonth: true,
    }));
    const cells = [...prevPadding, ...currentDays, ...nextPadding];

    const toDateStr = (day) => {
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    };

    const attended = new Set(attendanceDates);
    const today = new Date().toISOString().split('T')[0];

    const monthVisits = attendanceDates.filter((d) => {
        const date = new Date(d);
        return date.getMonth() === month && date.getFullYear() === year;
    }).length;

    const { current, longest } = calculateStreaks(attendanceDates);

    const prevMonthNav = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonthNav = () => setViewDate(new Date(year, month + 1, 1));
    const isCurrentMonth = month === new Date().getMonth() && year === new Date().getFullYear();

    const bestDayInMonth = useMemo(() => {
        const monthDates = attendanceDates.filter((d) => {
            const date = new Date(d);
            return date.getMonth() === month && date.getFullYear() === year;
        });
        if (!monthDates.length) return null;
        return monthDates.sort((a, b) => b.localeCompare(a))[0];
    }, [attendanceDates, month, year]);

    // Recent activity from real records (newest first)
    const recentActivity = useMemo(() => {
        return [...records]
            .sort((a, b) => (b.date + b.checkIn).localeCompare(a.date + a.checkIn))
            .slice(0, 5)
            .map((r) => {
                const dt = new Date(r.date);
                const checkInH = parseTimeToHours(r.checkIn);
                const checkOutH = parseTimeToHours(r.checkOut);
                const duration = (checkInH !== null && checkOutH !== null)
                    ? Math.round((checkOutH - checkInH) * 60)
                    : null;
                return {
                    key: r.date + r.checkIn,
                    date: r.date,
                    day: dt.getDate(),
                    month: SHORT_MONTHS[dt.getMonth()],
                    checkIn: r.checkIn,
                    checkOut: r.checkOut,
                    duration,
                };
            });
    }, [records]);

    // Compute peak performance stats from real records
    const perfStats = useMemo(() => {
        if (!records.length) return { morning: 0, midday: 0, evening: 0, avgDuration: 0 };

        let morning = 0, midday = 0, evening = 0;
        let totalDuration = 0, durationCount = 0;

        for (const r of records) {
            const h = parseTimeToHours(r.checkIn);
            if (h !== null) {
                if (h < 12) morning++;
                else if (h < 17) midday++;
                else evening++;
            }
            const checkOutH = parseTimeToHours(r.checkOut);
            if (h !== null && checkOutH !== null && checkOutH > h) {
                totalDuration += (checkOutH - h) * 60;
                durationCount++;
            }
        }

        const total = morning + midday + evening;
        return {
            morning: total > 0 ? Math.round((morning / total) * 100) : 0,
            midday: total > 0 ? Math.round((midday / total) * 100) : 0,
            evening: total > 0 ? Math.round((evening / total) * 100) : 0,
            avgDuration: durationCount > 0 ? Math.round(totalDuration / durationCount) : 0,
        };
    }, [records]);

    const missedLast14 = useMemo(() => {
        let count = 0;
        const now = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const str = d.toISOString().split('T')[0];
            if (!attended.has(str) && d.getDay() !== 0) count++;
        }
        return count;
    }, [attendanceDates]);

    const bestDay = useMemo(() => getBestDay(attendanceDates), [attendanceDates]);

    const monthlyGoal = 22;

    // Previous month visit count for comparison
    const prevMonthVisits = useMemo(() => {
        const pm = month === 0 ? 11 : month - 1;
        const py = month === 0 ? year - 1 : year;
        return attendanceDates.filter((d) => {
            const date = new Date(d);
            return date.getMonth() === pm && date.getFullYear() === py;
        }).length;
    }, [attendanceDates, month, year]);

    const visitChangeText = useMemo(() => {
        if (prevMonthVisits === 0) return monthVisits > 0 ? `+${monthVisits} this month` : 'No visits yet';
        const pct = Math.round(((monthVisits - prevMonthVisits) / prevMonthVisits) * 100);
        return pct >= 0 ? `+${pct}% vs last month` : `${pct}% vs last month`;
    }, [monthVisits, prevMonthVisits]);

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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-3">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">Attendance</h1>
                    <p className="text-[11px] text-gray-500 mt-1">Tracking performance since {new Date(attendanceDates.sort()[0] || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
                <span className="inline-flex items-center gap-2 bg-[#e65100] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full self-start flex-shrink-0">
                    <Dumbbell size={12} /> {attendanceDates.length} Total Visits
                </span>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {/* Total Visits */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Visits</p>
                        <CalendarDays size={16} className="text-gray-600" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-white">{attendanceDates.length}</p>
                    <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${monthVisits >= prevMonthVisits ? 'text-emerald-400' : 'text-red-400'}`}>
                        <TrendingUp size={11} /> {visitChangeText}
                    </p>
                </div>

                {/* Current Streak */}
                <div className="bg-[#1a1400] border-2 border-[#e65100]/40 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#e65100]">Current Streak</p>
                        <Home size={16} className="text-[#e65100]" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-white">{current} <span className="text-xl sm:text-2xl">{current === 1 ? 'DAY' : 'DAYS'}</span></p>
                    <p className="text-[11px] text-gray-500 mt-1">Your personal best is {longest} {longest === 1 ? 'day' : 'days'}</p>
                </div>

                {/* Monthly Goal */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Monthly Goal</p>
                        <Target size={16} className="text-gray-600" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-white">{monthVisits} <span className="text-lg sm:text-xl text-gray-500">/ {monthlyGoal}</span></p>
                    <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#e65100] to-[#f57c00] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (monthVisits / monthlyGoal) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content: Calendar + Right Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    {/* Calendar Title + Nav */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <CalendarDays size={16} className="text-[#e65100] flex-shrink-0" />
                            <span>Attendance Calendar</span>
                        </h2>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={prevMonthNav}
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <span className="text-xs sm:text-sm font-bold text-[#e65100] uppercase tracking-wider text-center whitespace-nowrap">
                                {MONTH_NAMES[month].toUpperCase()} {year}
                            </span>
                            <button
                                onClick={nextMonthNav}
                                disabled={isCurrentMonth}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                                    isCurrentMonth
                                        ? 'bg-white/5 text-gray-700 cursor-not-allowed'
                                        : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                                }`}
                                aria-label="Next month"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 mb-1">
                        {DAY_NAMES.map((day) => (
                            <div key={day} className="text-center text-[9px] sm:text-[10px] font-bold text-gray-500 py-1.5 sm:py-2 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-white/5 mb-2" />

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                        {cells.map((cell, idx) => {
                            if (cell.isOtherMonth) {
                                return (
                                    <div key={`other-${idx}`} className="aspect-square flex items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-700 font-medium">
                                        {cell.day}
                                    </div>
                                );
                            }
                            const dateStr = toDateStr(cell.day);
                            const isAttended = attended.has(dateStr);
                            const isToday = dateStr === today;
                            const isFutureDay = dateStr > today;

                            return (
                                <div
                                    key={dateStr}
                                    className={`
                                        aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all relative
                                        ${isToday && isAttended
                                            ? 'bg-[#b8e600] text-[#0a0a0a] shadow-md shadow-[#b8e600]/20'
                                            : isAttended
                                                ? 'bg-[#e65100] text-white shadow-md shadow-[#e65100]/20'
                                                : isToday
                                                    ? 'bg-[#e65100]/20 text-[#e65100] ring-2 ring-[#e65100]'
                                                    : isFutureDay
                                                        ? 'text-gray-700'
                                                        : 'bg-[#1a1a1a] text-gray-500'
                                        }
                                    `}
                                >
                                    <span>{cell.day}</span>
                                    {isAttended && !isToday && (
                                        <span className="absolute bottom-0.5 sm:bottom-1 w-1 h-1 rounded-full bg-white/60" />
                                    )}
                                    {isToday && !isAttended && (
                                        <span className="absolute bottom-0.5 sm:bottom-1 w-1 h-1 rounded-full bg-[#e65100]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#e65100] inline-block" />
                            Visited
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#b8e600] inline-block" />
                            Today + Visited
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ring-2 ring-[#e65100] inline-block" />
                            Today
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4">
                    {/* Recent Activity */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mb-4">Recent Activity</h3>
                        <div className="space-y-2 sm:space-y-3">
                            {recentActivity.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No sessions yet.</p>
                            ) : recentActivity.map((a) => (
                                <div key={a.key} className="flex items-center gap-3 py-2 group">
                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#e65100]/10 border border-[#e65100]/30 flex flex-col items-center justify-center flex-shrink-0">
                                        <span className="text-[7px] sm:text-[8px] font-bold text-[#e65100] uppercase leading-none">{a.month}</span>
                                        <span className="text-xs sm:text-sm font-black text-white leading-none">{a.day}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-bold text-white truncate">
                                            {a.checkOut ? 'Completed Session' : 'Checked In'}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {a.checkIn}{a.checkOut ? ` — ${a.checkOut}` : ' · Active'}
                                            {a.duration !== null && a.duration > 0 ? ` · ${a.duration}m` : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#1a1400] border border-[#e65100]/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1400] to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#e65100]/5 to-transparent" />
                        <div className="relative z-20">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#e65100] mb-1">Summary</p>
                            <p className="text-base sm:text-lg font-black text-white">{attendanceDates.length} Lifetime Visits</p>
                            <p className="text-[11px] text-gray-500 mt-1">
                                {current > 0
                                    ? `On a ${current} day streak — keep it going!`
                                    : 'Check in today to start a new streak'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Peak Performance Hours */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6 mb-6">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mb-4 sm:mb-5">Peak Performance Hours</h3>
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 text-center">
                        <Sun size={14} className="text-gray-500 mx-auto mb-1.5 sm:mb-2 sm:w-4 sm:h-4" />
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5 sm:mb-1">Morning</p>
                        <p className="text-lg sm:text-2xl font-black text-white">{perfStats.morning}%</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-600 uppercase">Sessions</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 text-center">
                        <Sunset size={14} className="text-gray-500 mx-auto mb-1.5 sm:mb-2 sm:w-4 sm:h-4" />
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5 sm:mb-1">Mid-Day</p>
                        <p className="text-lg sm:text-2xl font-black text-white">{perfStats.midday}%</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-600 uppercase">Sessions</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 text-center">
                        <Moon size={14} className="text-gray-500 mx-auto mb-1.5 sm:mb-2 sm:w-4 sm:h-4" />
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5 sm:mb-1">Evening</p>
                        <p className="text-lg sm:text-2xl font-black text-white">{perfStats.evening}%</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-600 uppercase">Sessions</p>
                    </div>
                    <div className="bg-[#e65100]/10 border border-[#e65100]/30 rounded-xl p-3 sm:p-4 text-center">
                        <Timer size={14} className="text-[#e65100] mx-auto mb-1.5 sm:mb-2 sm:w-4 sm:h-4" />
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#e65100] mb-0.5 sm:mb-1">Avg. Duration</p>
                        <p className="text-lg sm:text-2xl font-black text-white">{perfStats.avgDuration > 0 ? `${perfStats.avgDuration}m` : '—'}</p>
                        <p className="text-[8px] sm:text-[10px] text-[#e65100] uppercase">Per Session</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 text-center">
                        <Award size={14} className="text-gray-500 mx-auto mb-1.5 sm:mb-2 sm:w-4 sm:h-4" />
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5 sm:mb-1">Best Day</p>
                        <p className="text-lg sm:text-2xl font-black text-white">{bestDay}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-600 uppercase">Consistency</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-4 text-center">
                        <AlertCircle size={14} className="text-gray-500 mx-auto mb-1.5 sm:mb-2 sm:w-4 sm:h-4" />
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5 sm:mb-1">Missed</p>
                        <p className="text-lg sm:text-2xl font-black text-white">{missedLast14}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-600 uppercase">Last 14 Days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
