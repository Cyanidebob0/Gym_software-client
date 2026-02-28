const OwnerDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">150</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Active Plans</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">120</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">$5,000</p>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
