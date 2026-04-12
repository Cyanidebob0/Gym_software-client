import { useEffect, useState } from 'react';
import attendanceService from '../../../services/attendanceService';
import memberService from '../../../services/memberService';
import Modal from '../../../components/owner/Modal';
import {
    CalendarCheck,
    Users,
    Clock,
    TrendingUp,
    Plus,
    LogOut as LogOutIcon,
    Trash2,
    Wifi,
    Zap,
} from 'lucide-react';

export default function AttendancePage() {
    const [records, setRecords] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [modal, setModal] = useState(false);
    const [selMember, setSelMember] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // 'id:action'
    const [markingIn, setMarkingIn] = useState(false);

    const load = () => attendanceService.getByDate(date).then(setRecords);

    useEffect(() => { load(); }, [date]);
    useEffect(() => {
        Promise.all([
            load(),
            memberService.getAll().then((m) => setMembers(m.filter((x) => x.status === 'active' || x.status === 'expiring_soon'))),
        ]).finally(() => setLoading(false));
    }, []);

    const handleMark = async (e) => {
        e.preventDefault();
        if (!selMember) return;
        const member = members.find((m) => m.id === selMember);
        if (!member) return;
        setMarkingIn(true);
        try {
            await attendanceService.markAttendance(member.id, member.name);
            setModal(false);
            setSelMember('');
            load();
        } finally {
            setMarkingIn(false);
        }
    };

    const handleCheckout = async (id) => {
        setActionLoading(`${id}:checkout`);
        try {
            await attendanceService.markCheckout(id);
            load();
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Remove this attendance record?')) return;
        setActionLoading(`${id}:remove`);
        try {
            await attendanceService.remove(id);
            load();
        } finally {
            setActionLoading(null);
        }
    };

    const present = records.filter((r) => !r.checkOut);

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <CalendarCheck size={24} className="text-[#e65100]" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Attendance Management</h1>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs sm:text-sm text-gray-500">{records.length} check-ins · {present.length} present</p>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                            <Wifi size={10} /> Live Sync
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setModal(true)}
                    className="flex items-center gap-2 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 w-fit"
                >
                    <Plus size={16} /> Mark Attendance
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Currently Present</p>
                        <Users size={18} className="text-emerald-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{present.length}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Active in gym right now</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Remaining Capacity</p>
                        <Clock size={18} className="text-[#e65100]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{Math.max(0, 50 - present.length)}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Out of 50 max capacity</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Peak Hour</p>
                        <TrendingUp size={18} className="text-blue-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">6–8 PM</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Most check-ins today</p>
                </div>
            </div>

            {/* Date selector */}
            <div className="flex items-center gap-3 mb-4">
                <label className="text-xs text-gray-500 font-semibold">Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                />
            </div>

            {/* Daily Activity Logs */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden mb-6">
                <div className="px-4 sm:px-6 py-4 border-b border-white/5">
                    <h3 className="text-sm sm:text-base font-bold text-white">Daily Activity Logs</h3>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto scrollbar-none">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Member</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Check-in</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Check-out</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No attendance records for {date}.
                                    </td>
                                </tr>
                            ) : (
                                records.map((r) => (
                                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                                                    {r.memberName.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-white">{r.memberName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-400">{r.checkIn}</td>
                                        <td className="px-4 py-4 text-gray-400">
                                            {r.checkOut ?? (
                                                <button
                                                    onClick={() => handleCheckout(r.id)}
                                                    disabled={!!actionLoading}
                                                    className="text-xs bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    {actionLoading === `${r.id}:checkout` ? <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> : <LogOutIcon size={12} />} Mark Out
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {r.checkOut === null ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Present
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">Done</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemove(r.id)}
                                                disabled={!!actionLoading}
                                                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ml-auto disabled:opacity-50"
                                            >
                                                {actionLoading === `${r.id}:remove` ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={12} />} Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-white/5">
                    {records.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No records for {date}.</div>
                    ) : (
                        records.map((r) => (
                            <div key={r.id} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                                            {r.memberName.charAt(0)}
                                        </div>
                                        <p className="text-sm font-semibold text-white">{r.memberName}</p>
                                    </div>
                                    {r.checkOut === null ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Present
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-semibold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">Done</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>In: {r.checkIn} · Out: {r.checkOut ?? '—'}</span>
                                    <div className="flex gap-2">
                                        {!r.checkOut && (
                                            <button onClick={() => handleCheckout(r.id)} disabled={!!actionLoading} className="text-emerald-400 font-semibold disabled:opacity-50">
                                                {actionLoading === `${r.id}:checkout` ? 'Saving...' : 'Mark Out'}
                                            </button>
                                        )}
                                        <button onClick={() => handleRemove(r.id)} disabled={!!actionLoading} className="text-red-400 font-semibold disabled:opacity-50">
                                            {actionLoading === `${r.id}:remove` ? 'Removing...' : 'Remove'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Upgrade Banner */}
            <div className="bg-[#1a1400] border border-[#e65100]/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Zap size={28} className="text-[#e65100] flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-white">Upgrade to Enterprise</p>
                        <p className="text-xs text-gray-500">Unlock biometric check-in, capacity alerts, and advanced analytics.</p>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-[#e65100] text-white text-sm font-semibold rounded-xl hover:bg-[#bf360c] transition-colors whitespace-nowrap">
                    Upgrade Now
                </button>
            </div>

            {/* Mark Attendance Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title="Mark Attendance" size="sm">
                <form onSubmit={handleMark} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select Member</label>
                        <select
                            value={selMember}
                            onChange={(e) => setSelMember(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100] [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                        >
                            <option value="">-- Choose member --</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={markingIn} className="flex-1 bg-[#e65100] hover:bg-[#bf360c] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {markingIn && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {markingIn ? 'Marking...' : 'Mark Check-in'}
                        </button>
                        <button type="button" onClick={() => setModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-2.5 rounded-xl text-sm transition-colors border border-white/10">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
