const AdminDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Gyms</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">$45,000</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
