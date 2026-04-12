const STYLES = {
    active:        'bg-emerald-400/10 text-emerald-400',
    expired:       'bg-red-400/10 text-red-400',
    expiring_soon: 'bg-amber-400/10 text-amber-400',
    blocked:       'bg-gray-400/10 text-gray-400',
    pending:       'bg-amber-400/10 text-amber-400',
    approved:      'bg-emerald-400/10 text-emerald-400',
    rejected:      'bg-red-400/10 text-red-400',
    completed:     'bg-emerald-400/10 text-emerald-400',
    refunded:      'bg-blue-400/10 text-blue-400',
    online:        'bg-blue-400/10 text-blue-400',
    offline:       'bg-gray-400/10 text-gray-400',
    cash:          'bg-emerald-400/10 text-emerald-400',
    upi:           'bg-purple-400/10 text-purple-400',
    card:          'bg-indigo-400/10 text-indigo-400',
};

const LABELS = {
    active:        'Active',
    expired:       'Expired',
    expiring_soon: 'Expiring Soon',
    blocked:       'Blocked',
    pending:       'Pending',
    approved:      'Approved',
    rejected:      'Rejected',
    completed:     'Completed',
    refunded:      'Refunded',
    online:        'Online',
    offline:       'Offline',
    cash:          'Cash',
    upi:           'UPI',
    card:          'Card',
};

const Badge = ({ status, label }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STYLES[status] ?? 'bg-gray-400/10 text-gray-400'}`}>
        {label ?? LABELS[status] ?? status}
    </span>
);

export default Badge;
