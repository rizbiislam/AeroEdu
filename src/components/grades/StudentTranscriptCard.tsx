import React from 'react';
import type { StudentAcademicResult, Institute } from '../../types';
import { SecurityQRCode } from '../common/SecurityQRCode';

interface StudentTranscriptCardProps {
  result: StudentAcademicResult;
  institute: Institute;
}

export const StudentTranscriptCard: React.FC<StudentTranscriptCardProps> = ({
  result,
  institute
}) => {
  return (
    <div className="transcript-card-container">
      {/* Background Watermark */}
      <div className="transcript-watermark">
        BISE DHAKA OFFICIAL
      </div>

      <div className="transcript-inner">
        {/* Header */}
        <div className="transcript-header">
          <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569' }}>
            BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, DHAKA
          </div>
          <div className="transcript-title">
            {institute.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            EIIN: <strong>{institute.eiin}</strong> • Center: <strong>114 (Uttara Model Center)</strong> • Affiliation Code: <strong>1402</strong>
          </div>
          <div className="transcript-badge">
            ACADEMIC TRANSCRIPT & PROGRESS REPORT — SSC MODEL TEST 2027
          </div>
        </div>

        {/* Student Profile Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: '20px', fontSize: '0.875rem' }}>
          <div>Candidate Name: <strong style={{ color: '#1e3a8a', fontSize: '1rem' }}>{result.student_name.toUpperCase()}</strong></div>
          <div>Board Roll Number: <strong style={{ fontFamily: 'monospace' }}>#{result.roll_number}</strong></div>
          <div>Class & Section: <strong>{result.class_name} — {result.section_name}</strong></div>
          <div>Academic Session: <strong>2026-2027 (Science Group)</strong></div>
          <div>Registration No: <strong style={{ fontFamily: 'monospace' }}>1910845620</strong></div>
          <div>Curriculum Medium: <strong>National Curriculum (English / Bengali Version)</strong></div>
        </div>

        {/* Scores Table */}
        <table className="transcript-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Subject Code</th>
              <th style={{ textAlign: 'left' }}>Subject Name</th>
              <th style={{ width: '60px' }}>CQ (50/70)</th>
              <th style={{ width: '60px' }}>MCQ (25/30)</th>
              <th style={{ width: '60px' }}>Practical</th>
              <th style={{ width: '70px' }}>Total (100)</th>
              <th style={{ width: '70px' }}>Letter Grade</th>
              <th style={{ width: '60px' }}>Grade Point</th>
            </tr>
          </thead>
          <tbody>
            {result.scores.map((sc) => (
              <tr key={sc.subject_code}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{sc.subject_code}</td>
                <td style={{ textAlign: 'left', fontWeight: 600 }}>
                  {sc.subject_name} {sc.is_optional && <span style={{ color: '#a855f7', fontSize: '0.72rem' }}>(4th Optional Subject)</span>}
                </td>
                <td>{sc.cq_marks}</td>
                <td>{sc.mcq_marks}</td>
                <td>{sc.pr_marks !== undefined ? sc.pr_marks : '—'}</td>
                <td style={{ fontWeight: 800 }}>{sc.total_marks}</td>
                <td>
                  <span className={`badge ${sc.letter_grade === 'A+' ? 'badge-purple' : sc.is_passed ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                    {sc.letter_grade}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{sc.grade_point.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '16px',
          padding: '16px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.7 }}>
              Total Marks Obtained: <strong>{result.total_marks_obtained}</strong> / {result.total_max_marks}
              <br />
              GPA (Without 4th Subject): <strong>{result.gpa_without_optional.toFixed(2)}</strong>
              <br />
              Final Cumulative GPA (With 4th Sub): <strong style={{ color: '#1e3a8a', fontSize: '1.15rem' }}>{result.gpa_with_optional.toFixed(2)}</strong>
              <br />
              Academic Standing:{' '}
              <strong style={{ color: result.is_passed ? '#047857' : '#dc2626' }}>
                {result.is_passed ? result.final_grade : 'FAILED (COMPULSORY RETAKE)'}
              </strong>
              <br />
              Class Merit Position: <strong>Rank #{result.merit_position}</strong>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', lineHeight: 1.6, borderLeft: '1px solid #cbd5e1', paddingLeft: '16px' }}>
            <div>Attendance Record: <strong>{result.attendance_percentage}%</strong> (Eligible)</div>
            <div>Conduct & Moral Evaluation: <strong>{result.conduct_rating}</strong></div>
            <div style={{ marginTop: '6px', fontStyle: 'italic', color: '#475569' }}>
              Homeroom Remarks: "{result.teacher_remarks}"
            </div>
          </div>
        </div>

        {/* Triple Signatures and Real Security QR Code */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ textAlign: 'center', width: '140px' }}>
            <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'cursive', fontSize: '1rem', color: '#0f172a' }}>Fatema Begum</span>
            </div>
            <div style={{ borderBottom: '1.5px solid #0f172a', marginBottom: '4px' }} />
            <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>Class Teacher (Homeroom)</div>
          </div>

          <div style={{ textAlign: 'center', width: '150px' }}>
            <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'cursive', fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 700 }}>M. Rahman</span>
            </div>
            <div style={{ borderBottom: '1.5px solid #0f172a', marginBottom: '4px' }} />
            <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>Controller of Examinations</div>
          </div>

          {/* Real Scannable 2D QR Code */}
          <SecurityQRCode
            value={`https://verify.aeroedu.bd/transcript/${result.student_id}?eiin=${institute.eiin}&gpa=${result.gpa_with_optional}`}
            size={80}
            label="Transcript QR Seal"
            subLabel="Anti-Tamper Record"
          />

          <div style={{ textAlign: 'center', width: '150px' }}>
            <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'cursive', fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 700 }}>Dr. R. Islam</span>
            </div>
            <div style={{ borderBottom: '1.5px solid #0f172a', marginBottom: '4px' }} />
            <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>Principal & Head of Institution</div>
          </div>
        </div>
      </div>
    </div>
  );
};
