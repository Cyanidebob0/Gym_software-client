// Simple dependency-free bar and line charts using SVG + divs

export const BarChart = ({ data, color = '#e65100', height = 110 }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div className="flex items-end gap-1.5" style={{ height }}>
            {data.map(({ label, value }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {typeof value === 'number' && value > 1000
                            ? `₹${(value / 1000).toFixed(0)}k`
                            : value}
                    </span>
                    <div
                        className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
                        style={{
                            height: `${Math.max((value / max) * (height - 28), 4)}px`,
                            backgroundColor: color,
                        }}
                    />
                    <span className="text-[10px] text-gray-500 truncate w-full text-center">{label}</span>
                </div>
            ))}
        </div>
    );
};

export const LineChart = ({ data, color = '#e65100', height = 90 }) => {
    const W = 400;
    const H = height;
    const PAD = 8;
    const max = Math.max(...data.map((d) => d.value), 1);
    const min = Math.min(...data.map((d) => d.value));
    const range = max - min || 1;

    const pts = data.map((d, i) => ({
        x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
        y: H - PAD - ((d.value - min) / range) * (H - PAD * 2 - 12),
        label: d.label,
        value: d.value,
    }));

    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaD = `${pathD} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`;
    const gradId = `lg-${color.replace('#', '')}`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} aria-hidden="true">
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0"    />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#${gradId})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#141414" stroke={color} strokeWidth="2" />
            ))}
        </svg>
    );
};
