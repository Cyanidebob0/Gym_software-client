import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import workoutService from '../../services/workoutService';
import {
    Dumbbell,
    Search,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Calendar,
    Clock,
    TrendingUp,
    X,
    History,
    Target,
    Flame,
    Trophy,
    Zap,
    Activity,
    BarChart3,
    Save,
    Sparkles,
    Home,
    BookOpen,
    Weight,
    Timer,
    Layers,
    ChevronRight,
    Play,
    FolderOpen,
    ArrowLeft,
    RotateCcw,
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────

const TABS = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'workout', label: 'Workout', icon: Play },
    { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { key: 'exercises', label: 'Exercises', icon: Dumbbell },
    { key: 'library', label: 'Library', icon: BookOpen },
];

const STAT_PERIODS = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'Past Week' },
    { key: 'month', label: 'Full Month' },
];

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
    animate: { transition: { staggerChildren: 0.06 } },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isWithinPeriod(dateStr, period) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (period === 'day') return d.getTime() === now.getTime();
    if (period === 'week') {
        const diff = now.getTime() - d.getTime();
        return diff >= 0 && diff < 7 * 86400000;
    }
    if (period === 'month') {
        const diff = now.getTime() - d.getTime();
        return diff >= 0 && diff < 30 * 86400000;
    }
    return false;
}

function calcSessionStats(session) {
    const sets = session.workoutSets || [];
    const totalVolume = sets.reduce((sum, s) => sum + (s.weightKg || 0) * (s.reps || 0), 0);
    const totalSets = sets.length;
    const exerciseNames = [...new Set(sets.map((s) => s.exerciseName))];
    return { totalVolume, totalSets, exerciseNames };
}

function formatVolume(v) {
    if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return String(v);
}

// ── Exercise Search Component ────────────────────────────────────────────────

