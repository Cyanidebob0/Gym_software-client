import { useEffect, useState } from 'react';
import planService from '../../../services/planService';
import Modal from '../../../components/owner/Modal';
import {
    ClipboardList,
    Plus,
    Star,
    Pencil,
    ToggleLeft,
    ToggleRight,
    Check,
} from 'lucide-react';

const EMPTY_FORM = { name: '', duration: '', price: '' };

const TABS = ['All Plans', 'Active', 'Disabled'];

export default function PlansPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('All Plans');
    const [submitting, setSubmitting] = useState(false);
    const [toggling, setToggling] = useState(null); // plan id

    const load = () => planService.getAll().then(setPlans);
    useEffect(() => { load().finally(() => setLoading(false)); }, []);

    const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModal(true); };
    const openEdit = (p) => { setEditing(p); setForm({ name: p.name, duration: String(p.duration), price: String(p.price) }); setError(''); setModal(true); };

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.duration || !form.price) { setError('All fields are required.'); return; }
        setSubmitting(true);
        try {
            const data = { name: form.name, duration: Number(form.duration), price: Number(form.price) };
            if (editing) {
                await planService.update(editing.id, data);
            } else {
                await planService.create(data);
            }
            await load();
            setModal(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (id) => {
        setToggling(id);
        try {
            await planService.toggle(id);
            await load();
        } finally {
            setToggling(null);
        }
    };

    const active = plans.filter((p) => p.isActive);
    const inactive = plans.filter((p) => !p.isActive);

    const displayedPlans = activeTab === 'Active' ? active : activeTab === 'Disabled' ? inactive : plans;

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
                        <ClipboardList size={24} className="text-[#e65100]" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Membership Tiers</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">{active.length} active · {inactive.length} disabled</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-[#e65100] hover:bg-[#bf360c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 w-fit"
                >
                    <Plus size={16} /> New Plan
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-white/5 pb-3 overflow-x-auto scrollbar-none -mx-1 px-1">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-xs sm:text-sm font-semibold pb-1 transition-colors whitespace-nowrap flex-shrink-0 ${
                            activeTab === tab
                                ? 'text-[#e65100] border-b-2 border-[#e65100]'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {displayedPlans.map((p, idx) => (
                    <PlanCard key={p.id} plan={p} onEdit={openEdit} onToggle={handleToggle} toggling={toggling} recommended={idx === 1 && p.isActive} />
                ))}
                {displayedPlans.length === 0 && (
                    <p className="text-gray-500 text-sm col-span-3 text-center py-8">No plans found.</p>
                )}
            </div>

            {/* Quick Management Table */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-white/5">
                    <h3 className="text-sm sm:text-base font-bold text-white">Quick Management</h3>
                </div>
                <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 sm:px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan Name</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-4 sm:px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {plans.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 sm:px-6 py-3 font-semibold text-white">{p.name}</td>
                                    <td className="px-4 py-3 text-gray-400">{p.duration} days</td>
                                    <td className="px-4 py-3 font-bold text-white">₹{p.price.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gray-400/10 text-gray-400'}`}>
                                            {p.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="text-xs font-semibold text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleToggle(p.id)}
                                                disabled={toggling === p.id}
                                                className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors disabled:opacity-50 ${
                                                    p.isActive
                                                        ? 'text-red-400 hover:bg-red-400/10'
                                                        : 'text-emerald-400 hover:bg-emerald-400/10'
                                                }`}
                                            >
                                                {toggling === p.id ? <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : p.isActive ? 'Disable' : 'Enable'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Plan' : 'Create New Plan'} size="sm">
                {error && <div className="mb-4 bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Plan Name *</label>
                        <input
                            value={form.name} onChange={set('name')} required placeholder="e.g. 1 Month"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Duration (days) *</label>
                        <input
                            type="number" min="1" value={form.duration} onChange={set('duration')} required placeholder="30"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹) *</label>
                        <input
                            type="number" min="1" value={form.price} onChange={set('price')} required placeholder="999"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={submitting} className="flex-1 bg-[#e65100] hover:bg-[#bf360c] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Plan'}
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

function PlanCard({ plan, onEdit, onToggle, toggling, recommended }) {
    const features = [
        'Full gym access',
        'Locker included',
        plan.duration >= 90 ? 'Personal trainer' : null,
        plan.duration >= 180 ? 'Nutrition plan' : null,
        plan.duration >= 365 ? 'Priority booking' : null,
    ].filter(Boolean);

    return (
        <div className={`relative bg-[#141414] border rounded-2xl p-5 sm:p-6 transition-all hover:border-[#e65100]/30 ${
            recommended ? 'border-[#e65100]/50 ring-1 ring-[#e65100]/20' : 'border-white/5'
        } ${!plan.isActive ? 'opacity-50' : ''}`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#e65100] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                        <Star size={10} /> Recommended
                    </span>
                </div>
            )}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-white text-base sm:text-lg">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.duration} days</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${plan.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gray-400/10 text-gray-400'}`}>
                    {plan.isActive ? 'Active' : 'Disabled'}
                </span>
            </div>

            <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                ₹{plan.price.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-gray-500">/{plan.duration}d</span>
            </p>

            <ul className="space-y-2 mt-4 mb-5">
                {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <Check size={14} className="text-[#e65100] flex-shrink-0" />
                        {f}
                    </li>
                ))}
            </ul>

            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(plan)}
                    className="flex-1 text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 py-2.5 rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-1"
                >
                    <Pencil size={12} /> Edit
                </button>
                <button
                    onClick={() => onToggle(plan.id)}
                    disabled={toggling === plan.id}
                    className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 disabled:opacity-50 ${
                        plan.isActive
                            ? 'bg-red-400/10 hover:bg-red-400/20 text-red-400'
                            : 'bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400'
                    }`}
                >
                    {toggling === plan.id ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : plan.isActive ? <><ToggleLeft size={14} /> Disable</> : <><ToggleRight size={14} /> Enable</>}
                </button>
            </div>
        </div>
    );
}
