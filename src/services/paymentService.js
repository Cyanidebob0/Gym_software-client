import api from './api';

const paymentService = {
    async getAll() {
        const res = await api.get('/v1/payments');
        return res.data.data;
    },

    async getById(id) {
        const res = await api.get(`/v1/payments/${id}`);
        return res.data.data;
    },

    async create(data) {
        const res = await api.post('/v1/payments', data);
        return res.data.data;
    },

    async getMonthlyRevenue() {
        const res = await api.get('/v1/payments/stats');
        return res.data.data.monthlyRevenue;
    },

    async getYearlyRevenue() {
        const res = await api.get('/v1/payments/stats');
        return res.data.data.yearlyRevenue;
    },
};

export default paymentService;
