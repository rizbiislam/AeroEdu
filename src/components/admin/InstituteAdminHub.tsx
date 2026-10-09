import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  Building2,
  Users,
  Shield,
  Briefcase,
  Award,
  Bell
} from 'lucide-react';
import { AdmissionsManagementTab } from './AdmissionsManagementTab';
import { FacultyLeavesTab } from './FacultyLeavesTab';
import { FeeWaiversTab } from './FeeWaiversTab';
import { BoardComplianceTab } from './BoardComplianceTab';
import { NoticesBroadcastTab } from './NoticesBroadcastTab';

type AdminHubTab = 'admissions' | 'staff_leaves' | 'waivers' | 'board_compliance' | 'notices';

export const InstituteAdminHub: React.FC = () => {
  const {
    currentInstitute,
    staff,
    admissions,
    approveAdmission,
    teacherLeaves,
    approveLeave,
    rejectLeave,
    feeWaivers,
    approveWaiver,
    rejectWaiver,
    boardCompliance,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminHubTab>('admissions');

  const pendingAdmissions = admissions.filter(a => a.status === 'pending' || a.status === 'interview_scheduled').length;
  const pendingLeaves = teacherLeaves.filter(l => l.status === 'pending').length;
  const pendingWaivers = feeWaivers.filter(w => w.status === 'pending').length;
  const boardIneligible = boardCompliance.filter(b => !b.is_eligible_for_board).length;

  const handleBroadcastNotice = (title: string, audience: 'all' | 'teachers' | 'guardians') => {
    showToast(`Notice "${title}" broadcasted to ${audience.toUpperCase()} via Push & SMS Gateway!`, 'success');
  };

  const handleScheduleInterview = (appId: string) => {
    showToast(`Interview scheduled for candidate #${appId}. Notification dispatched to guardian.`, 'info');
  };

  const handleRejectAdmission = (appId: string) => {
    showToast(`Application #${appId} rejected due to seat capacity / academic prerequisites.`, 'info');
  };

  const handleExportCompliance = () => {
    showToast('Exporting BISE Dhaka Form Fill-up Compliance Audit File...', 'info');
    setTimeout(() => {
      showToast('Downloaded: bise_dhaka_compliance_audit_2027.xlsx', 'success');
    }, 1000);
  };

  return (
    <div className="admin-hub-container">
      {/* Top Header Card */}
      <div className="card admin-hub-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={24} style={{ color: '#38bdf8' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Institutional Governance & Administration Hub
            </h1>
            <span className="badge badge-blue">Principal & Governing Body</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Executive oversight of admissions, faculty HR approvals, board regulatory compliance, and fee concessions • {currentInstitute.name}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            EIIN: <strong style={{ color: 'var(--text-main)' }}>{currentInstitute.eiin}</strong> • Board: <strong style={{ color: 'var(--text-main)' }}>Dhaka</strong>
          </span>
        </div>
      </div>

      {/* Admin Hub Navigation Tabs */}
      <div className="admin-tabs-nav">
        <button
          onClick={() => setActiveTab('admissions')}
          className={`admin-tab-btn ${activeTab === 'admissions' ? 'active' : ''}`}
        >
          <Users size={16} /> Admissions & Intake
          {pendingAdmissions > 0 && (
            <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              {pendingAdmissions}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('staff_leaves')}
          className={`admin-tab-btn ${activeTab === 'staff_leaves' ? 'active' : ''}`}
        >
          <Briefcase size={16} /> Faculty HR & Leaves
          {pendingLeaves > 0 && (
            <span className="badge badge-red" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              {pendingLeaves}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('waivers')}
          className={`admin-tab-btn ${activeTab === 'waivers' ? 'active' : ''}`}
        >
          <Award size={16} /> Fee Waivers & Concessions
          {pendingWaivers > 0 && (
            <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              {pendingWaivers}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('board_compliance')}
          className={`admin-tab-btn ${activeTab === 'board_compliance' ? 'active' : ''}`}
        >
          <Shield size={16} /> Board Form Fill-up Compliance
          {boardIneligible > 0 && (
            <span className="badge badge-red" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              {boardIneligible} Risk
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`admin-tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
        >
          <Bell size={16} /> Emergency Circulars & Notices
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'admissions' && (
        <AdmissionsManagementTab
          admissions={admissions}
          onApprove={approveAdmission}
          onReject={handleRejectAdmission}
          onScheduleInterview={handleScheduleInterview}
        />
      )}

      {activeTab === 'staff_leaves' && (
        <FacultyLeavesTab
          leaves={teacherLeaves}
          staff={staff}
          onApprove={approveLeave}
          onReject={rejectLeave}
        />
      )}

      {activeTab === 'waivers' && (
        <FeeWaiversTab
          waivers={feeWaivers}
          onApprove={approveWaiver}
          onReject={rejectWaiver}
        />
      )}

      {activeTab === 'board_compliance' && (
        <BoardComplianceTab
          complianceRecords={boardCompliance}
          onExportReport={handleExportCompliance}
        />
      )}

      {activeTab === 'notices' && (
        <NoticesBroadcastTab
          onBroadcast={handleBroadcastNotice}
        />
      )}
    </div>
  );
};
