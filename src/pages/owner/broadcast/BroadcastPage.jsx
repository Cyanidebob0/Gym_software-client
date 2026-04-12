import { useEffect, useState } from 'react';
import broadcastService from '../../../services/broadcastService';
import {
    Megaphone,
    Send,
    Shield,
    Users,
    UserCheck,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Pencil,
    Trash2,
    X,
} from 'lucide-react';

const TARGET_OPTIONS = [
    { value: 'all',      label: 'All Members',      desc: 'Send to every member',          icon: Users },
    { value: 'active',   label: 'Active Members',   desc: 'Active members only',           icon: UserCheck },
    { value: 'expiring', label: 'Expiring Members', desc: 'Members expiring soon',         icon: Clock },
];

const PRIORITY_OPTIONS = [
    { value: 'normal', label: 'Normal' },
    { value: 'high',   label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

export default function BroadcastPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', message: '', target: 'all', priority: 'normal' });
    const [editingId, setEditingId] = useState(null);
    const [sending, setSending] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [success, setSuccess] = useState('');

    const load = () => broadcastService.getAll().then(setHistory);
    useEffect(() => { load().finally(() => setLoading(false)); }, []);

    const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

    const resetForm = () => {
        setForm({ title: '', message: '', target: 'all', priority: 'normal' });
        setEditingId(null);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            if (editingId) {
                await broadcastService.update(editingId, form);
                setSuccess('Broadcast updated!');
            } else {
                await broadcastService.send(form);
                setSuccess(`Message sent to ${TARGET_OPTIONS.find((t) => t.value === form.target)?.label}!`);
            }
            resetForm();
            await load();
        } catch {
            setSuccess('');
        } finally {
            setSending(false);
            setTimeout(() => setSuccess(''), 4000);
        }
    };

    const handleEdit = (b) => {
        setForm({ title: b.title, message: b.message, target: b.target, priority: b.priority });
        setEditingId(b.id);
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            await broadcastService.remove(id);
            await load();
            if (editingId === id) resetForm();
        } finally {
            setDeleting(null);
        }
    };

    const deliveredCount = history.length;

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
                        <Megaphone size={24} className="text-[#e65100]" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Broadcast Center</h1>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs sm:text-sm text-gray-500">Send messages to your members</p>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#e65100] bg-[#e65100]/10 px-2 py-0.5 rounded-full">
                            <Shield size={10} /> Owner Access
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Compose */}
                <div className="lg:col-span-2">
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#e65100]">
                                {editingId ? 'Edit Message' : 'Compose Message'}
                            </h2>
                            {editingId && (
                                <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                                    <X size={12} /> Cancel Edit
                                </button>
                            )}
                        </div>

                        {success && (
                            <div className="mb-4 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                                <CheckCircle2 size={16} /> {success}
                            </div>
                        )}

                        <form onSubmit={handleSend} className="space-y-5">
                            {/* Target selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Send To *</label>
                                <div className="space-y-2">
                                    {TARGET_OPTIONS.map(({ value, label, desc, icon: Icon }) => (
                                        <label key={value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                            form.target === value
                                                ? 'border-[#e65100]/50 bg-[#e65100]/5'
                                                : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                                        }`}>
                                            <input
                                                type="radio" name="target" value={value}
                                                checked={form.target === value} onChange={set('target')}
                                                className="accent-[#e65100]"
                                            />
                                            <Icon size={16} className={form.target === value ? 'text-[#e65100]' : 'text-gray-500'} />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-white">{label}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500">{desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Priority Level</label>
                                <div className="flex gap-2">
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                                form.priority === p.value
                                                    ? p.value === 'urgent' ? 'bg-red-400/10 text-red-400 border border-red-400/30'
                                                    : p.value === 'high' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                                                    : 'bg-[#e65100] text-white border border-[#e65100]'
                                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            {p.value === 'urgent' && <AlertTriangle size={12} className="inline mr-1" />}
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                                <input
                                    required value={form.title} onChange={set('title')}
                                    placeholder="e.g. Holiday Notice"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Content *</label>
                                <textarea
                                    required value={form.message} onChange={set('message')}
                                    placeholder="Write your message here... (Markdown supported)"
                                    rows={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100] resize-none"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 text-right">{form.message.length} characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-[#e65100] hover:bg-[#bf360c] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={14} /> {sending ? (editingId ? 'Saving...' : 'Sending...') : (editingId ? 'Save Changes' : 'Send Broadcast')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Message Stats */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Message History</h3>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-emerald-400" />
                                <span className="text-xs text-gray-300">Sent</span>
                            </div>
                            <span className="text-sm font-bold text-white">{deliveredCount}</span>
                        </div>
                    </div>

                    {/* Recent Messages */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Recent Messages</h3>
                        {history.length === 0 ? (
                            <p className="text-gray-500 text-xs text-center py-4">No messages sent yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {history.slice(0, 5).map((b) => {
                                    const opt = TARGET_OPTIONS.find((t) => t.value === b.target);
                                    return (
                                        <li key={b.id} className={`p-3 rounded-xl border transition-colors ${editingId === b.id ? 'bg-[#e65100]/5 border-[#e65100]/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}>
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold text-white text-xs mb-1 truncate flex-1">{b.title}</p>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleEdit(b)}
                                                        className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-[#e65100] hover:bg-[#e65100]/10 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={11} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b.id)}
                                                        disabled={deleting === b.id}
                                                        className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        {deleting === b.id
                                                            ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                            : <Trash2 size={11} />
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 line-clamp-2">{b.message}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[10px] text-gray-600">{new Date(b.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                                    opt?.value === 'active' ? 'bg-emerald-400/10 text-emerald-400' :
                                                    opt?.value === 'expiring' ? 'bg-amber-400/10 text-amber-400' :
                                                    'bg-gray-400/10 text-gray-400'
                                                }`}>
                                                    {opt?.label ?? b.target}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
