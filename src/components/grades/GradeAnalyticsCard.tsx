import React from 'react';
import type { StudentAcademicResult } from '../../types';

interface GradeAnalyticsCardProps {
  results: StudentAcademicResult[];
}

export const GradeAnalyticsCard: React.FC<GradeAnalyticsCardProps> = ({ results }) => {
  const total = results.length;
  const passed = results.filter(r => r.is_passed).length;
  const failed = total - passed;
  const goldenCount = results.filter(r => r.gpa_with_optional === 5.00).length;
  const aGradeCount = results.filter(r => r.gpa_with_optional >= 4.00 && r.gpa_with_optional < 5.00).length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
        {/* KPI: Overall Pass Rate */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            Board Pass Rate
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: passRate >= 80 ? '#10b981' : '#f59e0b' }}>
            {passRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {passed} Passed • {failed} Failed (Compulsory Retake)
          </div>
        </div>

        {/* GPA Breakdown */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>GPA Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'GPA 5.00 (Golden A+)', count: goldenCount, color: '#a855f7' },
              { label: 'GPA 4.00 - 4.99 (Grade A)', count: aGradeCount, color: '#3b82f6' },
              { label: 'GPA 0.00 (Failed MCQ / CQ)', count: failed, color: '#ef4444' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</span>
                <strong style={{ color: item.color, fontSize: '0.85rem' }}>{item.count} student(s)</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Pass Health */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>Subject-wise Pass Health</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { subject: 'Bangla 1st Paper (101)', pass: '100%', status: 'green' },
              { subject: 'English 1st Paper (107)', pass: '100%', status: 'green' },
              { subject: 'General Mathematics (109)', pass: '100%', status: 'green' },
              { subject: 'Physics (136)', pass: '100%', status: 'green' },
              { subject: 'Chemistry (137)', pass: '80% (1 MCQ Fail)', status: 'amber' },
              { subject: 'Biology (138)', pass: '100%', status: 'green' },
              { subject: 'Higher Mathematics (126 - 4th)', pass: '100%', status: 'green' }
            ].map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem' }}>{s.subject}</span>
                <span className={`badge badge-${s.status}`} style={{ fontSize: '0.7rem' }}>{s.pass}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
