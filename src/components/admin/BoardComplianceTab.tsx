import React from 'react';
import type { BoardComplianceRecord } from '../../types';
import { ShieldCheck, AlertTriangle, Download } from 'lucide-react';

interface BoardComplianceTabProps {
  complianceRecords: BoardComplianceRecord[];
  onExportReport: () => void;
}

export const BoardComplianceTab: React.FC<BoardComplianceTabProps> = ({
  complianceRecords,
  onExportReport
}) => {
  const atRiskCount = complianceRecords.filter(r => !r.is_eligible_for_board).length;
  const eligibleCount = complianceRecords.length - atRiskCount;
  const complianceRate = complianceRecords.length > 0 ? Math.round((eligibleCount / complianceRecords.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            BISE Dhaka Statutory Board Compliance Audit
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            SSC Board Form Fill-up Regulations: Attendance &ge; 75% AND All Pre-Test Subjects Passed
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            Compliance Rate: {complianceRate}%
          </span>
          <button className="btn btn-secondary" onClick={onExportReport}>
            <Download size={14} /> Export BISE Audit File
          </button>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="compliance-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Roll</th>
              <th>Student Candidate</th>
              <th>Attendance %</th>
              <th style={{ textAlign: 'center' }}>Pre-Test Result</th>
              <th style={{ textAlign: 'center' }}>Failed Subjects</th>
              <th style={{ textAlign: 'center' }}>Board Status</th>
              <th>Action / Penalty Flag</th>
            </tr>
          </thead>
          <tbody>
            {complianceRecords.map(rec => {
              const isEligible = rec.is_eligible_for_board;
              const hasAttendanceIssue = rec.attendance_percentage < 75;

              return (
                <tr key={rec.student_id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>#{rec.roll_number}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{rec.student_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Reg: {rec.registration_number || '2025-001402'} • {rec.class_name}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: hasAttendanceIssue ? '#ef4444' : '#10b981' }}>
                      {rec.attendance_percentage}%
                    </div>
                    <div className="compliance-meter-track">
                      <div
                        className="compliance-meter-fill"
                        style={{
                          width: `${rec.attendance_percentage}%`,
                          backgroundColor: hasAttendanceIssue ? '#ef4444' : '#10b981'
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${rec.pre_test_passed ? 'badge-green' : 'badge-red'}`}>
                      {rec.pre_test_passed ? 'Passed All' : 'Failed'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: rec.failed_subjects.length > 0 ? '#ef4444' : 'var(--text-dim)' }}>
                    {rec.failed_subjects.length > 0 ? rec.failed_subjects.join(', ') : 'None'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${isEligible ? 'badge-green' : 'badge-red'}`} style={{ fontWeight: 800 }}>
                      {isEligible ? 'ELIGIBLE' : 'DISQUALIFIED'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: isEligible ? '#10b981' : '#f87171' }}>
                      {rec.recommended_action}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
