import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import memberService from '../../../services/memberService';
import paymentService from '../../../services/paymentService';
import planService from '../../../services/planService';
import { UserPlus, Pencil, ArrowLeft } from 'lucide-react';

const GOV_ID_TYPES = ['Aadhaar', 'PAN', 'Voter ID', 'Passport', 'Driving Licence'];

export default function MemberRegistration() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingMember, setLoadingMember] = useState(isEdit);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '', phone: '', email: '', address: '',
        govIdType: 'Aadhaar', govIdNumber: '',
        planId: '', paymentMode: 'offline',
        amountPaid: '', paymentMethod: 'cash',
    });

    useEffect(() => {
        planService.getActive().then(setPlans);
    }, []);

    // Load existing member data in edit mode
    useEffect(() => {
        if (!isEdit) return;
        memberService.getById(id).then((m) => {
            if (!m) { navigate('/owner/members'); return; }
            setForm((f) => ({
                ...f,
                name: m.name || '',
                phone: m.phone || '',
                email: m.email || '',
                address: m.address || '',
                govIdType: m.govIdType || 'Aadhaar',
                govIdNumber: m.govIdNumber || '',
                planId: m.planId || '',
            }));
        }).catch(() => {
            navigate('/owner/members');
        }).finally(() => setLoadingMember(false));
    }, [id, isEdit, navigate]);

    const selectedPlan = plans.find((p) => p.id === form.planId);

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const getExpiryDate = () => {
        if (!selectedPlan) return '';
        const d = new Date();
        d.setDate(d.getDate() + selectedPlan.duration);
        return d.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.phone) { setError('Name and phone are required.'); return; }

        setSubmitting(true);
        try {
            if (isEdit) {
                // Update member details only (no payment creation)
                await memberService.update(id, {
                    name: form.name, phone: form.phone, email: form.email,
                    address: form.address, govIdType: form.govIdType, govIdNumber: form.govIdNumber,
                    ...(form.planId ? { planId: form.planId } : {}),
                });
                navigate(`/owner/members/${id}`);
            } else {
                // Create new member flow
                if (!form.planId) { setError('Please select a membership plan.'); setSubmitting(false); return; }
                const expiryDate = getExpiryDate();
                const member = await memberService.create({
                    name: form.name, phone: form.phone, email: form.email,
                    address: form.address, govIdType: form.govIdType, govIdNumber: form.govIdNumber,
                    planId: form.planId, planName: selectedPlan.name,
                    status: 'active', expiryDate,
                });

                await paymentService.create({
                    memberId: member.id, memberName: member.name,
                    planId: form.planId, planName: selectedPlan.name,
                    amount: form.paymentMode === 'offline' ? Number(form.amountPaid) : selectedPlan.price,
                    mode: form.paymentMode,
                    method: form.paymentMode === 'online' ? 'online' : form.paymentMethod,
                    status: 'completed',
                });

                navigate('/owner/members');
            }
        } catch {
            setError(isEdit ? 'Failed to update member. Please try again.' : 'Failed to register member. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingMember) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl max-w-full overflow-x-hidden">
            {/* Header */}
            <button onClick={() => navigate(isEdit ? `/owner/members/${id}` : '/owner/members')} className="text-sm text-gray-500 hover:text-[#e65100] flex items-center gap-1 mb-4 transition-colors">
                <ArrowLeft size={14} /> {isEdit ? 'Back to Member' : 'Back to Members'}
            </button>

            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    {isEdit ? <Pencil size={24} className="text-[#e65100]" /> : <UserPlus size={24} className="text-[#e65100]" />}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{isEdit ? 'Edit Member' : 'Register New Member'}</h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {isEdit ? 'Update the member details below.' : 'Fill in the details to add a new gym member.'}
                </p>
            </div>

            {error && (
                <div className="mb-4 bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <Section title="Personal Information">
                    <Field label="Full Name *">
                        <input required value={form.name} onChange={set('name')} placeholder="Arjun Sharma" />
                    </Field>
                    <Field label="Phone Number *">
                        <input required value={form.phone} onChange={set('phone')} placeholder="9876543210" maxLength={10} />
                    </Field>
                    <Field label="Email Address">
                        <input type="email" value={form.email} onChange={set('email')} placeholder="arjun@gmail.com" />
                    </Field>
                    <Field label="Address" full>
                        <input value={form.address} onChange={set('address')} placeholder="Street, Area, City" />
                    </Field>
                </Section>

                {/* Government ID */}
                <Section title="Government ID">
                    <Field label="ID Type">
                        <select value={form.govIdType} onChange={set('govIdType')}>
                            {GOV_ID_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                    </Field>
                    <Field label="ID Number">
                        <input value={form.govIdNumber} onChange={set('govIdNumber')} placeholder="Enter ID number" />
                    </Field>
                </Section>

                {/* Membership Plan */}
                <Section title="Membership Plan">
                    <Field label={isEdit ? 'Change Plan (optional)' : 'Select Plan *'} full>
                        <select value={form.planId} onChange={set('planId')} required={!isEdit}>
                            <option value="">-- Choose a plan --</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.duration} days)
                                </option>
                            ))}
                        </select>
                    </Field>
                    {selectedPlan && !isEdit && (
                        <div className="col-span-2 bg-[#e65100]/10 border border-[#e65100]/20 rounded-xl p-3 text-sm">
                            <span className="font-semibold text-[#e65100]">{selectedPlan.name}</span>
                            <span className="text-gray-400"> · ₹{selectedPlan.price.toLocaleString('en-IN')} · {selectedPlan.duration} days · Expires: {getExpiryDate()}</span>
                        </div>
                    )}
                </Section>

                {/* Payment - only for new registration */}
                {!isEdit && (
                    <Section title="Payment">
                        <Field label="Payment Mode" full>
                            <div className="flex gap-4 mt-1">
                                {['offline', 'online'].map((mode) => (
                                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="paymentMode" value={mode} checked={form.paymentMode === mode} onChange={set('paymentMode')} className="accent-[#e65100]" />
                                        <span className="text-sm font-medium text-gray-300 capitalize">{mode}</span>
                                    </label>
                                ))}
                            </div>
                        </Field>
                        {form.paymentMode === 'offline' && (
                            <>
                                <Field label="Amount Paid (₹) *">
                                    <input
                                        type="number" required value={form.amountPaid}
                                        onChange={set('amountPaid')}
                                        placeholder={selectedPlan ? String(selectedPlan.price) : '0'}
                                    />
                                </Field>
                                <Field label="Payment Method">
                                    <select value={form.paymentMethod} onChange={set('paymentMethod')}>
                                        <option value="cash">Cash</option>
                                        <option value="upi">UPI</option>
                                        <option value="card">Card</option>
                                    </select>
                                </Field>
                            </>
                        )}
                        {form.paymentMode === 'online' && (
                            <div className="col-span-2 bg-blue-400/10 border border-blue-400/20 rounded-xl p-3 text-sm text-blue-400">
                                Member will receive a payment link to complete online payment. Membership activates after confirmation.
                            </div>
                        )}
                    </Section>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#e65100] hover:bg-[#bf360c] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#e65100]/20"
                    >
                        {submitting
                            ? (isEdit ? 'Saving...' : 'Registering...')
                            : (isEdit ? 'Save Changes' : 'Register Member')
                        }
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(isEdit ? `/owner/members/${id}` : '/owner/members')}
                        className="bg-white/5 hover:bg-white/10 text-gray-300 font-semibold px-6 py-2.5 rounded-xl transition-colors border border-white/10"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#e65100] mb-4">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

function Field({ label, children, full }) {
    return (
        <div className={full ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="[&>input]:w-full [&>input]:bg-white/5 [&>input]:border [&>input]:border-white/10 [&>input]:rounded-xl [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-white [&>input]:placeholder-gray-600 [&>input]:focus:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-[#e65100]/40 [&>input]:focus:border-[#e65100] [&>select]:w-full [&>select]:bg-white/5 [&>select]:border [&>select]:border-white/10 [&>select]:rounded-xl [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-white [&>select]:focus:outline-none [&>select]:focus:ring-2 [&>select]:focus:ring-[#e65100]/40 [&>select]:focus:border-[#e65100] [&>select>option]:bg-[#1a1a1a] [&>select>option]:text-white">
                {children}
            </div>
        </div>
    );
}
