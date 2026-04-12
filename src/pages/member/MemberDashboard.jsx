import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import memberService from '../../services/memberService';
import MemberRegistrationForm from './MemberRegistrationForm';
import PendingApproval from './PendingApproval';
import SelectPlanAndPay from './SelectPlanAndPay';
import {
    Crown,
    CalendarDays,
    TrendingUp,
    Timer,
    Flame,
    Trophy,
    Footprints,
    ClipboardList,
    LogIn,
    Settings,
    PersonStanding,
    Ban,
    Check,
} from 'lucide-react';

const calculateStreaks = (dates) => {
    if (!dates.length) return { current: 0, longest: 0 };
    const sorted = [...dates].sort((a, b) => a.localeCompare(b));
    let current = 0;
    const today = new Date();
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

const MemberDashboard = () => {
    const { setHideSidebar } = useOutletContext();
    const [status, setStatus] = useState(undefined); // undefined = loading
    const [profile, setProfile] = useState(null);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentRecords, setRecentRecords] = useState([]);
    const [todayCheckIn, setTodayCheckIn] = useState(null); // { id, check_in, check_out } or null
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);

    const fetchStatus = useCallback(async () => {
        setLoading(true);
        try {
            const data = await memberService.getMyStatus();
            const s = data?.status ?? null;
            setStatus(s);

            // Hide sidebar for non-active states
            const fullScreenStates = [null, 'pending', 'approved', 'blocked'];
            setHideSidebar(fullScreenStates.includes(s));

            if (s === 'active' || s === 'expired' || s === 'expiring_soon') {
                try {
                    const [prof, att, records, checkin] = await Promise.all([
                        memberService.getMemberProfile(),
                        memberService.getMemberAttendance(),
                        memberService.getMemberAttendanceRecords(),
                        memberService.getTodayCheckIn(),
                    ]);
                    setProfile(prof);
                    setDates(att);
                    setRecentRecords(records);
                    setTodayCheckIn(checkin);
                } catch {
                    // Profile/attendance fetch failed but member IS registered — don't reset status
                }
            }
        } catch {
            setStatus(null);
            setHideSidebar(true);
        } finally {
            setLoading(false);
        }
    }, [setHideSidebar]);

    useEffect(() => { fetchStatus(); }, [fetchStatus]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Not registered — show registration form
    if (status === null) {
        return <MemberRegistrationForm onDone={fetchStatus} />;
    }

    // Pending approval
    if (status === 'pending') {
        return <PendingApproval />;
    }

    // Approved — select plan & pay
    if (status === 'approved') {
        return <SelectPlanAndPay onDone={fetchStatus} />;
    }

    // Blocked
    if (status === 'blocked') {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <Ban size={48} className="text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Account Blocked</h2>
                <p className="text-sm text-gray-400 max-w-md">
                    Your membership has been blocked. Please contact the gym owner for more information.
                </p>
            </div>
        );
    }

    // Active / expired / expiring_soon — full dashboard
    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <PersonStanding size={48} className="text-gray-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Not Registered Yet</h2>
                <p className="text-sm text-gray-400 max-w-md">
                    Your account exists but you haven't been registered as a member at any gym yet.
                    Please ask your gym owner to register you.
                </p>
            </div>
        );
    }

    const { current, longest } = calculateStreaks(dates);
    const now = new Date();
    const monthVisits = dates.filter((d) => {
        const date = new Date(d);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const expiryDate = new Date(profile.expiryDate);
    const daysRemaining = Math.max(0, Math.ceil((expiryDate - now) / 86400000));
    const joinDate = new Date(profile.joinDate);
    const totalDays = Math.ceil((expiryDate - joinDate) / 86400000);
    const elapsed = totalDays - daysRemaining;
    const progressPct = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

    const today = now.toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    const monthName = now.toLocaleString('en-IN', { month: 'long' });

    const isCheckedIn = todayCheckIn && !todayCheckIn.checkOut;

    const handleCheckInOut = async () => {
        setCheckInLoading(true);
        try {
            if (isCheckedIn) {
                await memberService.selfCheckOut();
                setTodayCheckIn((prev) => ({ ...prev, checkOut: new Date().toTimeString().slice(0, 5) }));
            } else {
                const result = await memberService.selfCheckIn();
                setTodayCheckIn(result.attendance);
                // Refresh attendance dates
                memberService.getMemberAttendance().then(setDates).catch(() => {});
            }
        } catch {
            // silently fail — button will stay in current state
        } finally {
            setCheckInLoading(false);
        }
    };

    return (
        <div className="min-h-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                        Welcome back, {profile.name.split(' ')[0]}! <span className="inline-block animate-pulse">👋</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{today}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-[#e65100] uppercase tracking-wider flex items-center gap-1 justify-end">
                            <Crown size={12} /> Premium Member
                        </span>
                        <p className="text-[11px] text-gray-500">ID: {profile.id.toUpperCase()}</p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e65100] flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                        {profile.name.charAt(0)}
                    </div>
                </div>
            </div>

            {/* Membership Status Card */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col gap-4 sm:gap-6">
                    <div className="flex-1">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Active Status
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                            {profile.planName} Membership
                        </h2>

                        {/* Progress Bar */}
                        <div className="mb-2">
                            <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 mb-2">
                                <span>Progress</span>
                                <span className="text-[#e65100] font-semibold">{daysRemaining} days remaining</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#e65100] to-[#f57c00] rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => setShowPlanModal(true)}
                            className="flex-1 sm:flex-none px-3 sm:px-5 py-2.5 bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                            <Settings size={14} /> <span>Manage Plan</span>
                        </button>
                        <button
                            onClick={handleCheckInOut}
                            disabled={checkInLoading}
                            className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60 ${
                                isCheckedIn
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                    : 'bg-[#e65100] hover:bg-[#bf360c] shadow-[#e65100]/20'
                            }`}
                        >
                            {checkInLoading
                                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : isCheckedIn
                                    ? <><Check size={14} /> <span>Checked In · Tap to Check Out</span></>
                                    : <><LogIn size={14} /> <span>Check In Now</span></>
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Current Plan */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Current Plan</span>
                        <Crown size={16} className="text-[#e65100] sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <p className="text-base sm:text-xl font-extrabold text-white uppercase">{profile.planName}</p>
                    <p className="text-[10px] sm:text-xs text-[#e65100] mt-1.5 sm:mt-2 font-semibold">
                        {profile.plans?.durationDays ? `${profile.plans.durationDays} day plan` : `${daysRemaining + elapsed} day plan`}
                    </p>
                </div>

                {/* Expiry Date */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Expiry Date</span>
                        <CalendarDays size={16} className="text-[#e65100] sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <p className="text-base sm:text-xl font-extrabold text-white">
                        {expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${daysRemaining <= 7 ? 'text-red-400 font-semibold' : 'text-gray-500'}`}>
                        {daysRemaining <= 0 ? 'Expired — Renew now' : daysRemaining <= 7 ? 'Expiring soon — Renew now' : daysRemaining <= 30 ? 'Renewal recommended' : 'Active'}
                    </p>
                </div>

                {/* Visits This Month */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Visits ({monthName.substring(0, 3).toUpperCase()})</span>
                        <TrendingUp size={16} className="text-[#e65100] sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <p className="text-2xl sm:text-3xl font-extrabold text-white">{monthVisits}</p>
                        <p className="text-[10px] sm:text-sm font-semibold text-gray-500 uppercase">Visits</p>
                    </div>
                    <div className="mt-1.5 sm:mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#e65100] rounded-full" style={{ width: `${Math.min(100, (monthVisits / 25) * 100)}%` }} />
                    </div>
                </div>

                {/* Remaining Days */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Remaining</span>
                        <Timer size={16} className="text-[#e65100] sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{daysRemaining}</p>
                    <p className="text-[10px] sm:text-sm font-semibold text-gray-500 uppercase">Days Left</p>
                </div>
            </div>

            {/* Streak Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Current Streak */}
                <div className="bg-[#1a1400] border border-[#e65100]/20 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#e65100]/10 flex items-center justify-center flex-shrink-0">
                        <Flame size={20} className="text-[#e65100] sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Current Streak</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white">{current} {current === 1 ? 'Day' : 'Days'}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-0.5">
                            {current > 0 ? 'Keep it going!' : 'Check in to start a streak'}
                        </p>
                    </div>
                </div>

                {/* Longest Streak */}
                <div className="bg-[#1a1400] border border-[#e65100]/20 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#e65100]/10 flex items-center justify-center flex-shrink-0">
                        <Trophy size={20} className="text-[#e65100] sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Longest Streak</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white">{longest} {longest === 1 ? 'Day' : 'Days'}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-0.5 truncate">
                            {longest > 0 ? 'Personal best' : 'No streak yet'}
                        </p>
                    </div>
                </div>

                {/* Total Visits */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#e65100]/10 flex items-center justify-center flex-shrink-0">
                        <Footprints size={20} className="text-[#e65100] sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Visits</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white">{dates.length} {dates.length === 1 ? 'Visit' : 'Visits'}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-0.5">
                            Since {joinDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5">Recent Activity</h3>
                    <div className="space-y-3 sm:space-y-4">
                        {recentRecords.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-6">No attendance records yet. Check in to get started!</p>
                        ) : (
                            recentRecords.slice(0, 5).map((record, idx) => {
                                const recDate = new Date(record.date);
                                const todayStr = new Date().toISOString().split('T')[0];
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                const yesterdayStr = yesterday.toISOString().split('T')[0];
                                const dayLabel = record.date === todayStr ? 'Today' : record.date === yesterdayStr ? 'Yesterday' : recDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                                const hasCheckOut = !!record.checkOut;

                                return (
                                    <div key={record.date + record.checkIn + idx} className={`flex items-center justify-between py-2 sm:py-3 ${idx < Math.min(recentRecords.length, 5) - 1 ? 'border-b border-white/5' : ''}`}>
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${hasCheckOut ? 'bg-emerald-500/10' : 'bg-[#e65100]/10'}`}>
                                                <PersonStanding size={18} className={`sm:w-5 sm:h-5 ${hasCheckOut ? 'text-emerald-400' : 'text-[#e65100]'}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-white">
                                                    {hasCheckOut ? 'Completed Session' : 'Checked In'}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-gray-500">
                                                    {record.checkIn}{hasCheckOut ? ` — ${record.checkOut}` : ' · Still active'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-2">
                                            <p className="text-xs sm:text-sm font-semibold text-white">{record.checkIn}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500">{dayLabel}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 sm:mb-2 flex items-center gap-1.5">
                            <ClipboardList size={11} /> Membership
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-white">{profile.planName}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            Joined {joinDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="bg-[#1a1400] border border-[#e65100]/20 rounded-2xl p-4 sm:p-5">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#e65100] mb-1.5 sm:mb-2">Today's Status</p>
                        <p className="text-xs sm:text-sm font-bold text-white">
                            {todayCheckIn
                                ? todayCheckIn.checkOut
                                    ? 'Session Complete'
                                    : 'Currently at Gym'
                                : 'Not Checked In'}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                            {todayCheckIn
                                ? `Checked in at ${todayCheckIn.checkIn}`
                                : 'Tap Check In to start'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Manage Plan Modal */}
            {showPlanModal && (
                <PlanModal
                    profile={profile}
                    daysRemaining={daysRemaining}
                    onClose={() => setShowPlanModal(false)}
                    onPlanChanged={fetchStatus}
                />
            )}
        </div>
    );
};

function PlanModal({ profile, daysRemaining, onClose, onPlanChanged }) {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [method, setMethod] = useState('cash');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        memberService.getAvailablePlans()
            .then(setPlans)
            .catch(() => setError('Failed to load plans'))
            .finally(() => setLoading(false));
    }, []);

    const handleRenew = async () => {
        if (!selectedPlan) return;
        setError('');
        setSubmitting(true);
        try {
            await memberService.activateWithPayment({
                planId: selectedPlan.id,
                method,
                amount: selectedPlan.price,
            });
            setSuccess(true);
            setTimeout(() => { onPlanChanged(); onClose(); }, 1500);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to process. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-extrabold text-white">Manage Plan</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">&times;</button>
                </div>

                {/* Current plan info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Current Plan</p>
                    <p className="text-base font-bold text-white">{profile.planName}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                        <span>Expires: {new Date(profile.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className={`font-semibold ${daysRemaining <= 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {daysRemaining} days left
                        </span>
                    </div>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-3">
                            <Check size={28} className="text-emerald-400" />
                        </div>
                        <p className="text-base font-bold text-white">Plan Updated!</p>
                        <p className="text-xs text-gray-500 mt-1">Your membership has been renewed.</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-sm text-red-400">{error}</div>
                        )}

                        {/* Plan selection */}
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Switch or Renew Plan</p>
                        {loading ? (
                            <div className="flex justify-center py-6">
                                <div className="w-6 h-6 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : plans.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No plans available.</p>
                        ) : (
                            <div className="space-y-2 mb-5">
                                {plans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                                            selectedPlan?.id === plan.id
                                                ? 'bg-[#e65100]/10 border-[#e65100]'
                                                : 'bg-white/5 border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-white">{plan.name}</p>
                                            <p className="text-xs text-gray-500">{plan.durationDays} days</p>
                                        </div>
                                        <p className="text-base font-extrabold text-white">₹{plan.price}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Payment method */}
                        {selectedPlan && (
                            <>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Method</p>
                                <div className="flex gap-2 mb-5">
                                    {['cash', 'upi', 'card'].map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setMethod(m)}
                                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors capitalize ${
                                                method === m
                                                    ? 'bg-[#e65100] text-white'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleRenew}
                                    disabled={submitting}
                                    className="w-full py-3 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 disabled:opacity-50"
                                >
                                    {submitting ? 'Processing...' : `Pay ₹${selectedPlan.price} & Activate`}
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default MemberDashboard;
