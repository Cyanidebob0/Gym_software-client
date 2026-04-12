import { useEffect, useState, useCallback } from 'react';
import supabase from '../services/supabase';
import memberService from '../services/memberService';

const getStorageKey = (userId) => `broadcasts_seen_${userId}`;

const getSeenIds = (userId) => {
    try {
        return new Set(JSON.parse(localStorage.getItem(getStorageKey(userId)) || '[]'));
    } catch {
        return new Set();
    }
};

const saveSeenIds = (userId, ids) => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify([...ids]));
};

export default function useUnreadBroadcasts(userId) {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchCount = useCallback(() => {
        if (!userId) return;
        memberService.getMemberBroadcasts().then((broadcasts) => {
            if (!broadcasts || !Array.isArray(broadcasts)) return;
            const seen = getSeenIds(userId);

            // First time user — mark all existing as seen so only future ones are unread
            if (seen.size === 0 && broadcasts.length > 0) {
                const allIds = new Set(broadcasts.map((b) => b.id));
                saveSeenIds(userId, allIds);
                setUnreadCount(0);
                return;
            }

            const unseen = broadcasts.filter((b) => !seen.has(b.id));
            setUnreadCount(unseen.length);
        }).catch(() => {});
    }, [userId]);

    // Initial fetch
    useEffect(() => { fetchCount(); }, [fetchCount]);

    // Re-fetch on any broadcasts table change (Realtime)
    useEffect(() => {
        if (!userId) return;
        const channel = supabase
            .channel('member-broadcasts')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'broadcasts' },
                () => { fetchCount(); }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [userId, fetchCount]);

    // Mark given IDs as read
    const markAsRead = useCallback((ids) => {
        if (!userId || !ids || !ids.length) return;
        const seen = getSeenIds(userId);
        ids.forEach((id) => seen.add(id));
        saveSeenIds(userId, seen);
        setUnreadCount(0);
    }, [userId]);

    return { unreadCount, markAsRead };
}
