import api from './api';

const dashboardService = {
    async getDashboard() {
        const res = await api.get('/v1/dashboard');
        return res.data.data;
    },
};

export default dashboardService;