function ExerciseSearch({ onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const search = useCallback((q) => {
        if (!q.trim()) { setResults([]); return; }
        setLoading(true);
        workoutService.getExercises({ search: q, limit: 10 })
            .then(setResults)
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, []);

    const handleInput = (e) => {
        const val = e.target.value;
        setQuery(val);
        setOpen(true);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(val), 300);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={handleInput}
                    onFocus={() => results.length && setOpen(true)}
                    placeholder="Search exercises (e.g. Bench Press, Squat...)"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e65100]/50 focus:border-[#e65100]/50 focus:bg-white/[0.06] transition-all duration-300"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e65100] transition-colors duration-300" />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
            <AnimatePresence>
                {open && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute z-30 top-full mt-2 w-full bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 max-h-64 overflow-y-auto overflow-x-hidden"
                    >
                        {results.map((ex, i) => (
                            <motion.button
                                key={ex.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                type="button"
                                onClick={() => { onSelect(ex); setQuery(''); setOpen(false); setResults([]); }}
                                className="w-full text-left px-4 py-3 hover:bg-[#e65100]/10 transition-all duration-200 border-b border-white/[0.04] last:border-0 group/item"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#e65100]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#e65100]/20 transition-colors">
                                        <Dumbbell size={14} className="text-[#e65100]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{ex.name}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{ex.category}{ex.muscles?.length ? ` · ${ex.muscles.map((m) => m.name).join(', ')}` : ''}</p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Log Workout Form (inline) ────────────────────────────────────────────────

function LogWorkoutForm({ onSaved, onClose }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [name, setName] = useState('');
    const [durationMin, setDurationMin] = useState('');
    const [exercises, setExercises] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const addExercise = (ex) => {
        if (exercises.find((e) => e.exercise_id === ex.id)) return;
        setExercises((prev) => [...prev, {
            exercise_id: ex.id,
            exercise_name: ex.name,
            sets: [{ reps: '', weight_kg: '' }],
        }]);
    };

    const addSet = (exIdx) => {
        setExercises((prev) => prev.map((e, i) =>
            i === exIdx ? { ...e, sets: [...e.sets, { reps: '', weight_kg: '' }] } : e
        ));
    };

    const removeSet = (exIdx, setIdx) => {
        setExercises((prev) => prev.map((e, i) =>
            i === exIdx ? { ...e, sets: e.sets.filter((_, si) => si !== setIdx) } : e
        ).filter((e) => e.sets.length > 0));
    };

    const removeExercise = (exIdx) => {
        setExercises((prev) => prev.filter((_, i) => i !== exIdx));
    };

    const updateSet = (exIdx, setIdx, field, value) => {
        setExercises((prev) => prev.map((e, i) =>
            i === exIdx ? {
                ...e,
                sets: e.sets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s),
            } : e
        ));
    };

    const handleSave = async () => {
        if (exercises.length === 0) { setError('Add at least one exercise.'); return; }
        setError('');
        setSaving(true);
        try {
            const sets = exercises.flatMap((ex) =>
                ex.sets.map((s, si) => ({
                    exercise_id: ex.exercise_id,
                    exercise_name: ex.exercise_name,
                    set_number: si + 1,
                    reps: s.reps ? Number(s.reps) : undefined,
                    weight_kg: s.weight_kg ? Number(s.weight_kg) : undefined,
                }))
            );
            await workoutService.createSession({
                date,
                name: name || undefined,
                duration_min: durationMin ? Number(durationMin) : undefined,
                sets,
            });
            setExercises([]);
            setName('');
            setDurationMin('');
            onSaved();
        } catch {
            setError('Failed to save workout.');
        } finally {
            setSaving(false);
        }
    };

    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
        >
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/[0.06] rounded-2xl p-5 mb-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#e65100]/15 flex items-center justify-center">
                            <Plus size={16} className="text-[#e65100]" />
                        </div>
                        Log New Workout
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                        <X size={16} />
                    </button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            <Calendar size={10} className="text-[#e65100]" /> Date
                        </label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#e65100]/50 transition-all [color-scheme:dark]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            <Sparkles size={10} className="text-[#e65100]" /> Session Name
                        </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Push Day..."
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/50 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            <Timer size={10} className="text-[#e65100]" /> Duration (min)
                        </label>
                        <input type="number" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} placeholder="e.g. 60"
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e65100]/50 transition-all" />
                    </div>
                </div>

                {/* Exercise Search */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        <Search size={10} className="text-[#e65100]" /> Add Exercise
                    </label>
                    <ExerciseSearch onSelect={addExercise} />
                </div>

                {/* Exercise List */}
                {exercises.length === 0 ? (
                    <div className="bg-white/[0.02] border border-dashed border-white/[0.06] rounded-xl p-6 text-center">
                        <Dumbbell size={20} className="text-gray-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Search and add exercises above</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-4 px-1 text-[10px] text-gray-500">
                            <span><strong className="text-white">{exercises.length}</strong> exercise{exercises.length !== 1 ? 's' : ''}</span>
                            <span><strong className="text-white">{totalSets}</strong> set{totalSets !== 1 ? 's' : ''}</span>
                        </div>

                        {exercises.map((ex, exIdx) => (
                            <div key={ex.exercise_id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-[#e65100]/10 flex items-center justify-center">
                                            <Dumbbell size={11} className="text-[#e65100]" />
                                        </div>
                                        <span className="text-xs font-bold text-white">{ex.exercise_name}</span>
                                    </div>
                                    <button onClick={() => removeExercise(exIdx)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                                        <X size={13} />
                                    </button>
                                </div>
                                <div className="px-3 py-1.5">
                                    <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-1.5 mb-1 px-1">
                                        <span className="text-[9px] text-gray-600 uppercase">Set</span>
                                        <span className="text-[9px] text-gray-600 uppercase">Reps</span>
                                        <span className="text-[9px] text-gray-600 uppercase">Kg</span>
                                        <span />
                                    </div>
                                    {ex.sets.map((s, si) => (
                                        <div key={si} className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-1.5 mb-1 items-center">
                                            <span className="text-[10px] text-gray-600 font-mono text-center">{si + 1}</span>
                                            <input type="number" value={s.reps} onChange={(e) => updateSet(exIdx, si, 'reps', e.target.value)} placeholder="--"
                                                className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-[#e65100]/40 transition-all placeholder-gray-700" />
                                            <input type="number" value={s.weight_kg} onChange={(e) => updateSet(exIdx, si, 'weight_kg', e.target.value)} placeholder="--"
                                                className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-[#e65100]/40 transition-all placeholder-gray-700" />
                                            <button onClick={() => removeSet(exIdx, si)} className="text-gray-700 hover:text-red-400 transition-colors flex items-center justify-center">
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addSet(exIdx)}
                                        className="mt-1 mb-1 text-[10px] font-semibold text-[#e65100] hover:text-[#f57c00] transition-colors flex items-center gap-1 px-1 py-0.5">
                                        <Plus size={11} /> Add Set
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

                {exercises.length > 0 && (
                    <button onClick={handleSave} disabled={saving}
                        className="w-full py-3 bg-gradient-to-r from-[#e65100] to-[#f4511e] hover:from-[#bf360c] hover:to-[#e65100] disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#e65100]/25 flex items-center justify-center gap-2 text-sm active:scale-[0.98]">
                        {saving ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={15} /> Save Workout</>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// ── Workout Card ─────────────────────────────────────────────────────────────

function WorkoutCard({ session, exerciseMap, onDelete, delay = 0 }) {
    const [expanded, setExpanded] = useState(false);
    const sets = session.workoutSets || [];
    const { totalVolume, totalSets, exerciseNames } = calcSessionStats(session);

    // Gather muscles from exerciseMap
    const muscles = useMemo(() => {
        const muscleSet = new Set();
        const exerciseIds = [...new Set(sets.map((s) => s.exerciseId))];
        for (const id of exerciseIds) {
            const info = exerciseMap[id];
            if (info?.muscles) {
                for (const m of info.muscles) muscleSet.add(m.name);
            }
        }
        return [...muscleSet];
    }, [sets, exerciseMap]);

    // Group exercises with their set counts and image
    const exerciseGroups = useMemo(() => {
        const groups = [];
        const seen = new Set();
        for (const s of sets) {
            if (!seen.has(s.exerciseId)) {
                seen.add(s.exerciseId);
                const count = sets.filter((x) => x.exerciseId === s.exerciseId).length;
                const info = exerciseMap[s.exerciseId];
                groups.push({
                    id: s.exerciseId,
                    name: s.exerciseName,
                    setCount: count,
                    image: info?.images?.[0]?.url || null,
                    category: info?.category || null,
                });
            }
        }
        return groups;
    }, [sets, exerciseMap]);

    const durationMin = session.durationMin;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-br from-[#161616] to-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden group"
        >
            {/* Card Header */}
            <div className="p-4 pb-0">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#e65100]/20 to-[#e65100]/5 flex items-center justify-center flex-shrink-0 border border-[#e65100]/10">
                            <Dumbbell size={18} className="text-[#e65100]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white truncate leading-tight">
                                {session.name || new Date(session.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </h3>
                            <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                <Calendar size={9} />
                                {new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={14} />
                        </motion.div>
                    </button>
                </div>

                {/* Muscles */}
                {muscles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {muscles.map((m) => (
                            <span key={m} className="text-[9px] font-semibold uppercase tracking-wider text-[#e65100] bg-[#e65100]/10 px-2 py-0.5 rounded-full border border-[#e65100]/15">
                                {m}
                            </span>
                        ))}
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/[0.04]">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Timer size={10} className="text-gray-500" />
                            <span className="text-[9px] text-gray-500 uppercase font-semibold">Duration</span>
                        </div>
                        <p className="text-sm font-bold text-white">
                            {durationMin ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m` : '--'}
                        </p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/[0.04]">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Flame size={10} className="text-[#e65100]" />
                            <span className="text-[9px] text-gray-500 uppercase font-semibold">Volume</span>
                        </div>
                        <p className="text-sm font-bold text-white">{totalVolume > 0 ? `${totalVolume.toLocaleString()} kg` : '--'}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/[0.04]">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Layers size={10} className="text-gray-500" />
                            <span className="text-[9px] text-gray-500 uppercase font-semibold">Sets</span>
                        </div>
                        <p className="text-sm font-bold text-white">{totalSets}</p>
                    </div>
                </div>
            </div>

            {/* Exercise Grid */}
            <div className="px-4 pb-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {exerciseGroups.map((ex) => (
                        <div key={ex.id} className="flex flex-col items-center text-center group/ex">
                            <div className="w-full aspect-square rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center overflow-hidden mb-1.5 group-hover/ex:border-[#e65100]/20 transition-colors">
                                {ex.image ? (
                                    <img
                                        src={ex.image}
                                        alt={ex.name}
                                        className="w-full h-full object-contain p-1 opacity-80 group-hover/ex:opacity-100 transition-opacity invert brightness-75"
                                        loading="lazy"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <div className={`${ex.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                                    <Dumbbell size={20} className="text-gray-700" />
                                </div>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-tight line-clamp-2">
                                <span className="text-[#e65100] font-bold">{ex.setCount}×</span> {ex.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Set Details</p>
                            {exerciseGroups.map((ex) => {
                                const exSets = sets.filter((s) => s.exerciseId === ex.id);
                                return (
                                    <div key={ex.id} className="mb-3 last:mb-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#e65100]" />
                                            <p className="text-xs font-bold text-[#e65100]">{ex.name}</p>
                                        </div>
                                        <div className="ml-3.5 space-y-0.5">
                                            {exSets.map((st, idx) => (
                                                <div key={idx} className="flex items-center gap-4 text-xs text-gray-400 py-1 px-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                                                    <span className="text-gray-600 w-9 font-mono text-[10px]">Set {st.setNumber}</span>
                                                    <span className="min-w-[4rem]">
                                                        <span className="text-white font-semibold">{st.reps ?? '--'}</span> reps
                                                    </span>
                                                    <span>
                                                        <span className="text-white font-semibold">{st.weightKg ? `${st.weightKg}` : '--'}</span> kg
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="mt-3 pt-3 border-t border-white/[0.04]">
                                <button onClick={() => onDelete(session.id)}
                                    className="text-xs text-gray-600 hover:text-red-400 transition-all duration-200 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-red-400/5">
                                    <Trash2 size={12} /> Delete Session
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ onNavigate }) {
    const [sessions, setSessions] = useState([]);
    const [exerciseMap, setExerciseMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [statsPeriod, setStatsPeriod] = useState('week');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await workoutService.getSessions({ limit: 50 });
            setSessions(data || []);

            // Collect unique exercise IDs and fetch details
            const exerciseIds = new Set();
            for (const s of data || []) {
                for (const set of s.workoutSets || []) {
                    exerciseIds.add(set.exerciseId);
                }
            }

            const map = {};
            const fetches = [...exerciseIds].map(async (id) => {
                try {
                    const detail = await workoutService.getExerciseDetail(id);
                    map[id] = detail;
                } catch {
                    // Silently fail for individual exercises
                }
            });
            await Promise.allSettled(fetches);
            setExerciseMap(map);
        } catch {
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Filter sessions by period
    const filteredSessions = useMemo(() => {
        return sessions.filter((s) => isWithinPeriod(s.date, statsPeriod));
    }, [sessions, statsPeriod]);

    // Aggregate stats
    const stats = useMemo(() => {
        let totalVolume = 0;
        let totalSets = 0;
        let totalDuration = 0;
        const muscleSet = new Set();

        for (const s of filteredSessions) {
            if (s.durationMin) totalDuration += s.durationMin;
            for (const set of s.workoutSets || []) {
                totalSets++;
                totalVolume += (set.weightKg || 0) * (set.reps || 0);
                const info = exerciseMap[set.exerciseId];
                if (info?.muscles) {
                    for (const m of info.muscles) muscleSet.add(m.name);
                }
            }
        }

        return {
            workouts: filteredSessions.length,
            totalVolume,
            totalSets,
            totalDuration,
            muscles: [...muscleSet],
        };
    }, [filteredSessions, exerciseMap]);

    const handleDelete = async (id) => {
        await workoutService.deleteSession(id);
        setSessions((prev) => prev.filter((s) => s.id !== id));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-[3px] border-[#e65100] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500">Loading your workouts...</p>
            </div>
        );
    }

    return (
        <motion.div {...fadeUp} className="space-y-6">
            {/* Start Workout CTA */}
            <div className="flex justify-end">
                <button
                    onClick={() => onNavigate('workout')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.97] bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white shadow-lg shadow-[#e65100]/25 hover:shadow-xl hover:shadow-[#e65100]/30"
                >
                    <Play size={15} /> Start a New Workout
                </button>
            </div>

            {/* Stats Period Toggle */}
            <div>
                <div className="flex items-center gap-1 bg-[#141414]/80 backdrop-blur-sm border border-white/[0.06] rounded-xl p-1 w-fit mb-4">
                    {STAT_PERIODS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setStatsPeriod(key)}
                            className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                statsPeriod === key ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {statsPeriod === key && (
                                <motion.div
                                    layoutId="activePeriod"
                                    className="absolute inset-0 bg-gradient-to-r from-[#e65100] to-[#f4511e] rounded-lg shadow-lg shadow-[#e65100]/20"
                                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <motion.div {...fadeUp} className="bg-gradient-to-br from-[#e65100]/15 to-[#e65100]/5 rounded-2xl p-4 border border-[#e65100]/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,81,0,0.1)_0%,_transparent_60%)]" />
                        <div className="relative">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Activity size={12} className="text-[#e65100]" />
                                <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Workouts</span>
                            </div>
                            <p className="text-2xl font-extrabold text-white">{stats.workouts}</p>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp} className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.05]">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Flame size={12} className="text-[#e65100]" />
                            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Volume</span>
                        </div>
                        <p className="text-2xl font-extrabold text-white">
                            {stats.totalVolume > 0 ? <>{formatVolume(stats.totalVolume)}<span className="text-sm font-bold text-gray-400 ml-1">kg</span></> : '--'}
                        </p>
                    </motion.div>

                    <motion.div {...fadeUp} className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.05]">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Layers size={12} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Total Sets</span>
                        </div>
                        <p className="text-2xl font-extrabold text-white">{stats.totalSets}</p>
                    </motion.div>

                    <motion.div {...fadeUp} className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.05]">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Timer size={12} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Duration</span>
                        </div>
                        <p className="text-2xl font-extrabold text-white">
                            {stats.totalDuration > 0 ? (
                                <>{Math.floor(stats.totalDuration / 60)}<span className="text-sm font-bold text-gray-400">h </span>{stats.totalDuration % 60}<span className="text-sm font-bold text-gray-400">m</span></>
                            ) : '--'}
                        </p>
                    </motion.div>
                </div>

                {/* Muscles Hit */}
                {stats.muscles.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Muscles Hit</span>
                        {stats.muscles.map((m) => (
                            <span key={m} className="text-[9px] font-semibold text-[#e65100] bg-[#e65100]/10 px-2.5 py-1 rounded-full border border-[#e65100]/15">
                                {m}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Workouts */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <History size={16} className="text-gray-400" /> Recent Workouts
                    </h2>
                    <span className="text-[10px] text-gray-500">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
                </div>

                {sessions.length === 0 ? (
                    <div className="relative bg-gradient-to-b from-white/[0.02] to-transparent border border-dashed border-white/[0.08] rounded-2xl p-12 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,81,0,0.03)_0%,_transparent_70%)]" />
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-[#e65100]/10 flex items-center justify-center mx-auto mb-4">
                                <Dumbbell size={28} className="text-[#e65100]/50" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">No workouts logged yet</p>
                            <p className="text-xs text-gray-600 mt-1 mb-4">Start your fitness journey by logging your first workout</p>
                            <button
                                onClick={() => onNavigate('workout')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#e65100]/25 hover:shadow-xl transition-all active:scale-[0.97]"
                            >
                                <Play size={15} /> Start Your First Workout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sessions.map((s, i) => (
                            <WorkoutCard
                                key={s.id}
                                session={s}
                                exerciseMap={exerciseMap}
                                onDelete={handleDelete}
                                delay={i * 0.04}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ── Workout Tab ──────────────────────────────────────────────────────────────

function WorkoutTab({ onSaved }) {
    const [mode, setMode] = useState('choose'); // 'choose' | 'new' | 'library'

    if (mode === 'new') {
        return (
            <motion.div {...fadeUp} className="space-y-4">
                {/* Back button */}
                <button
                    onClick={() => setMode('choose')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors px-1 py-1 rounded-lg hover:bg-white/[0.03]"
                >
                    <ArrowLeft size={14} /> Back
                </button>

                <LogWorkoutForm
                    onSaved={() => { setMode('choose'); onSaved(); }}
                    onClose={() => setMode('choose')}
                />
            </motion.div>
        );
    }

    if (mode === 'library') {
        return (
            <motion.div {...fadeUp} className="space-y-4">
                {/* Back button */}
                <button
                    onClick={() => setMode('choose')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors px-1 py-1 rounded-lg hover:bg-white/[0.03]"
                >
                    <ArrowLeft size={14} /> Back
                </button>

                {/* Saved Routines */}
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FolderOpen size={16} className="text-[#e65100]" /> Your Saved Routines
                    </h3>

                    <div className="relative bg-gradient-to-b from-white/[0.02] to-transparent border border-dashed border-white/[0.08] rounded-2xl p-12 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,81,0,0.03)_0%,_transparent_70%)]" />
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 border border-white/[0.05]">
                                <BookOpen size={28} className="text-gray-600" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">No saved routines yet</p>
                            <p className="text-xs text-gray-600 mt-1 mb-4">Save your workout plans here to quickly start them later</p>
                            <button
                                onClick={() => setMode('new')}
                                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#e65100] bg-[#e65100]/10 border border-[#e65100]/15 rounded-xl hover:bg-[#e65100]/15 transition-all"
                            >
                                <Plus size={13} /> Create your first routine
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // 'choose' mode — landing page with two options
    return (
        <motion.div {...fadeUp} className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-white mb-1">Start a Workout</h2>
                <p className="text-xs text-gray-500">Choose how you'd like to begin</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Start New */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('new')}
                    className="relative bg-gradient-to-br from-[#161616] to-[#111111] border border-white/[0.06] rounded-2xl p-6 text-left overflow-hidden group hover:border-[#e65100]/20 transition-all duration-300"
                >
                    {/* Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(230,81,0,0.06)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e65100]/20 to-[#e65100]/5 flex items-center justify-center mb-4 border border-[#e65100]/10 group-hover:from-[#e65100]/30 group-hover:to-[#e65100]/10 transition-all duration-300">
                            <Plus size={24} className="text-[#e65100]" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                            Start New Workout
                            <ChevronRight size={16} className="text-gray-600 group-hover:text-[#e65100] group-hover:translate-x-0.5 transition-all" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Build a workout from scratch — add exercises, sets, reps and weight as you go
                        </p>
                    </div>
                </motion.button>

                {/* Option 2: From Library */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('library')}
                    className="relative bg-gradient-to-br from-[#161616] to-[#111111] border border-white/[0.06] rounded-2xl p-6 text-left overflow-hidden group hover:border-white/[0.12] transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.02)_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4 border border-white/[0.06] group-hover:bg-white/[0.06] transition-all duration-300">
                            <RotateCcw size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                            From Library
                            <ChevronRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Pick a saved workout plan or routine and start it instantly
                        </p>
                    </div>
                </motion.button>
            </div>
        </motion.div>
    );
}

// ── Placeholder Tabs ─────────────────────────────────────────────────────────

function PlaceholderTab({ icon: Icon, title, description }) {
    return (
        <motion.div {...fadeUp} className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 border border-white/[0.05]">
                <Icon size={28} className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
        </motion.div>
    );
}

// ── Main Workouts Page ───────────────────────────────────────────────────────

export default function Workouts() {
    const [tab, setTab] = useState('home');

    return (
        <div className="min-h-full max-w-full overflow-x-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-3"
            >
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e65100] to-[#bf360c] flex items-center justify-center shadow-lg shadow-[#e65100]/20">
                            <Dumbbell size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Workouts</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-[3.25rem]">Log, track, and analyze your training</p>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex gap-1 mb-8 bg-[#141414]/80 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-1.5 w-fit"
            >
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            tab === key
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                        }`}
                    >
                        {tab === key && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-[#e65100] to-[#f4511e] rounded-xl shadow-lg shadow-[#e65100]/25"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Icon size={14} /> {label}
                        </span>
                    </button>
                ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    {tab === 'home' && <HomeTab onNavigate={setTab} />}
                    {tab === 'workout' && <WorkoutTab onSaved={() => setTab('home')} />}
                    {tab === 'leaderboard' && <PlaceholderTab icon={Trophy} title="Leaderboard" description="Coming soon — compete with your gym mates" />}
                    {tab === 'exercises' && <PlaceholderTab icon={Dumbbell} title="Exercises" description="Coming soon — browse and discover exercises" />}
                    {tab === 'library' && <PlaceholderTab icon={BookOpen} title="Library" description="Coming soon — save your favorite routines" />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
