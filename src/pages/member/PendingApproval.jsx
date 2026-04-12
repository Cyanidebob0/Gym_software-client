import { Hourglass, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PendingApproval() {
    const { logout } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-5">
                    <Hourglass size={32} className="text-amber-400" />
                </div>
                <h1 className="text-2xl font-extrabold text-white mb-2">Waiting for Approval</h1>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                    Your registration has been submitted. Please wait for the gym owner to review and approve your application.
                    You'll be able to select a plan and start your membership once approved.
                </p>
                <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
}
