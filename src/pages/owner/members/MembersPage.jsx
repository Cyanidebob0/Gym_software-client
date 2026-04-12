import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import memberService from '../../../services/memberService';
import {
    Users,
    UserCheck,
    UserX,
    DollarSign,
    Plus,
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    Pencil,
    RefreshCw,
    Ban,
    XCircle,
    CheckCircle,
    Clock,
} from 'lucide-react';

const FILTERS = [
    { key: 'all',           label: 'All' },
    { key: 'pending',       label: 'Pending' },
    { key: 'active',        label: 'Active' },
    { key: 'expired',       label: 'Expired' },
    { key: 'expiring_soon', label: 'Expiring Soon' },
    { key: 'blocked',       label: 'Blocked' },
];

const StatusBadge = ({ status }) => {
    const map = {
        active:        'text-emerald-400 bg-emerald-400/10',
        expired:       'text-red-400 bg-red-400/10',
        expiring_soon: 'text-amber-400 bg-amber-400/10',
        blocked:       'text-gray-400 bg-gray-400/10',
        pending:       'text-amber-400 bg-amber-400/10',
        approved:      'text-emerald-400 bg-emerald-400/10',
    };
    const labels = { active: 'Active', expired: 'Expired', expiring_soon: 'Expiring', blocked: 'Blocked', pending: 'Pending', approved: 'Approved' };
    return (
        <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? 'text-gray-400 bg-gray-400/10'}`}>
            {labels[status] ?? status}
        </span>
    );
};

export default function MembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // 'id:action'
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get('filter') ?? 'all';

    useEffect(() => {
        memberService.getAll().then(setMembers).finally(() => setLoading(false));
    }, []);

    const handleAction = async (id, action) => {
        setActionLoading(`${id}:${action}`);
        try {
            if (action === 'approve' || action === 'reject') {
                const status = action === 'approve' ? 'approved' : 'blocked';
                await memberService.approveMember(id, status);
                memberService.getAll().then(setMembers);
                return;
            }
            const statusMap = { renew: 'active', cancel: 'expired', block: 'blocked' };
            if (statusMap[action]) {
                await memberService.update(id, { status: statusMap[action] });
                memberService.getAll().then(setMembers);
            }
        } finally {
            setActionLoading(null);
        }
    };

    const setFilter = (key) => setSearchParams(key === 'all' ? {} : { filter: key });

    const filtered = members.filter((m) => {
        const matchesFilter = filter === 'all' || m.status === filter;
        const q = search.toLowerCase();
        const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q);
        return matchesFilter && matchesSearch;
    });

    const activeCount = members.filter((m) => m.status === 'active').length;
    const expiredCount = members.filter((m) => m.status === 'expired').length;
    const pendingCount = members.filter((m) => m.status === 'pending').length;

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
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Members</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{filtered.length} members shown</p>
                </div>
                <Link
                    to="/owner/members/new"
                    className="flex items-center gap-2 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 w-fit"
                >
                    <Plus size={16} /> Add Member
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Members</p>
                        <Users size={16} className="text-[#e65100]" />
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-white">{members.length}</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Active</p>
                        <UserCheck size={16} className="text-emerald-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-white">{activeCount}</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Expired</p>
                        <UserX size={16} className="text-red-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-white">{expiredCount}</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Monthly Revenue</p>
                        <DollarSign size={16} className="text-blue-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-white">₹0</p>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                    />
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                        <SlidersHorizontal size={14} /> Filter
                    </button>
                    <button className="px-3 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                        <ArrowUpDown size={14} /> Sort
                    </button>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap mb-4">
                {FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            filter === key
                                ? 'bg-[#e65100] text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {label}
                        {key === 'pending' && pendingCount > 0 && (
                            <span className="bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto scrollbar-none">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Member</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Expiry</th>
                                <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No members found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((m) => (
                                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-sm font-bold text-[#e65100] flex-shrink-0">
                                                    {m.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-white">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-400">{m.phone}</td>
                                        <td className="px-4 py-4 text-gray-500 hidden lg:table-cell">{m.email}</td>
                                        <td className="px-4 py-4 text-gray-300 font-medium">{m.planName ?? '—'}</td>
                                        <td className="px-4 py-4"><StatusBadge status={m.status} /></td>
                                        <td className="px-4 py-4 text-gray-500 hidden xl:table-cell">{m.expiryDate ?? '—'}</td>
                                        <td className="px-6 py-4 text-right">
                                            {m.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/owner/members/${m.id}`}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                                    >
                                                        <Eye size={14} /> View
                                                    </Link>
                                                    <button
                                                        onClick={() => handleAction(m.id, 'approve')}
                                                        disabled={!!actionLoading}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 rounded-lg hover:bg-emerald-400/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === `${m.id}:approve` ? <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={14} />} Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(m.id, 'reject')}
                                                        disabled={!!actionLoading}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === `${m.id}:reject` ? <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <XCircle size={14} />} Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <ActionMenu member={m} onAction={handleAction} actionLoading={actionLoading} />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-white/5">
                    {filtered.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No members found.</div>
                    ) : (
                        filtered.map((m) => (
                            <div key={m.id} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-sm font-bold text-[#e65100] flex-shrink-0">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{m.name}</p>
                                            <p className="text-xs text-gray-500">{m.phone}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={m.status} />
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                    <span>{m.planName ?? '—'}</span>
                                    <span>{m.expiryDate ? `Exp: ${m.expiryDate}` : '—'}</span>
                                </div>
                                {m.status === 'pending' && (
                                    <div className="flex gap-2 mt-3">
                                        <Link
                                            to={`/owner/members/${m.id}`}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-gray-300 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <Eye size={14} /> View
                                        </Link>
                                        <button
                                            onClick={() => handleAction(m.id, 'approve')}
                                            disabled={!!actionLoading}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-emerald-400 bg-emerald-400/10 rounded-lg hover:bg-emerald-400/20 transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === `${m.id}:approve` ? <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={14} />} Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(m.id, 'reject')}
                                            disabled={!!actionLoading}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === `${m.id}:reject` ? <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <XCircle size={14} />} Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function ActionMenu({ member, onAction, actionLoading }) {
    const [open, setOpen] = useState(false);
    const btnRef = useState(null);
    const [dropUp, setDropUp] = useState(false);
    const isLoading = actionLoading?.startsWith(`${member.id}:`);

    const handleToggle = () => {
        if (!open) {
            // Check if there's enough space below
            const btn = btnRef[0];
            if (btn) {
                const rect = btn.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setDropUp(spaceBelow < 240);
            }
        }
        setOpen((p) => !p);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                ref={(el) => { btnRef[0] = el; }}
                onClick={handleToggle}
                className="text-gray-500 hover:text-white hover:bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            >
                {isLoading ? <span className="w-4 h-4 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" /> : <MoreHorizontal size={16} />}
            </button>
            {open && !isLoading && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className={`absolute right-0 z-20 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 text-sm ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                        <Link
                            to={`/owner/members/${member.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
                            onClick={() => setOpen(false)}
                        >
                            <Eye size={14} /> View Details
                        </Link>
                        <Link
                            to={`/owner/members/${member.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
                            onClick={() => setOpen(false)}
                        >
                            <Pencil size={14} /> Edit Member
                        </Link>
                        <button
                            onClick={() => { onAction(member.id, 'renew'); setOpen(false); }}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-emerald-400 hover:bg-emerald-400/10"
                        >
                            <RefreshCw size={14} /> Renew
                        </button>
                        <button
                            onClick={() => { onAction(member.id, 'cancel'); setOpen(false); }}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-amber-400 hover:bg-amber-400/10"
                        >
                            <XCircle size={14} /> Cancel
                        </button>
                        <button
                            onClick={() => { onAction(member.id, 'block'); setOpen(false); }}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10"
                        >
                            <Ban size={14} /> Block
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
