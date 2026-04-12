import api from './api';

const settingsService = {
    async get() {
        const res = await api.get('/v1/settings');
        return res.data.data;
    },

    async update(data) {
        const res = await api.put('/v1/settings', data);
        return res.data.data;
    },
};

export default settingsService;
