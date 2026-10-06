import React from 'react';
import type { TeacherLeaveRequest, StaffMember } from '../../types';
import { TeacherLeaveEntity } from '../../models/TeacherLeaveEntity';
import { CheckCircle2, XCircle, Clock, Briefcase } from 'lucide-react';

interface FacultyLeavesTabProps {
  leaves: TeacherLeaveRequest[];
  staff: StaffMember[];
  onApprove: (leaveId: string) => void;
  onReject: (leaveId: string) => void;
}

export const FacultyLeavesTab: React.FC<FacultyLeavesTabProps> = ({
  leaves,
  staff,
  onApprove,
  onReject
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            Faculty HR, Workload & Leave Sanctions
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Workload Compliance (18 Periods/Wk) • Mandatory Substitute Teacher Assignment
          </div>
        </div>
        <span className="badge badge-purple">
          {leaves.filter(l => l.status === 'pending').length} Action Items
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {leaves.map(leave => {
          const entity = TeacherLeaveEntity.fromJSON(leave);
          const badge = entity.getStatusBadge();
          const hasSubstitute = entity.hasSubstituteAssigned();

          return (
            <div key={leave.id} className="leave-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {leave.teacher_name}
                  </span>
                  <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                    {leave.department}
                  </span>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    {leave.leave_type} Leave ({leave.days_count} day(s))
                  </span>
                </div>
                <span className={`badge ${badge.badgeClass}`}>
                  {badge.label}
                </span>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Duration: <strong>{leave.start_date}</strong> to <strong>{leave.end_date}</strong>
                <br />
                Reason: <em>"{leave.reason}"</em>
              </div>

              {/* Substitute Assignment Box */}
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: hasSubstitute ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: hasSubstitute ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Designated Substitute Teacher:</span>{' '}
                  <strong style={{ color: hasSubstitute ? '#10b981' : '#f87171' }}>
                    {leave.substitute_teacher_name || 'Unassigned'}
                  </strong>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Will take periods 1, 3 in Class 10-A
                </span>
              </div>

              {/* Approval Actions */}
              {leave.status === 'pending' && (
                <div className="leave-actions-row">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onReject(leave.id)}
                    style={{ fontSize: '0.8rem', padding: '6px 14px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <XCircle size={14} /> Decline
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onApprove(leave.id)}
                    style={{ fontSize: '0.8rem', padding: '6px 16px', background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' }}
                  >
                    <CheckCircle2 size={14} /> Sanction Leave & Notify Substitute
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
