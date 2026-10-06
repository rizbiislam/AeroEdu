import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { AttendanceView } from './components/attendance/AttendanceView';
import { ExamAdmitCardView } from './components/examination/ExamAdmitCardView';
import { BillingFinanceView } from './components/billing/BillingFinanceView';
import { AcademicGradesView } from './components/grades/AcademicGradesView';
import { SupportTicketsView } from './components/support/SupportTicketsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { StudentIDCardView } from './components/idcard/StudentIDCardView';
import { ClassRoutineView } from './components/routine/ClassRoutineView';
import { InstituteAdminHub } from './components/admin/InstituteAdminHub';
import { InstituteDirectoryView } from './components/admin/InstituteDirectoryView';
import { LoginPortal } from './components/auth/LoginPortal';
import { ResultVerificationView } from './components/examination/ResultVerificationView';

const MainAppContent: React.FC = () => {
  const { activeTab, t } = useApp();
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

      case 'admin_hub':
        return <InstituteAdminHub />;

      case 'attendance_entry':
      case 'student_attendance':
      case 'guardian_attendance':
        return <AttendanceView />;

      case 'exam_builder':
      case 'admit_cards':
      case 'student_admit':
        return <ExamAdmitCardView />;

      case 'results_publish':
        return <ResultVerificationView />;

      case 'billing':
      case 'invoicing':
      case 'waiver_queue':
      case 'payment_recon':
      case 'student_fees':
      case 'guardian_pay':
        return <BillingFinanceView />;

      case 'grades':
      case 'student_grades':
      case 'guardian_grades':
        return <AcademicGradesView />;

      case 'support':
        return <SupportTicketsView />;

      case 'audit_logs':
        return <AuditLogView />;

      case 'id_cards':
      case 'students':
        return <StudentIDCardView />;

      case 'routine':
      case 'student_routine':
        return <ClassRoutineView />;

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
          {renderActiveView()}
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
