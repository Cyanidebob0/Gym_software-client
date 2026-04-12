import api from './api';

const refundService = {
    async getAll() {
        const res = await api.get('/v1/refunds');
        return res.data.data;
    },

    async create(data) {
        const res = await api.post('/v1/refunds', data);
        return res.data.data;
    },

    async updateStatus(id, status) {
        const res = await api.patch(`/v1/refunds/${id}`, { status });
        return res.data.data;
    },
};

export default refundService;
