import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import MemberDashboard from '../pages/member/MemberDashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import OwnerLayout from '../components/layout/OwnerLayout';
import MemberLayout from '../components/layout/MemberLayout';
import PagePlaceholder from '../components/common/PagePlaceholder';

import ScrollToTop from '../components/common/ScrollToTop';
import LandingPage from '../pages/LandingPage';
import ServicesPage from '../pages/ServicesPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

const AppRouter = () => {
    return (
        <>
        <ScrollToTop />
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="config" element={<PagePlaceholder title="System Config" />} />
                    <Route path="logs" element={<PagePlaceholder title="Audit Logs" />} />
                </Route>
            </Route>

            {/* Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
                <Route path="/owner" element={<OwnerLayout />}>
                    <Route index element={<OwnerDashboard />} />
                    <Route path="members" element={<PagePlaceholder title="Members Management" />} />
                    <Route path="plans" element={<PagePlaceholder title="Plans Management" />} />
                    <Route path="payments" element={<PagePlaceholder title="Payments" />} />
                    <Route path="attendance" element={<PagePlaceholder title="Attendance" />} />
                    <Route path="broadcast" element={<PagePlaceholder title="Broadcast" />} />
                    <Route path="refunds" element={<PagePlaceholder title="Refunds" />} />
                </Route>
            </Route>

            {/* Member Routes */}
            <Route element={<ProtectedRoute allowedRoles={['member']} />}>
                <Route path="/member" element={<MemberLayout />}>
                    <Route index element={<MemberDashboard />} />
                    <Route path="attendance" element={<PagePlaceholder title="My Attendance" />} />
                    <Route path="payments" element={<PagePlaceholder title="My Payments" />} />
                    <Route path="profile" element={<PagePlaceholder title="My Profile" />} />
                </Route>
            </Route>

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </>
    );
};

export default AppRouter;
