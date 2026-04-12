import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import memberService from '../../services/memberService';

const Field = ({ label, children, full }) => (
    <div className={full ? 'sm:col-span-2' : ''}>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
        {children}
    </div>
);

const inputCls =
    'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100] transition-colors';

export default function MemberRegistrationForm({ onDone }) {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        govIdType: '',
        govIdNumber: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await memberService.selfRegister({
                name: form.name,
                phone: form.phone,
                email: form.email || undefined,
                address: form.address || undefined,
                govIdType: form.govIdType || undefined,
                govIdNumber: form.govIdNumber || undefined,
            });
            onDone();
        } catch (err) {
            const data = err?.response?.data;
            if (data?.errors?.length) {
                setError(data.errors.map((e) => `${e.field}: ${e.message}`).join('\n'));
            } else {
                setError(data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#e65100]/10 flex items-center justify-center mx-auto mb-4">
                        <UserPlus size={28} className="text-[#e65100]" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white">Join the Gym</h1>
                    <p className="text-sm text-gray-500 mt-1">Fill in your details to register as a member</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-sm text-red-400 whitespace-pre-line">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/5 rounded-2xl p-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <Field label="Full Name *">
                            <input type="text" required value={form.name} onChange={set('name')} placeholder="John Doe" className={inputCls} />
                        </Field>
                        <Field label="Phone *">
                            <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="9876543210" className={inputCls} />
                        </Field>
                        <Field label="Email">
                            <input type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" className={inputCls} />
                        </Field>
                        <Field label="Address" full>
                            <input type="text" value={form.address} onChange={set('address')} placeholder="Your address" className={inputCls} />
                        </Field>
                        <Field label="ID Type">
                            <select value={form.govIdType} onChange={set('govIdType')} className={`${inputCls} [&>option]:bg-[#1a1a1a] [&>option]:text-white`}>
                                <option value="">Select ID type</option>
                                <option value="aadhaar">Aadhaar</option>
                                <option value="pan">PAN</option>
                                <option value="voter_id">Voter ID</option>
                                <option value="passport">Passport</option>
                                <option value="driving_license">Driving Licence</option>
                            </select>
                        </Field>
                        <Field label="ID Number">
                            <input type="text" value={form.govIdNumber} onChange={set('govIdNumber')} placeholder="ID number" className={inputCls} />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}
