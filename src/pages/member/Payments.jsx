import { useEffect, useState } from 'react';
import memberService from '../../services/memberService';
import {
    CreditCard,
    Bell,
    UserCircle,
    Plus,
    Wallet,
    CalendarClock,
    Star,
    Search,
    Download,
    HelpCircle,
    Phone,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
    const map = {
        completed: 'text-emerald-400 bg-emerald-400/10',
        pending:   'text-amber-400   bg-amber-400/10',
        refunded:  'text-blue-400    bg-blue-400/10',
        failed:    'text-red-400     bg-red-400/10',
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? 'text-gray-400 bg-gray-400/10'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const downloadInvoice = (payment) => {
    const invoiceText = [
        '====================================',
        '         SWEAT ZONE',
        '         MG Road, Bangalore         ',
        '====================================',
        '',
        `Invoice ID   : ${payment.invoiceId}`,
        `Date         : ${new Date(payment.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        '',
        '------------------------------------',
        `Plan         : ${payment.planName}`,
        `Amount       : ₹${payment.amount.toLocaleString('en-IN')}`,
        `Payment Mode : ${(payment.method || payment.mode || '').toUpperCase()}`,
        `Status       : ${payment.status.toUpperCase()}`,
        '------------------------------------',
        '',
        'Thank you for choosing Sweat Zone!',
        '====================================',
    ].join('\n');

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${payment.invoiceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [profile, setProfile]   = useState(null);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        Promise.all([
            memberService.getMemberPayments(),
            memberService.getMemberProfile(),
        ]).then(([data, prof]) => {
            setPayments(data);
            setProfile(prof);
            setLoading(false);
        });
    }, []);

    const totalPaid = payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

    const lastPayment = payments.length ? payments[0] : null;
    const upcomingAmount = lastPayment ? lastPayment.amount : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <CreditCard size={24} className="text-[#e65100]" />
                    <h1 className="text-2xl font-extrabold text-white">Payments</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Bell size={16} />
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <UserCircle size={16} />
                    </button>
                </div>
            </div>

            {/* Member Info */}
            {profile && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#e65100] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {profile.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{profile.name}</p>
                            <p className="text-xs text-[#e65100] font-semibold">Gold Member since {new Date(profile.joinDate).getFullYear()}</p>
                        </div>
                    </div>
                    <button className="px-5 py-2.5 bg-[#e65100] text-white text-sm font-semibold rounded-xl hover:bg-[#bf360c] transition-colors shadow-lg shadow-[#e65100]/20 flex items-center gap-2">
                        <Plus size={15} /> Add Payment Method
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Paid (YTD)</p>
                        <Wallet size={18} className="text-[#e65100]" />
                    </div>
                    <p className="text-3xl font-extrabold text-white">
                        ₹{totalPaid.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-emerald-400 font-semibold mt-2">↗ +12% vs last year</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Upcoming Payment</p>
                        <CalendarClock size={18} className="text-[#e65100]" />
                    </div>
                    <p className="text-3xl font-extrabold text-white">
                        ₹{upcomingAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <CalendarClock size={10} /> Due {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Active Membership</p>
                        <Star size={18} className="text-[#e65100]" />
                    </div>
                    <p className="text-2xl font-extrabold text-white">{profile?.planName || 'Premium'}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Next renewal: {profile ? new Date(profile.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Transaction History</h2>
                    <button className="text-xs font-semibold text-[#e65100] hover:text-[#f57c00] transition-colors flex items-center gap-1">
                        <Search size={12} /> Filter
                    </button>
                </div>

                {payments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No payment records found.</div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Date</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Plan</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Amount</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Method</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-gray-400">
                                                {new Date(payment.date).toLocaleDateString('en-IN', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-white">{payment.planName}</td>
                                            <td className="px-6 py-4 font-bold text-white">
                                                ₹{payment.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 capitalize flex items-center gap-2">
                                                <CreditCard size={14} className="text-gray-600" />
                                                {payment.method || payment.mode}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={payment.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => downloadInvoice(payment)}
                                                    className="text-xs font-semibold text-[#e65100] hover:text-[#f57c00] transition-colors flex items-center gap-1"
                                                >
                                                    <Download size={12} /> PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y divide-white/5">
                            {payments.map((payment) => (
                                <div key={payment.id} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-white">{payment.planName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 capitalize">{payment.method || payment.mode}</p>
                                        </div>
                                        <p className="font-bold text-white">₹{payment.amount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={payment.status} />
                                            <span className="text-xs text-gray-500">
                                                {new Date(payment.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => downloadInvoice(payment)}
                                            className="text-xs font-semibold text-[#e65100] hover:text-[#f57c00] flex items-center gap-1"
                                        >
                                            <Download size={12} /> PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Support Banner */}
            <div className="mt-6 bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <HelpCircle size={28} className="text-[#e65100] flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-white">Need help with your payments?</p>
                        <p className="text-xs text-gray-500">Our support team is available 24/7 to assist you with any billing inquiries.</p>
                    </div>
                </div>
                <button className="px-5 py-2.5 border border-[#e65100] text-[#e65100] text-sm font-semibold rounded-xl hover:bg-[#e65100]/10 transition-colors whitespace-nowrap flex items-center gap-2">
                    <Phone size={14} /> Contact Billing Support
                </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-2">
                <p>&copy; {new Date().getFullYear()} Sweat Zone. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <button className="hover:text-gray-400 transition-colors">Terms of Service</button>
                    <button className="hover:text-gray-400 transition-colors">Privacy Policy</button>
                    <button className="hover:text-gray-400 transition-colors">Refund Policy</button>
                </div>
            </div>
        </div>
    );
};

export default Payments;
