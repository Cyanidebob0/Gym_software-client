import api from './api';

const planService = {
    async getAll() {
        const res = await api.get('/v1/plans');
        return res.data.data;
    },

    async getActive() {
        const res = await api.get('/v1/plans/active');
        return res.data.data;
    },

    async getById(id) {
        const res = await api.get(`/v1/plans/${id}`);
        return res.data.data;
    },

    async create(data) {
        const res = await api.post('/v1/plans', data);
        return res.data.data;
    },

    async update(id, data) {
        const res = await api.patch(`/v1/plans/${id}`, data);
        return res.data.data;
    },

    async toggle(id) {
        const res = await api.patch(`/v1/plans/${id}/toggle`);
        return res.data.data;
    },
};

export default planService;
