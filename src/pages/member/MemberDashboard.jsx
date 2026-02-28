const MemberDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, Member!</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Days Attended</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">15</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Next Payment Due</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">Feb 28, 2026</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">Pro Plan</p>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
