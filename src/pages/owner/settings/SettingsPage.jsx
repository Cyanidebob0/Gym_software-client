import { useState, useEffect } from 'react';
import settingsService from '../../../services/settingsService';
import {
    Settings,
    Building2,
    Phone,
    MapPin,
    Bell,
    Globe,
    RotateCcw,
    Shield,
    Users,
    CreditCard,
    BarChart3,
    CheckCircle2,
} from 'lucide-react';

const SIDEBAR_TABS = [
    { key: 'general', label: 'General Settings', icon: Settings },
    { key: 'team', label: 'Team Management', icon: Users },
    { key: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
    { key: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
    const [config, setConfig] = useState({
        gymName: '', gymAddress: '', gymPhone: '',
        expiryReminderDays: 7, smsReminders: false,
        onlineRegistration: true, refundsEnabled: true, gracePeriodDays: 3,
    });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => { settingsService.get().then(setConfig).catch(() => {}).finally(() => setLoading(false)); }, []);

    const set = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setConfig((p) => ({ ...p, [field]: value }));
        setSaved(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await settingsService.update(config);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } finally {
            setSaving(false);
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
        <div className="min-h-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <Settings size={24} className="text-[#e65100]" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Owner Settings</h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Configure your gym system behaviour</p>
            </div>

            {saved && (
                <div className="mb-4 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Settings saved successfully.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-3 sm:p-4">
                        <nav className="space-y-1">
                            {SIDEBAR_TABS.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        activeTab === key
                                            ? 'bg-[#e65100] text-white shadow-lg shadow-[#e65100]/20'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} />
                                    <span className="truncate">{label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSave} className="space-y-5">
                        {/* Gym Info */}
                        <Section title="Gym Information" icon={Building2}>
                            <Field label="Gym Name" icon={Building2}>
                                <input value={config.gymName} onChange={set('gymName')} placeholder="Sweat Zone" />
                            </Field>
                            <Field label="Gym Phone" icon={Phone}>
                                <input value={config.gymPhone} onChange={set('gymPhone')} placeholder="9876500000" />
                            </Field>
                            <Field label="Gym Address" icon={MapPin} full>
                                <input value={config.gymAddress} onChange={set('gymAddress')} placeholder="Address" />
                            </Field>
                        </Section>

                        {/* Membership */}
                        <Section title="Membership Settings" icon={Users}>
                            <Field label="Expiry Reminder Days">
                                <input type="number" min="1" max="30" value={config.expiryReminderDays} onChange={set('expiryReminderDays')} />
                                <p className="text-[10px] text-gray-500 mt-1">Members flagged as &quot;expiring soon&quot; this many days before expiry.</p>
                            </Field>
                            <Field label="Grace Period Days">
                                <input type="number" min="0" max="30" value={config.gracePeriodDays} onChange={set('gracePeriodDays')} />
                                <p className="text-[10px] text-gray-500 mt-1">Allow access for this many days after expiry.</p>
                            </Field>
                        </Section>

                        {/* Toggles */}
                        <Section title="Features" icon={Shield}>
                            {[
                                { field: 'smsReminders', label: 'SMS Reminders', desc: 'Send SMS when membership is expiring', icon: Bell },
                                { field: 'onlineRegistration', label: 'Online Registration', desc: 'Allow members to register online', icon: Globe },
                                { field: 'refundsEnabled', label: 'Enable Refunds', desc: 'Allow refund requests from admin', icon: RotateCcw },
                            ].map(({ field, label, desc, icon: Icon }) => (
                                <div key={field} className="col-span-2 flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#e65100]/10 flex items-center justify-center flex-shrink-0">
                                            <Icon size={14} className="text-[#e65100]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{label}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setConfig((p) => ({ ...p, [field]: !p[field] }))}
                                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${config[field] ? 'bg-[#e65100]' : 'bg-gray-600'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${config[field] ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </Section>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-[#e65100] hover:bg-[#bf360c] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#e65100]/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children }) {
    return (
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#e65100] mb-4 flex items-center gap-2">
                {Icon && <Icon size={14} />} {title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

function Field({ label, children, full, icon: Icon }) {
    return (
        <div className={full ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                {Icon && <Icon size={12} className="text-gray-500" />}
                {label}
            </label>
            <div className="[&>input]:w-full [&>input]:bg-white/5 [&>input]:border [&>input]:border-white/10 [&>input]:rounded-xl [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-white [&>input]:placeholder-gray-600 [&>input]:focus:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-[#e65100]/40 [&>input]:focus:border-[#e65100]">
                {children}
            </div>
        </div>
    );
}
