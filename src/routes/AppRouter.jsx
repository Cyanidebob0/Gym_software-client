import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import OwnerLayout from '../components/layout/OwnerLayout';
import MemberLayout from '../components/layout/MemberLayout';
import ScrollToTop from '../components/common/ScrollToTop';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const AuthCallback = lazy(() => import('../pages/auth/AuthCallback'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const OwnerDashboard = lazy(() => import('../pages/owner/OwnerDashboard'));
const MembersPage = lazy(() => import('../pages/owner/members/MembersPage'));
const MemberRegistration = lazy(() => import('../pages/owner/members/MemberRegistration'));
const MemberDetail = lazy(() => import('../pages/owner/members/MemberDetail'));
const PlansPage = lazy(() => import('../pages/owner/plans/PlansPage'));
const AttendancePage = lazy(() => import('../pages/owner/attendance/AttendancePage'));
const PaymentsPage = lazy(() => import('../pages/owner/payments/PaymentsPage'));
const RefundsPage = lazy(() => import('../pages/owner/refunds/RefundsPage'));
const BroadcastPage = lazy(() => import('../pages/owner/broadcast/BroadcastPage'));
const ReportsPage = lazy(() => import('../pages/owner/reports/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/owner/settings/SettingsPage'));
const MemberDashboard = lazy(() => import('../pages/member/MemberDashboard'));
const MemberAttendance = lazy(() => import('../pages/member/Attendance'));
const MemberPayments = lazy(() => import('../pages/member/Payments'));
const MemberProfile = lazy(() => import('../pages/member/Profile'));
const MemberBroadcasts = lazy(() => import('../pages/member/Broadcasts'));
const MemberWorkouts = lazy(() => import('../pages/member/Workouts'));
const NotFound = lazy(() => import('../pages/NotFound'));
const PagePlaceholder = lazy(() => import('../components/common/PagePlaceholder'));

const PageLoader = () => (
    <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#e65100] border-t-transparent rounded-full animate-spin" />
    </div>
);

const AppRouter = () => {
    return (
        <>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
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
                    <Route index                  element={<OwnerDashboard />}     />
                    <Route path="members"         element={<MembersPage />}        />
                    <Route path="members/new"     element={<MemberRegistration />} />
                    <Route path="members/:id"     element={<MemberDetail />}       />
                    <Route path="members/:id/edit" element={<MemberRegistration />} />
                    <Route path="plans"           element={<PlansPage />}          />
                    <Route path="payments"        element={<PaymentsPage />}       />
                    <Route path="attendance"      element={<AttendancePage />}     />
                    <Route path="refunds"         element={<RefundsPage />}        />
                    <Route path="broadcast"       element={<BroadcastPage />}      />
                    <Route path="reports"         element={<ReportsPage />}        />
                    <Route path="settings"        element={<SettingsPage />}       />
                </Route>
            </Route>

            {/* Member Routes */}
            <Route element={<ProtectedRoute allowedRoles={['member']} />}>
                <Route path="/member" element={<MemberLayout />}>
                    <Route index element={<MemberDashboard />} />
                    <Route path="attendance"  element={<MemberAttendance />} />
                    <Route path="payments"    element={<MemberPayments />} />
                    <Route path="broadcasts"  element={<MemberBroadcasts />} />
                    <Route path="workouts"    element={<MemberWorkouts />} />
                    <Route path="profile"     element={<MemberProfile />} />
                </Route>
            </Route>

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </>
    );
};

export default AppRouter;
