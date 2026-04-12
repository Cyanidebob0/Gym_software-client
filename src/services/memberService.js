import api from './api';

const memberService = {
    // ── Owner endpoints ───────────────────────────────────────────────────────
    async getAll() {
        const res = await api.get('/v1/members');
        return res.data.data;
    },

    async getById(id) {
        const res = await api.get(`/v1/members/${id}`);
        return res.data.data;
    },

    async create(data) {
        const res = await api.post('/v1/members', data);
        return res.data.data;
    },

    async update(id, data) {
        const res = await api.patch(`/v1/members/${id}`, data);
        return res.data.data;
    },

    async getStats() {
        const res = await api.get('/v1/members/stats');
        return res.data.data;
    },

    // ── Member registration flow ────────────────────────────────────────────
    async getMyStatus() {
        const res = await api.get('/v1/me/status');
        return res.data.data;
    },

    async selfRegister(data) {
        const res = await api.post('/v1/me/register', data);
        return res.data.data;
    },

    async getAvailablePlans() {
        const res = await api.get('/v1/me/plans');
        return res.data.data;
    },

    async activateWithPayment(data) {
        const res = await api.post('/v1/me/activate', data);
        return res.data.data;
    },

    async approveMember(id, status) {
        const res = await api.patch(`/v1/members/${id}/approve`, { status });
        return res.data.data;
    },

    // ── Member self-service ───────────────────────────────────────────────────
    async getMemberProfile() {
        const res = await api.get('/v1/me/profile');
        return res.data.data;
    },

    async getMemberAttendance() {
        const res = await api.get('/v1/me/attendance');
        // Components expect an array of date strings (e.g. ['2024-01-01', ...])
        const records = res.data.data || [];
        const dates = [...new Set(records.map((r) => r.date))].sort();
        return dates;
    },

    async updateMemberProfile(data) {
        const res = await api.patch('/v1/me/profile', data);
        return res.data.data;
    },

    async getMemberAttendanceRecords() {
        const res = await api.get('/v1/me/attendance');
        return res.data.data || [];
    },

    async getMemberPayments() {
        const res = await api.get('/v1/me/payments');
        return res.data.data;
    },

    async getMemberBroadcasts() {
        const res = await api.get('/v1/me/broadcasts');
        return res.data.data;
    },

    // ── Self check-in/out ────────────────────────────────────────────────────
    async getTodayCheckIn() {
        const res = await api.get('/v1/me/today-checkin');
        return res.data.data;
    },

    async selfCheckIn() {
        const res = await api.post('/v1/me/check-in');
        return res.data.data;
    },

    async selfCheckOut() {
        const res = await api.post('/v1/me/check-out');
        return res.data.data;
    },
};

export default memberService;
