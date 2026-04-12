const StatCard = ({ label, value, sub, icon, accent = 'border-[#e65100]' }) => {
    return (
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
                {icon && <span className="text-2xl">{icon}</span>}
            </div>
            <p className="text-4xl font-extrabold text-white leading-none">{value}</p>
            {sub && <p className="mt-2 text-xs text-gray-500">{sub}</p>}
        </div>
    );
};

export default StatCard;
