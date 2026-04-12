import api from './api';

const broadcastService = {
    async getAll() {
        const res = await api.get('/v1/broadcasts');
        return res.data.data;
    },

    async send({ title, message, target, priority }) {
        const res = await api.post('/v1/broadcasts', { title, message, target, priority });
        return res.data.data;
    },

    async update(id, { title, message, target, priority }) {
        const res = await api.patch(`/v1/broadcasts/${id}`, { title, message, target, priority });
        return res.data.data;
    },

    async remove(id) {
        await api.delete(`/v1/broadcasts/${id}`);
    },
};

export default broadcastService;
