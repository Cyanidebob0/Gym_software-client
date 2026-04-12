import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import memberService from '../../services/memberService';
import { useAuth } from '../../context/AuthContext';
import {
    UserCircle,
    Shield,
    Lock,
    Settings,
    RefreshCw,
    Crown,
} from 'lucide-react';

const ReadOnlyField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm">{value || '—'}</div>
    </div>
);

const EditableField = ({ label, name, value, type = 'text', onChange, placeholder, options }) => (
    <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
        {options ? (
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100] appearance-none [&>option]:bg-[#141414]"
            >
                {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
            />
        )}
    </div>
);

const Profile = () => {
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [dates, setDates] = useState([]);

    const [form, setForm] = useState({ phone: '', address: '', gender: '' });
    const [pwForm, setPwForm] = useState({ newPw: '', confirm: '' });
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState('');

    useEffect(() => {
        Promise.all([
            memberService.getMemberProfile(),
            memberService.getMemberAttendance(),
        ]).then(([data, att]) => {
            setProfile(data);
            setDates(att);
            setForm({ phone: data.phone || '', address: data.address || '', gender: data.gender || '' });
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setSaveMsg('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveMsg('');
        try {
            await memberService.updateMemberProfile(form);
            setProfile((prev) => ({ ...prev, ...form }));
            setSaveMsg('saved');
        } catch {
            setSaveMsg('error');
        } finally {
            setSaving(false);
        }
    };

    const handlePwSave = async (e) => {
        e.preventDefault();
        setPwMsg('');
        if (pwForm.newPw.length < 6) { setPwMsg('Password must be at least 6 characters.'); return; }
        if (pwForm.newPw !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
        setPwSaving(true);
        try {
            await resetPassword(pwForm.newPw);
            setPwForm({ newPw: '', confirm: '' });
            setPwMsg('updated');
        } catch {
            setPwMsg('Failed to update password.');
        } finally {
            setPwSaving(false);
        }
    };

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Compute stats
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (dates.includes(d.toISOString().split('T')[0])) currentStreak++;
        else break;
    }

    const expiryDate = new Date(profile.expiryDate);
    const joinDate = new Date(profile.joinDate);
    const daysRemaining = Math.max(0, Math.ceil((expiryDate - today) / 86400000));
    const totalDays = Math.max(1, Math.ceil((expiryDate - joinDate) / 86400000));
    const elapsed = totalDays - daysRemaining;
    const progressPct = Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));

    const monthVisits = dates.filter((d) => {
        const date = new Date(d);
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }).length;

    return (
        <div className="min-h-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Profile</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your personal information</p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                    <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e65100] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl flex-shrink-0 ring-4 ring-[#e65100]/20">
                            {profile.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-2 border-[#141414] flex items-center justify-center">
                            <Shield size={10} className="text-white sm:w-3 sm:h-3" />
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left min-w-0">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white">{profile.name}</h2>
                        <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start flex-wrap">
                            <span className="text-[10px] sm:text-xs text-[#e65100] font-semibold">ID: #{profile.id.toUpperCase().slice(0, 8)}</span>
                            <span className="text-gray-600">·</span>
                            <span className="text-[10px] sm:text-xs font-bold text-[#e65100] bg-[#e65100]/10 px-2 py-0.5 rounded-full">{profile.planName}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            Member since {joinDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/member')}
                        className="px-4 py-2 border border-[#e65100] text-[#e65100] text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#e65100]/10 transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                        <RefreshCw size={14} /> Manage Plan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Personal Information */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                        <h2 className="text-sm sm:text-base font-bold text-white mb-4 sm:mb-5 flex items-center gap-2">
                            <UserCircle size={18} className="text-[#e65100]" /> Personal Information
                        </h2>
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <ReadOnlyField label="Full Name" value={profile.name} />
                                <ReadOnlyField label="Email Address" value={profile.email} />
                                <EditableField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" />
                                <EditableField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={['', 'Male', 'Female', 'Other']} />
                            </div>
                            <EditableField label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Your address" />

                            <div className="flex items-center gap-3 mt-5">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 bg-[#e65100] text-white text-sm font-semibold rounded-xl hover:bg-[#bf360c] transition-colors shadow-lg shadow-[#e65100]/20 disabled:opacity-60"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                {saveMsg === 'saved' && <span className="text-sm text-emerald-400 font-medium">Profile updated</span>}
                                {saveMsg === 'error' && <span className="text-sm text-red-400 font-medium">Failed to save</span>}
                            </div>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6">
                        <h2 className="text-sm sm:text-base font-bold text-white mb-4 sm:mb-5 flex items-center gap-2">
                            <Lock size={18} className="text-[#e65100]" /> Change Password
                        </h2>
                        <form onSubmit={handlePwSave} className="space-y-4">
                            <EditableField label="New Password" name="newPw" type="password" value={pwForm.newPw} onChange={(e) => { setPwForm((p) => ({ ...p, newPw: e.target.value })); setPwMsg(''); }} placeholder="Minimum 6 characters" />
                            <EditableField label="Confirm New Password" name="confirm" type="password" value={pwForm.confirm} onChange={(e) => { setPwForm((p) => ({ ...p, confirm: e.target.value })); setPwMsg(''); }} placeholder="Repeat new password" />
                            {pwMsg && pwMsg !== 'updated' && <p className="text-sm text-red-400">{pwMsg}</p>}
                            {pwMsg === 'updated' && <p className="text-sm text-emerald-400 font-medium">Password updated successfully</p>}
                            <button
                                type="submit"
                                disabled={pwSaving}
                                className="px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors disabled:opacity-60"
                            >
                                {pwSaving ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Membership Stats */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <h3 className="text-sm font-bold text-white mb-4">Membership Stats</h3>
                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Visits</p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-[#e65100] mt-1">{dates.length}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">Current Streak</p>
                                <p className="text-xl sm:text-2xl font-extrabold text-[#e65100] mt-1">{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">This Month</p>
                                <p className="text-xl sm:text-2xl font-extrabold text-[#e65100] mt-1">{monthVisits} {monthVisits === 1 ? 'Visit' : 'Visits'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Plan */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Crown size={14} className="text-[#e65100]" /> Active Plan
                        </h3>
                        <p className="text-base sm:text-lg font-extrabold text-white">{profile.planName}</p>
                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Joined</span>
                                <span className="text-gray-300">{joinDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Expires</span>
                                <span className={`font-semibold ${daysRemaining <= 7 ? 'text-red-400' : 'text-gray-300'}`}>
                                    {expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Remaining</span>
                                <span className={`font-semibold ${daysRemaining <= 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#e65100] to-[#f57c00] rounded-full" style={{ width: `${progressPct}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 text-right">{progressPct}% elapsed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
