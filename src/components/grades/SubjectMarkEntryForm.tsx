import React from 'react';
import type { StudentAcademicResult, SubjectScore } from '../../types';
import { GradeCalculatorService } from '../../services/GradeCalculatorService';
import { Save } from 'lucide-react';

interface SubjectMarkEntryFormProps {
  results: StudentAcademicResult[];
  selectedSubjectCode: string;
  onSubjectChange: (code: string) => void;
  onUpdateScore: (studentId: string, subjectCode: string, field: 'cq' | 'mcq' | 'pr', val: number) => void;
  onSaveBatch: () => void;
}

export const SubjectMarkEntryForm: React.FC<SubjectMarkEntryFormProps> = ({
  results,
  selectedSubjectCode,
  onSubjectChange,
  onUpdateScore,
  onSaveBatch
}) => {
  const subjectsList = [
    { code: '101', name: 'Bangla 1st Paper', cqMax: 70, mcqMax: 30, prMax: 0, hasPr: false },
    { code: '107', name: 'English 1st Paper', cqMax: 100, mcqMax: 0, prMax: 0, hasPr: false },
    { code: '109', name: 'General Mathematics', cqMax: 70, mcqMax: 30, prMax: 0, hasPr: false },
    { code: '136', name: 'Physics', cqMax: 50, mcqMax: 25, prMax: 25, hasPr: true },
    { code: '137', name: 'Chemistry', cqMax: 50, mcqMax: 25, prMax: 25, hasPr: true },
    { code: '138', name: 'Biology', cqMax: 50, mcqMax: 25, prMax: 25, hasPr: true },
    { code: '126', name: 'Higher Mathematics (4th Subject)', cqMax: 50, mcqMax: 25, prMax: 25, hasPr: true }
  ];

  const currentSubject = subjectsList.find(s => s.code === selectedSubjectCode) || subjectsList[3];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Subject Selector Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Selected Course:
          </label>
          <select
            value={selectedSubjectCode}
            onChange={(e) => onSubjectChange(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {subjectsList.map(s => (
              <option key={s.code} value={s.code}>
                {s.code} — {s.name} ({s.hasPr ? 'CQ 50 + MCQ 25 + PR 25' : 'CQ 70 + MCQ 30'})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Passing Rule: <strong>CQ &ge; 33%, MCQ &ge; 33%, PR &ge; 33%</strong> separately.
          </span>
          <button className="btn btn-primary" onClick={onSaveBatch}>
            <Save size={15} /> Save & Sync Marks
          </button>
        </div>
      </div>

      {/* Marks Entry Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '2px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', width: '80px' }}>Roll</th>
              <th style={{ padding: '12px 16px' }}>Student Name</th>
              <th style={{ padding: '12px 16px', width: '120px' }}>CQ Marks ({currentSubject.cqMax})</th>
              {currentSubject.mcqMax > 0 && (
                <th style={{ padding: '12px 16px', width: '120px' }}>MCQ Marks ({currentSubject.mcqMax})</th>
              )}
              {currentSubject.hasPr && (
                <th style={{ padding: '12px 16px', width: '120px' }}>Practical ({currentSubject.prMax})</th>
              )}
              <th style={{ padding: '12px 16px', width: '90px', textAlign: 'center' }}>Total (100)</th>
              <th style={{ padding: '12px 16px', width: '80px', textAlign: 'center' }}>Grade</th>
              <th style={{ padding: '12px 16px', width: '70px', textAlign: 'center' }}>GP</th>
              <th style={{ padding: '12px 16px', width: '100px', textAlign: 'center' }}>Pass / Fail</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => {
              const score: SubjectScore = res.scores.find(s => s.subject_code === selectedSubjectCode) || {
                subject_code: selectedSubjectCode,
                subject_name: currentSubject.name,
                is_optional: selectedSubjectCode === '126',
                cq_marks: 0,
                cq_pass: Math.ceil(currentSubject.cqMax * 0.33),
                mcq_marks: 0,
                mcq_pass: Math.ceil(currentSubject.mcqMax * 0.33),
                pr_marks: 0,
                pr_pass: currentSubject.hasPr ? Math.ceil(currentSubject.prMax * 0.33) : undefined,
                total_marks: 0,
                letter_grade: 'F',
                grade_point: 0,
                is_passed: false
              };

              const cqPass = score.cq_marks >= score.cq_pass;
              const mcqPass = currentSubject.mcqMax > 0 ? score.mcq_marks >= score.mcq_pass : true;
              const prPass = currentSubject.hasPr && score.pr_pass ? (score.pr_marks || 0) >= score.pr_pass : true;
              const isAllPassed = cqPass && mcqPass && prPass;

              return (
                <tr key={res.student_id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontWeight: 700 }}>
                    #{res.roll_number}
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>
                    {res.student_name}
                  </td>
                  {/* CQ Input */}
                  <td style={{ padding: '8px 16px' }}>
                    <input
                      type="number"
                      min={0}
                      max={currentSubject.cqMax}
                      value={score.cq_marks}
                      onChange={(e) => onUpdateScore(res.student_id, selectedSubjectCode, 'cq', Math.min(currentSubject.cqMax, Math.max(0, Number(e.target.value))))}
                      className="mark-input"
                      style={{ borderColor: !cqPass ? '#ef4444' : undefined }}
                    />
                  </td>
                  {/* MCQ Input */}
                  {currentSubject.mcqMax > 0 && (
                    <td style={{ padding: '8px 16px' }}>
                      <input
                        type="number"
                        min={0}
                        max={currentSubject.mcqMax}
                        value={score.mcq_marks}
                        onChange={(e) => onUpdateScore(res.student_id, selectedSubjectCode, 'mcq', Math.min(currentSubject.mcqMax, Math.max(0, Number(e.target.value))))}
                        className="mark-input"
                        style={{ borderColor: !mcqPass ? '#ef4444' : undefined }}
                      />
                    </td>
                  )}
                  {/* Practical Input */}
                  {currentSubject.hasPr && (
                    <td style={{ padding: '8px 16px' }}>
                      <input
                        type="number"
                        min={0}
                        max={currentSubject.prMax}
                        value={score.pr_marks || 0}
                        onChange={(e) => onUpdateScore(res.student_id, selectedSubjectCode, 'pr', Math.min(currentSubject.prMax, Math.max(0, Number(e.target.value))))}
                        className="mark-input"
                        style={{ borderColor: !prPass ? '#ef4444' : undefined }}
                      />
                    </td>
                  )}
                  {/* Total */}
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                    {score.total_marks}
                  </td>
                  {/* Grade */}
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span className={`badge ${score.letter_grade === 'A+' ? 'badge-purple' : score.is_passed ? 'badge-green' : 'badge-red'}`}>
                      {score.letter_grade}
                    </span>
                  </td>
                  {/* GP */}
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700 }}>
                    {score.grade_point.toFixed(2)}
                  </td>
                  {/* Pass/Fail */}
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isAllPassed ? '#10b981' : '#ef4444' }}>
                      {isAllPassed ? 'PASS' : 'FAIL'}
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
