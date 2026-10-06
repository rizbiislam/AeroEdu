import React from 'react';
import type { StudentAcademicResult } from '../../types';
import { AcademicResultEntity } from '../../models/AcademicResultEntity';

interface TabulationSheetTableProps {
  results: StudentAcademicResult[];
  onSelectStudent: (studentId: string) => void;
}

export const TabulationSheetTable: React.FC<TabulationSheetTableProps> = ({
  results,
  onSelectStudent
}) => {
  return (
    <div className="tabulation-wrapper">
      <table className="tabulation-table">
        <thead>
          <tr>
            <th rowSpan={2} style={{ width: '60px' }}>Roll</th>
            <th rowSpan={2} style={{ textAlign: 'left', minWidth: '150px' }}>Student Name</th>
            <th colSpan={3}>Bangla (101)</th>
            <th colSpan={3}>English (107)</th>
            <th colSpan={3}>Math (109)</th>
            <th colSpan={4}>Physics (136)</th>
            <th colSpan={4}>Chemistry (137)</th>
            <th colSpan={4}>Biology (138)</th>
            <th colSpan={4}>Higher Math (126 - 4th)</th>
            <th rowSpan={2} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>Total</th>
            <th rowSpan={2} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>GPA</th>
            <th rowSpan={2}>Grade</th>
            <th rowSpan={2} style={{ width: '70px' }}>Rank</th>
            <th rowSpan={2}>Status</th>
          </tr>
          <tr className="tabulation-sub-header">
            {/* Bangla */}
            <th>CQ</th><th>MCQ</th><th>Tot</th>
            {/* English */}
            <th>CQ</th><th>MCQ</th><th>Tot</th>
            {/* Math */}
            <th>CQ</th><th>MCQ</th><th>Tot</th>
            {/* Physics */}
            <th>CQ</th><th>MCQ</th><th>PR</th><th>Tot</th>
            {/* Chem */}
            <th>CQ</th><th>MCQ</th><th>PR</th><th>Tot</th>
            {/* Bio */}
            <th>CQ</th><th>MCQ</th><th>PR</th><th>Tot</th>
            {/* Higher Math */}
            <th>CQ</th><th>MCQ</th><th>PR</th><th>Tot</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res) => {
            const entity = AcademicResultEntity.fromJSON(res);
            const isGolden = entity.isGoldenAPlus();

            const getSub = (code: string) => res.scores.find(s => s.subject_code === code);
            const ban = getSub('101');
            const eng = getSub('107');
            const math = getSub('109');
            const phy = getSub('136');
            const chem = getSub('137');
            const bio = getSub('138');
            const hm = getSub('126');

            return (
              <tr key={res.student_id} onClick={() => onSelectStudent(res.student_id)} style={{ cursor: 'pointer' }}>
                <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>#{res.roll_number}</td>
                <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                  {res.student_name}
                </td>

                {/* Bangla */}
                <td>{ban?.cq_marks}</td><td>{ban?.mcq_marks}</td><td style={{ fontWeight: 700 }}>{ban?.total_marks}</td>

                {/* English */}
                <td>{eng?.cq_marks}</td><td>{eng?.mcq_marks}</td><td style={{ fontWeight: 700 }}>{eng?.total_marks}</td>

                {/* Math */}
                <td>{math?.cq_marks}</td><td>{math?.mcq_marks}</td><td style={{ fontWeight: 700 }}>{math?.total_marks}</td>

                {/* Physics */}
                <td>{phy?.cq_marks}</td><td>{phy?.mcq_marks}</td><td>{phy?.pr_marks}</td><td style={{ fontWeight: 700 }}>{phy?.total_marks}</td>

                {/* Chem */}
                <td>{chem?.cq_marks}</td>
                <td style={{ color: chem && chem.mcq_marks < chem.mcq_pass ? '#ef4444' : 'inherit', fontWeight: chem && chem.mcq_marks < chem.mcq_pass ? 800 : 400 }}>
                  {chem?.mcq_marks}
                </td>
                <td>{chem?.pr_marks}</td>
                <td style={{ fontWeight: 700, color: chem && !chem.is_passed ? '#ef4444' : 'inherit' }}>{chem?.total_marks}</td>

                {/* Bio */}
                <td>{bio?.cq_marks}</td><td>{bio?.mcq_marks}</td><td>{bio?.pr_marks}</td><td style={{ fontWeight: 700 }}>{bio?.total_marks}</td>

                {/* Higher Math (4th) */}
                <td>{hm?.cq_marks}</td><td>{hm?.mcq_marks}</td><td>{hm?.pr_marks}</td><td style={{ fontWeight: 700, color: '#c084fc' }}>{hm?.total_marks}</td>

                {/* Totals */}
                <td style={{ fontWeight: 800, color: '#60a5fa' }}>{res.total_marks_obtained}</td>
                <td style={{ fontWeight: 800, color: res.gpa_with_optional === 5.0 ? '#10b981' : res.is_passed ? 'var(--text-main)' : '#ef4444', fontSize: '0.85rem' }}>
                  {res.gpa_with_optional.toFixed(2)}
                </td>
                <td>
                  <span className={`badge ${isGolden ? 'badge-purple' : res.is_passed ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>
                    {res.final_grade}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>#{res.merit_position}</td>
                <td>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: res.is_passed ? '#10b981' : '#ef4444' }}>
                    {res.is_passed ? 'PASS' : 'FAIL'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
