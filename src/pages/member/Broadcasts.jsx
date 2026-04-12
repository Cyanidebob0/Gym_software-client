import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import supabase from '../../services/supabase';
import memberService from '../../services/memberService';
import {
    Megaphone,
    Search,
    Bell,
    AlertTriangle,
    Info,
} from 'lucide-react';

const TABS = [
    { key: 'all', label: 'All Updates' },
    { key: 'normal', label: 'General' },
    { key: 'high', label: 'Important' },
    { key: 'urgent', label: 'Urgent' },
];

const targetLabel = (target) => {
    const map = { all: 'All Members', active: 'Active Members', expiring: 'Expiring Members' };
    return map[target] ?? target;
};

const priorityStyle = (priority) => {
    if (priority === 'urgent') return 'bg-red-500/10 text-red-400';
    if (priority === 'high') return 'bg-amber-400/10 text-amber-400';
    return 'bg-[#e65100]/10 text-[#e65100]';
};

const priorityLabel = (priority) => {
    if (priority === 'urgent') return 'Urgent';
    if (priority === 'high') return 'Important';
    return 'General';
};

const Broadcasts = () => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const { markAsRead } = useOutletContext();

    const fetchBroadcasts = useCallback(() => {
        memberService.getMemberBroadcasts().then((data) => {
            setBroadcasts(data);
            setLoading(false);
            markAsRead(data.map((b) => b.id));
        }).catch(() => setLoading(false));
    }, [markAsRead]);

    // Initial fetch
    useEffect(() => { fetchBroadcasts(); }, [fetchBroadcasts]);

    // Live updates via Supabase Realtime
    useEffect(() => {
        const channel = supabase
            .channel('broadcasts-page')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'broadcasts' },
                () => { fetchBroadcasts(); }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [fetchBroadcasts]);

    const filtered = broadcasts.filter((b) => {
        const matchesTab = activeTab === 'all' || b.priority === activeTab;
        const q = search.toLowerCase();
        const matchesSearch = !q || b.title.toLowerCase().includes(q) || b.message.toLowerCase().includes(q);
        return matchesTab && matchesSearch;
    });

    const featured = filtered[0];
    const rest = filtered.slice(1);

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                        <Megaphone size={24} className="text-[#e65100]" /> Announcements
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{broadcasts.length} announcement{broadcasts.length !== 1 ? 's' : ''} from your gym</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/40 focus:border-[#e65100]"
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 sm:gap-6 mb-6 border-b border-white/5 pb-3 overflow-x-auto scrollbar-none -mx-1 px-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`text-xs sm:text-sm font-semibold pb-1 transition-colors whitespace-nowrap flex-shrink-0 ${
                            activeTab === tab.key
                                ? 'text-[#e65100] border-b-2 border-[#e65100]'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 sm:p-12 text-center">
                    <Bell size={32} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                        {broadcasts.length === 0 ? 'No announcements yet.' : 'No announcements match your filter.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Featured Announcement (latest) */}
                    {featured && (
                        <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden mb-4 sm:mb-6">
                            <div className="h-32 sm:h-44 bg-gradient-to-br from-[#1a1400] to-[#0a0a0a] flex items-end p-4 sm:p-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                                <div className="relative z-10">
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${priorityStyle(featured.priority)}`}>
                                            {priorityLabel(featured.priority)}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                                            {targetLabel(featured.target)}
                                        </span>
                                    </div>
                                    <h2 className="text-base sm:text-xl font-extrabold text-white">{featured.title}</h2>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 pt-2 sm:pt-3">
                                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3 sm:mb-4 whitespace-pre-line">{featured.message}</p>
                                <span className="text-[11px] sm:text-xs text-gray-600">
                                    Posted {new Date(featured.sentAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Remaining Announcements */}
                    {rest.length > 0 && (
                        <div className="space-y-3 sm:space-y-4">
                            {rest.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/10 transition-colors"
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                            msg.priority === 'urgent' ? 'bg-red-500/10' : msg.priority === 'high' ? 'bg-amber-400/10' : 'bg-[#e65100]/10'
                                        }`}>
                                            {msg.priority === 'urgent'
                                                ? <AlertTriangle size={16} className="text-red-400" />
                                                : msg.priority === 'high'
                                                    ? <Bell size={16} className="text-amber-400" />
                                                    : <Info size={16} className="text-[#e65100]" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-sm sm:text-base font-bold text-white">{msg.title}</h3>
                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${priorityStyle(msg.priority)}`}>
                                                    {priorityLabel(msg.priority)}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-2 whitespace-pre-line">{msg.message}</p>
                                            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-gray-600">
                                                <span>{new Date(msg.sentAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="text-gray-700">·</span>
                                                <span>{targetLabel(msg.target)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Broadcasts;
