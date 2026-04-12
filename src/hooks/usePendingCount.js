import { useEffect, useState, useCallback } from 'react';
import supabase from '../services/supabase';
import memberService from '../services/memberService';

export default function usePendingCount() {
    const [count, setCount] = useState(0);

    const fetchCount = useCallback(() => {
        memberService.getStats().then((stats) => {
            setCount(stats?.pending ?? 0);
        }).catch(() => {});
    }, []);

    // Fetch initial count from API
    useEffect(() => { fetchCount(); }, [fetchCount]);

    // Re-fetch on any members table change (more reliable than incremental calc)
    useEffect(() => {
        const channel = supabase
            .channel('pending-members')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'members' },
                () => { fetchCount(); }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchCount]);

    return count;
}
