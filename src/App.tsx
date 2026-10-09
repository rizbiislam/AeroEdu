import React, { lazy, Suspense, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPortal } from './components/auth/LoginPortal';
import { isApiAuthEnabled } from './services/ApiClient';

const OverviewDashboard = lazy(() => import('./components/dashboard/OverviewDashboard').then((module) => ({ default: module.OverviewDashboard })));
const AttendanceView = lazy(() => import('./components/attendance/AttendanceView').then((module) => ({ default: module.AttendanceView })));
const ExamAdmitCardView = lazy(() => import('./components/examination/ExamAdmitCardView').then((module) => ({ default: module.ExamAdmitCardView })));
const BillingFinanceView = lazy(() => import('./components/billing/BillingFinanceView').then((module) => ({ default: module.BillingFinanceView })));
const AcademicGradesView = lazy(() => import('./components/grades/AcademicGradesView').then((module) => ({ default: module.AcademicGradesView })));
const SupportTicketsView = lazy(() => import('./components/support/SupportTicketsView').then((module) => ({ default: module.SupportTicketsView })));
const AuditLogView = lazy(() => import('./components/audit/AuditLogView').then((module) => ({ default: module.AuditLogView })));
const StudentIDCardView = lazy(() => import('./components/idcard/StudentIDCardView').then((module) => ({ default: module.StudentIDCardView })));
const ClassRoutineView = lazy(() => import('./components/routine/ClassRoutineView').then((module) => ({ default: module.ClassRoutineView })));
const InstituteAdminHub = lazy(() => import('./components/admin/InstituteAdminHub').then((module) => ({ default: module.InstituteAdminHub })));
const InstituteDirectoryView = lazy(() => import('./components/admin/InstituteDirectoryView').then((module) => ({ default: module.InstituteDirectoryView })));
const ResultVerificationView = lazy(() => import('./components/examination/ResultVerificationView').then((module) => ({ default: module.ResultVerificationView })));
const WorkspaceView = lazy(() => import('./components/operations/WorkspaceView').then((module) => ({ default: module.WorkspaceView })));
const PlatformSupportView = lazy(() => import('./components/support/PlatformSupportView').then((module) => ({ default: module.PlatformSupportView })));
const AssessmentWorkspace = lazy(() => import('./features/assessments/AssessmentWorkspace').then((module) => ({ default: module.AssessmentWorkspace })));
const InstitutePaymentAccounts = lazy(() => import('./components/admin/InstitutePaymentAccounts').then((module) => ({ default: module.InstitutePaymentAccounts })));
const RoleAccessWorkspace = lazy(() => import('./components/admin/RoleAccessWorkspace').then((module) => ({ default: module.RoleAccessWorkspace })));
const AcademicStructureWorkspace = lazy(() => import('./components/academic/AcademicStructureWorkspace').then((module) => ({ default: module.AcademicStructureWorkspace })));
const StudentRegistryWorkspace = lazy(() => import('./features/students/StudentRegistryWorkspace').then((module) => ({ default: module.StudentRegistryWorkspace })));

const MainAppContent: React.FC = () => {
  const { activeTab, role, t } = useApp();
  const [navigationOpen, setNavigationOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
      case 'student_home':
      case 'guardian_home':
      case 'homeroom':
        return <OverviewDashboard />;

      case 'institutes':
        return <InstituteDirectoryView />;

      case 'institute_setup':
        return <InstitutePaymentAccounts />;

      case 'classes':
        return isApiAuthEnabled ? <AcademicStructureWorkspace /> : <WorkspaceView />;

      case 'role_access':
        return <RoleAccessWorkspace />;

      case 'admin_hub':
        return <InstituteAdminHub />;

      case 'attendance_entry':
      case 'student_attendance':
      case 'guardian_attendance':
        return <AttendanceView />;

      case 'admit_cards':
      case 'student_admit':
        return <ExamAdmitCardView />;

      case 'exam_builder':
        return <AssessmentWorkspace />;

      case 'results_publish':
        return <ResultVerificationView />;

      case 'billing':
      case 'invoicing':
      case 'waiver_queue':
      case 'payment_recon':
      case 'student_fees':
      case 'guardian_pay':
        return <BillingFinanceView key={activeTab} />;

      case 'grades':
      case 'student_grades':
      case 'guardian_grades':
        return <AcademicGradesView />;

      case 'support':
        return role === 'super_admin' ? <PlatformSupportView /> : <SupportTicketsView />;

      case 'audit_logs':
        return <AuditLogView />;

      case 'id_cards':
      case 'students':
        return isApiAuthEnabled ? <StudentRegistryWorkspace /> : <StudentIDCardView />;

      case 'routine':
      case 'student_routine':
        return <ClassRoutineView />;

      case 'staff':
      case 'my_classes':
      case 'communications':
      case 'settings':
      case 'subscription':
      case 'plans':
      case 'onboarding':
      case 'api_access':
      case 'library':
      case 'transport':
      case 'hostel':
      case 'admissions':
      case 'reports':
      case 'knowledge_base':
      case 'fee_structures':
      case 'dues_report':
        return <WorkspaceView />;

      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="app-container">
      {navigationOpen && (
        <button
          className="navigation-backdrop"
          type="button"
          aria-label={t.portal_close_menu}
          onClick={() => setNavigationOpen(false)}
        />
      )}
      <Sidebar isOpen={navigationOpen} onNavigate={() => setNavigationOpen(false)} />
      <div className="main-content">
        <Navbar
          isMenuOpen={navigationOpen}
          onMenuClick={() => setNavigationOpen((open) => !open)}
        />
        <main className="content-body">
          <Suspense fallback={<div className="view-loading" role="status">Loading workspace…</div>}>
            {renderActiveView()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const MainAppRouter: React.FC = () => {
  const {
    isAuthenticated,
    needsInstituteSelection,
    availableInstitutes,
    currentUser,
    selectInstitute
  } = useApp();

  if (!isAuthenticated) {
    return <LoginPortal />;
  }

  if (needsInstituteSelection) {
    return <LoginPortal institutes={availableInstitutes} user={currentUser} onSelectInstitute={selectInstitute} />;
  }

  return <MainAppContent />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppRouter />
    </AppProvider>
  );
};

export default App;
