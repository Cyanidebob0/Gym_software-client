import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import memberService from '../../../services/memberService';
import attendanceService from '../../../services/attendanceService';
import paymentService from '../../../services/paymentService';
import Badge from '../../../components/owner/Badge';
import { ArrowLeft } from 'lucide-react';

export default function MemberDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [payments, setPayments] = useState([]);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        memberService.getById(id).then((m) => {
            if (!m) navigate('/owner/members');
            else setMember(m);
        });
        attendanceService.getByMember(id).then(setAttendance);
        paymentService.getAll().then((all) => setPayments(all.filter((p) => p.memberId === id)));
    }, [id, navigate]);

    if (!member) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const TABS = ['info', 'attendance', 'payments'];

    return (
        <div className="max-w-3xl max-w-full overflow-x-hidden">
            {/* Back */}
            <Link to="/owner/members" className="text-sm text-gray-500 hover:text-[#e65100] flex items-center gap-1 mb-6 w-fit transition-colors">
                <ArrowLeft size={14} /> Back to Members
            </Link>

            {/* Member Card */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6 mb-4 flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e65100]/20 flex items-center justify-center text-xl sm:text-2xl font-extrabold text-[#e65100] flex-shrink-0">
                    {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl font-extrabold text-white truncate">{member.name}</h1>
                    <p className="text-gray-500 text-xs sm:text-sm">{member.phone} · {member.email}</p>
                </div>
                <Badge status={member.status} />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-[#141414] border border-white/5 rounded-xl p-1 w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                            activeTab === tab ? 'bg-[#e65100] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'info' && (
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
                    <InfoGrid member={member} />
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <Th>Date</Th><Th>Check-in</Th><Th>Check-out</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {attendance.length === 0
                                ? <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No attendance records.</td></tr>
                                : attendance.map((a) => (
                                    <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                                        <Td>{a.date}</Td>
                                        <Td>{a.checkIn}</Td>
                                        <Td>{a.checkOut ?? <span className="text-emerald-400 font-semibold text-xs">Present</span>}</Td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <Th>Invoice</Th><Th>Plan</Th><Th>Amount</Th><Th>Mode</Th><Th>Date</Th><Th>Status</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.length === 0
                                    ? <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No payment records.</td></tr>
                                    : payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                            <Td className="font-mono text-xs">{p.invoiceId}</Td>
                                            <Td>{p.planName}</Td>
                                            <Td className="font-bold">₹{p.amount.toLocaleString('en-IN')}</Td>
                                            <Td><Badge status={p.mode} /></Td>
                                            <Td>{p.date}</Td>
                                            <Td><Badge status={p.status} /></Td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoGrid({ member }) {
    const rows = [
        ['Plan', member.planName],
        ['Joined', member.joinDate],
        ['Expires', member.expiryDate],
        ['Address', member.address],
        ['Gov ID', `${member.govIdType}: ${member.govIdNumber}`],
        ['Email', member.email],
        ['Phone', member.phone],
    ];
    return (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rows.map(([label, value]) => (
                <div key={label}>
                    <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{value}</dd>
                </div>
            ))}
        </dl>
    );
}

const Th = ({ children }) => (
    <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{children}</th>
);
const Td = ({ children, className = '' }) => (
    <td className={`px-6 py-3 text-gray-400 ${className}`}>{children}</td>
);
