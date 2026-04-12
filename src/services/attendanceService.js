import api from './api';

const attendanceService = {
    async getByDate(date) {
        const res = await api.get(`/v1/attendance/date/${date}`);
        return res.data.data;
    },

    async getByMember(memberId) {
        const res = await api.get(`/v1/attendance/member/${memberId}`);
        return res.data.data;
    },

    async getTodayStats() {
        const res = await api.get('/v1/attendance/today-stats');
        return res.data.data;
    },

    async markAttendance(memberId) {
        const checkIn = new Date().toTimeString().slice(0, 5);
        const res = await api.post('/v1/attendance/mark-in', { memberId, checkIn });
        return res.data.data;
    },

    async markCheckout(id) {
        const checkOut = new Date().toTimeString().slice(0, 5);
        const res = await api.patch(`/v1/attendance/${id}/mark-out`, { checkOut });
        return res.data.data;
    },

    async remove(id) {
        await api.delete(`/v1/attendance/${id}`);
    },
};

export default attendanceService;
