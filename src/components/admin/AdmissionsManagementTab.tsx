import React from 'react';
import type { AdmissionApplication } from '../../types';
import { AdmissionApplicationEntity } from '../../models/AdmissionApplicationEntity';
import { CheckCircle2, XCircle, FileText, Award } from 'lucide-react';

interface AdmissionsManagementTabProps {
  admissions: AdmissionApplication[];
  onApprove: (appId: string) => void;
  onReject: (appId: string) => void;
  onScheduleInterview: (appId: string) => void;
}

export const AdmissionsManagementTab: React.FC<AdmissionsManagementTabProps> = ({
  admissions,
  onApprove,
  onReject,
  onScheduleInterview
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            Student Admissions & Intake Scrutiny Queue
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Academic Session 2026-27 • Class 9, 10 & 11 Admissions • Principal Executive Authorization
          </div>
        </div>
        <span className="badge badge-blue">
          {admissions.filter(a => a.status === 'pending' || a.status === 'interview_scheduled').length} Pending Scrutiny
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {admissions.map(app => {
          const entity = AdmissionApplicationEntity.fromJSON(app);
          const badge = entity.getStatusBadge();
          const isHighMerit = entity.isHighMerit();

          return (
            <div key={app.id} className="applicant-card">
              <div className="applicant-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="applicant-name">{app.applicant_name}</span>
                  {app.applicant_name_bn && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ({app.applicant_name_bn})
                    </span>
                  )}
                  {isHighMerit && (
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={12} /> High Merit Candidate
                    </span>
                  )}
                </div>
                <span className={`badge ${badge.badgeClass}`}>
                  {badge.label}
                </span>
              </div>

              <div className="applicant-meta-grid">
                <div>Target Class: <strong style={{ color: 'var(--text-main)' }}>{app.target_class} ({app.target_group})</strong></div>
                <div>Previous School: <strong>{app.previous_school}</strong></div>
                <div>Previous GPA: <strong style={{ color: isHighMerit ? '#a855f7' : '#38bdf8' }}>{app.previous_gpa.toFixed(2)}</strong></div>
                <div>Guardian: <strong>{app.guardian_name}</strong> ({app.phone})</div>
                <div>Submitted: <strong>{app.submission_date}</strong></div>
                <div>Fee Status: <strong style={{ color: app.application_fee_paid ? '#10b981' : '#f59e0b' }}>{app.application_fee_paid ? 'Paid ৳500 (bKash)' : 'Unpaid'}</strong></div>
              </div>

              {/* Actions */}
              {app.status === 'pending' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => onScheduleInterview(app.id)}
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    Schedule Interview
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => onReject(app.id)}
                    style={{ fontSize: '0.8rem', padding: '6px 14px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onApprove(app.id)}
                    style={{ fontSize: '0.8rem', padding: '6px 16px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                  >
                    <CheckCircle2 size={14} /> Approve & Enroll
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
