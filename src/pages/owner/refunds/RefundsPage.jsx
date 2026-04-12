import { useState, useEffect } from 'react';
import refundService from '../../../services/refundService';
import Modal from '../../../components/owner/Modal';
import {
    RotateCcw,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    ThumbsUp,
    ThumbsDown,
    TrendingUp,
} from 'lucide-react';

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected'];

const StatusBadge = ({ status }) => {
    const map = {
        pending:  'text-amber-400 bg-amber-400/10',
        approved: 'text-emerald-400 bg-emerald-400/10',
        rejected: 'text-red-400 bg-red-400/10',
    };
    return (
        <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? 'text-gray-400 bg-gray-400/10'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default function RefundsPage() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ memberName: '', paymentId: '', amount: '', reason: '' });
    const [actionLoading, setActionLoading] = useState(null); // 'id:action'
    const [submitting, setSubmitting] = useState(false);

    const load = () => refundService.getAll().then(setRefunds).catch(() => {});
    useEffect(() => { load().finally(() => setLoading(false)); }, []);

    const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

    const filtered = refunds.filter((r) => tab === 'all' || r.status === tab);

    const handleAction = async (id, action) => {
        setActionLoading(`${id}:${action}`);
        try {
            await refundService.updateStatus(id, action);
            load();
        } finally {
            setActionLoading(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await refundService.create({
                memberId: form.memberId || undefined,
                paymentId: form.paymentId,
                amount: Number(form.amount),
                reason: form.reason,
            });
            setForm({ memberName: '', paymentId: '', amount: '', reason: '' });
            setModal(false);
            load();
        } finally {
            setSubmitting(false);
        }
    };

    const counts = {
        pending: refunds.filter((r) => r.status === 'pending').length,
        approved: refunds.filter((r) => r.status === 'approved').length,
        rejected: refunds.filter((r) => r.status === 'rejected').length,
    };

    const totalRefunded = refunds.filter((r) => r.status === 'approved').reduce((s, r) => s + r.amount, 0);

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
                        <RotateCcw size={24} className="text-[#e65100]" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Refund Console</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">{counts.pending} pending · {counts.approved} approved · {counts.rejected} rejected</p>
                </div>
                <button
                    onClick={() => setModal(true)}
                    className="flex items-center gap-2 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 w-fit"
                >
                    <Plus size={16} /> Initiate Refund
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
                        {STATUS_TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize whitespace-nowrap ${
                                    tab === t ? 'bg-[#e65100] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {t}{t !== 'all' && counts[t] > 0 ? ` (${counts[t]})` : ''}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                        {/* Desktop */}
                        <div className="hidden md:block">
                            <table className="w-full text-sm table-fixed">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[30%]">Member</th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[35%]">Reason</th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[12%]">Status</th>
                                        <th className="text-right px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[23%]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500">No refunds found.</td></tr>
                                    ) : (
                                        filtered.map((r) => (
                                            <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                                                            {r.memberName.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-white truncate">{r.memberName}</p>
                                                            <p className="text-[10px] text-gray-500">₹{r.amount.toLocaleString('en-IN')} · {r.date}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-gray-500 truncate">{r.reason}</td>
                                                <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                                                <td className="px-5 py-3.5 text-right">
                                                    {r.status === 'pending' ? (
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => handleAction(r.id, 'approved')}
                                                                disabled={!!actionLoading}
                                                                className="text-xs bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                                                            >
                                                                {actionLoading === `${r.id}:approved` ? <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> : <ThumbsUp size={12} />} Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(r.id, 'rejected')}
                                                                disabled={!!actionLoading}
                                                                className="text-xs bg-red-400/10 text-red-400 hover:bg-red-400/20 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                                                            >
                                                                {actionLoading === `${r.id}:rejected` ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <ThumbsDown size={12} />} Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">{r.resolvedDate ?? '—'}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">No refunds found.</div>
                            ) : (
                                filtered.map((r) => (
                                    <div key={r.id} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                                                    {r.memberName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{r.memberName}</p>
                                                    <p className="text-[10px] text-gray-500">{r.reason}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-white">₹{r.amount.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={r.status} />
                                                <span className="text-[10px] text-gray-500">{r.date}</span>
                                            </div>
                                            {r.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleAction(r.id, 'approved')} disabled={!!actionLoading} className="text-[10px] font-semibold text-emerald-400 disabled:opacity-50">
                                                        {actionLoading === `${r.id}:approved` ? 'Saving...' : 'Approve'}
                                                    </button>
                                                    <button onClick={() => handleAction(r.id, 'rejected')} disabled={!!actionLoading} className="text-[10px] font-semibold text-red-400 disabled:opacity-50">
                                                        {actionLoading === `${r.id}:rejected` ? 'Saving...' : 'Reject'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-4">
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={16} className="text-amber-400" />
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Pending Requests</p>
                        </div>
                        <p className="text-3xl font-extrabold text-white">{counts.pending}</p>
                        <p className="text-xs text-amber-400 mt-1">Awaiting review</p>
                    </div>

                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Processed Today</p>
                        </div>
                        <p className="text-3xl font-extrabold text-white">{counts.approved + counts.rejected}</p>
                        <p className="text-xs text-gray-500 mt-1">Total processed</p>
                    </div>

                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Refund Performance</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">Total Refunded</span>
                                <span className="text-xs font-bold text-white">₹{totalRefunded.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">Approval Rate</span>
                                <span className="text-xs font-bold text-emerald-400">
                                    {counts.approved + counts.rejected > 0
                                        ? Math.round((counts.approved / (counts.approved + counts.rejected)) * 100)
                                        : 0}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">Avg. Response</span>
                                <span className="text-xs font-bold text-white">1.2 days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Initiate Refund Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title="Initiate Refund" size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Member Name *', field: 'memberName', placeholder: 'Arjun Sharma' },
                        { label: 'Payment ID *', field: 'paymentId', placeholder: 'INV-001' },
                        { label: 'Amount (₹) *', field: 'amount', placeholder: '999', type: 'number' },
                    ].map(({ label, field, placeholder, type }) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                            <input
                                type={type ?? 'text'} required value={form[field]}
                                onChange={set(field)} placeholder={placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Reason *</label>
                        <textarea
                            required value={form.reason} onChange={set('reason')}
                            placeholder="Reason for refund..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100] resize-none"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={submitting} className="flex-1 bg-[#e65100] hover:bg-[#bf360c] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button type="button" onClick={() => setModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-2.5 rounded-xl text-sm transition-colors border border-white/10">Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
