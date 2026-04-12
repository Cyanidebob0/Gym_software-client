import { useEffect, useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import memberService from '../../services/memberService';

const METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'card', label: 'Card' },
];

export default function SelectPlanAndPay({ onDone }) {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [method, setMethod] = useState('cash');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        memberService
            .getAvailablePlans()
            .then((data) => {
                setPlans(data);
                if (data.length) setSelectedPlan(data[0]);
            })
            .catch(() => setError('Failed to load plans'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlan) return;
        setError('');
        setSubmitting(true);
        try {
            await memberService.activateWithPayment({
                planId: selectedPlan.id,
                method,
                amount: selectedPlan.price,
            });
            onDone();
        } catch (err) {
            setError(err?.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={28} className="text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white">You're Approved!</h1>
                    <p className="text-sm text-gray-500 mt-1">Select a plan and complete payment to activate your membership</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Plan Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {plans.map((plan) => (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            className={`relative text-left p-4 rounded-2xl border transition-all ${
                                selectedPlan?.id === plan.id
                                    ? 'bg-[#e65100]/10 border-[#e65100] ring-1 ring-[#e65100]'
                                    : 'bg-[#141414] border-white/5 hover:border-white/20'
                            }`}
                        >
                            {selectedPlan?.id === plan.id && (
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#e65100] flex items-center justify-center">
                                    <Check size={12} className="text-white" />
                                </div>
                            )}
                            <h3 className="text-sm font-bold text-white mb-1">{plan.name}</h3>
                            <p className="text-2xl font-extrabold text-white">
                                ₹{plan.price}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{plan.durationDays} days</p>
                        </button>
                    ))}
                </div>

                {plans.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mb-6">
                        No plans available. Please contact the gym owner.
                    </div>
                ) : (
                    <div className="text-center mb-4">
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={async () => {
                                setError('');
                                setSubmitting(true);
                                try {
                                    const plan = plans[0];
                                    await memberService.activateWithPayment({
                                        planId: plan.id,
                                        method: 'cash',
                                        amount: plan.price,
                                    });
                                    onDone();
                                } catch (err) {
                                    setError(err?.response?.data?.message || 'Simulated payment failed.');
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Processing...' : `⚡ Quick Pay — ${plans[0].name} (₹${plans[0].price})`}
                        </button>
                        <p className="text-[10px] text-gray-600 mt-1">Test button — simulates instant payment</p>
                    </div>
                )}

                {/* Payment Method */}
                {selectedPlan && (
                    <form onSubmit={handleSubmit}>
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 mb-4">
                            <p className="text-xs font-semibold text-gray-400 mb-3">Payment Method</p>
                            <div className="flex gap-2">
                                {METHODS.map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        onClick={() => setMethod(m.value)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                            method === m.value
                                                ? 'bg-[#e65100] text-white'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                <span className="text-sm text-gray-400">Total</span>
                                <span className="text-xl font-extrabold text-white">₹{selectedPlan.price}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 disabled:opacity-50"
                        >
                            {submitting ? 'Processing...' : `Pay ₹${selectedPlan.price} & Activate`}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
