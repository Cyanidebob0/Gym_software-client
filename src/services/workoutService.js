import api from './api';

const workoutService = {
    async getExercises({ search = '', category = '', limit = 20, offset = 0 } = {}) {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('offset', String(offset));
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        const res = await api.get(`/v1/workouts/exercises?${params}`);
        return res.data.data;
    },

    async getExerciseDetail(id) {
        const res = await api.get(`/v1/workouts/exercises/${id}`);
        return res.data.data;
    },

    async getSessions({ limit = 20, offset = 0 } = {}) {
        const res = await api.get(`/v1/workouts/sessions?limit=${limit}&offset=${offset}`);
        return res.data.data;
    },

    async getSession(id) {
        const res = await api.get(`/v1/workouts/sessions/${id}`);
        return res.data.data;
    },

    async createSession(data) {
        const res = await api.post('/v1/workouts/sessions', data);
        return res.data.data;
    },

    async updateSession(id, data) {
        const res = await api.patch(`/v1/workouts/sessions/${id}`, data);
        return res.data.data;
    },

    async deleteSession(id) {
        await api.delete(`/v1/workouts/sessions/${id}`);
    },

    async getProgress(exerciseId) {
        const res = await api.get(`/v1/workouts/progress/${exerciseId}`);
        return res.data.data;
    },
};

export default workoutService;
