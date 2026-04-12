import { useEffect, useState } from 'react';
import paymentService from '../../../services/paymentService';
import {
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle2,
    Search,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const STATUS_TABS = ['All', 'Completed', 'Pending', 'Refunded', 'Failed'];

const StatusBadge = ({ status }) => {
    const map = {
        completed: 'text-emerald-400 bg-emerald-400/10',
        pending:   'text-amber-400 bg-amber-400/10',
        refunded:  'text-blue-400 bg-blue-400/10',
        failed:    'text-red-400 bg-red-400/10',
    };
    return (
        <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? 'text-gray-400 bg-gray-400/10'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('All');
    const [detail, setDetail] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        paymentService.getAll().then(setPayments).finally(() => setLoading(false));
    }, []);

    const filtered = payments.filter((p) => {
        if (tab === 'All') return true;
        return p.status === tab.toLowerCase();
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const totalAmount = payments
        .filter((p) => p.status === 'completed')
        .reduce((s, p) => s + p.amount, 0);

    const pendingCount = payments.filter((p) => p.status === 'pending').length;
    const completedCount = payments.filter((p) => p.status === 'completed').length;

    const handleDownload = (p) => {
        const content = [
            `INVOICE`,
            `Invoice ID : ${p.invoiceId}`,
            `Date       : ${p.date}`,
            `Member     : ${p.memberName}`,
            `Plan       : ${p.planName}`,
            `Amount     : Rs.${p.amount}`,
            `Mode       : ${p.mode} (${p.method})`,
            `Status     : ${p.status}`,
        ].join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${p.invoiceId}.txt`; a.click();
        URL.revokeObjectURL(url);
    };

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
                        <CreditCard size={24} className="text-[#e65100]" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Transaction History</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">{filtered.length} records</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Revenue</p>
                        <DollarSign size={18} className="text-[#e65100]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">₹{totalAmount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold mt-2">+12% from last month</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Pending Invoices</p>
                        <Clock size={18} className="text-amber-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{pendingCount}</p>
                    <p className="text-[10px] sm:text-xs text-amber-400 font-semibold mt-2">Awaiting payment</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Successful Payments</p>
                        <CheckCircle2 size={18} className="text-emerald-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{completedCount}</p>
                    <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold mt-2">This month</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
                {STATUS_TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => { setTab(t); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                            tab === t
                                ? 'bg-[#e65100] text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto scrollbar-none">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Member</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {paginated.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No payments found.</td></tr>
                            ) : (
                                paginated.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                                                    {p.memberName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{p.memberName}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono">{p.invoiceId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-400">{p.planName}</td>
                                        <td className="px-4 py-4 font-bold text-white">₹{p.amount.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-4 text-gray-400 capitalize">{p.method || p.mode}</td>
                                        <td className="px-4 py-4 text-gray-500">{p.date}</td>
                                        <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setDetail(p)} className="text-xs font-semibold text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1">
                                                    <Eye size={12} /> View
                                                </button>
                                                <button onClick={() => handleDownload(p)} className="text-xs font-semibold text-[#e65100] hover:text-[#f57c00] px-2 py-1 rounded-lg hover:bg-[#e65100]/10 transition-colors flex items-center gap-1">
                                                    <Download size={12} /> Invoice
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-white/5">
                    {paginated.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No payments found.</div>
                    ) : (
                        paginated.map((p) => (
                            <div key={p.id} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#e65100]/10 flex items-center justify-center text-xs font-bold text-[#e65100] flex-shrink-0">
                                            {p.memberName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{p.memberName}</p>
                                            <p className="text-[10px] text-gray-500">{p.planName}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-white">₹{p.amount.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={p.status} />
                                        <span className="text-[10px] text-gray-500">{p.date}</span>
                                    </div>
                                    <button onClick={() => handleDownload(p)} className="text-[10px] font-semibold text-[#e65100] flex items-center gap-1">
                                        <Download size={10} /> Invoice
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 sm:px-6 py-3 border-t border-white/5 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <span className="text-xs text-gray-400">{page} / {totalPages}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail panel */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
                    <div className="relative bg-[#141414] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">Payment Details</h2>
                            <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-white text-xl">&times;</button>
                        </div>
                        <dl className="space-y-3 text-sm">
                            {[
                                ['Invoice ID', detail.invoiceId],
                                ['Member', detail.memberName],
                                ['Plan', detail.planName],
                                ['Amount', `₹${detail.amount.toLocaleString('en-IN')}`],
                                ['Mode', `${detail.mode} (${detail.method})`],
                                ['Date', detail.date],
                                ['Status', detail.status],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                    <dt className="text-gray-500">{k}</dt>
                                    <dd className="font-semibold text-white">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <button onClick={() => handleDownload(detail)} className="mt-5 w-full bg-[#e65100] hover:bg-[#bf360c] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                            Download Invoice
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-2">
                <p>&copy; {new Date().getFullYear()} Sweat Zone. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <button className="hover:text-gray-400 transition-colors">Terms</button>
                    <button className="hover:text-gray-400 transition-colors">Privacy</button>
                    <button className="hover:text-gray-400 transition-colors">Refund Policy</button>
                </div>
            </div>
        </div>
    );
}
