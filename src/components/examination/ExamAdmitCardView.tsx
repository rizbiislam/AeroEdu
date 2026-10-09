import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  Award,
  Printer,
  Download,
  Search,
  Maximize2,
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';
import { SecurityQRCode } from '../common/SecurityQRCode';
import { AdmitCardService } from '../../services/AdmitCardService';

export const ExamAdmitCardView: React.FC = () => {
  const { currentInstitute, students, admitCards, selectedAdmitCard, setSelectedAdmitCard, exams, role, showToast } = useApp();
  const [activeExamId] = useState('ex-ssc-2027');
  const [studentSearch, setStudentSearch] = useState('');
  const [viewMode, setViewMode] = useState<'admit_card_only' | 'batch_studio'>('admit_card_only');

  const isStudentOrGuardian = ['student', 'guardian'].includes(role);
  const isAdminOrController = ['super_admin', 'institute_admin', 'exam_controller'].includes(role);

  const exam = exams.find(e => e.id === activeExamId) || exams[0];

  // Selected student
  const activeStudentId = isStudentOrGuardian ? 'stu-001' : (selectedAdmitCard?.student_id || 'stu-001');
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];

  // Base admit card
  const baseCard = admitCards.find(c => c.student_id === currentStudent?.id) || admitCards[0] || {
    id: `adm-${currentStudent.id}`,
    exam_id: exam.id,
    exam_name: exam.name,
    student_id: currentStudent.id,
    student_name: currentStudent.full_name,
    student_name_bn: currentStudent.full_name_bn,
    roll_number: currentStudent.roll_number,
    registration_number: currentStudent.admission_no || '1910845620',
    class_name: currentStudent.class_name,
    section_name: currentStudent.section_name,
    exam_center: `${currentInstitute.name} (Center Code: 114)`,
    institute_name: currentInstitute.name,
    eiin: currentInstitute.eiin,
    generated_date: '2026-10-02',
    signatory_title: 'Controller of Examinations',
    schedules: [
      { subject_code: '101', subject_name: 'Bangla 1st Paper', exam_date: '15-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
      { subject_code: '107', subject_name: 'English 1st Paper', exam_date: '17-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
      { subject_code: '109', subject_name: 'General Mathematics', exam_date: '20-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
      { subject_code: '136', subject_name: 'Physics', exam_date: '23-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
      { subject_code: '137', subject_name: 'Chemistry', exam_date: '25-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
      { subject_code: '138', subject_name: 'Biology', exam_date: '27-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
      { subject_code: '126', subject_name: 'Higher Mathematics (4th Sub)', exam_date: '30-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' }
    ]
  };

  const fullSchedules = baseCard.schedules && baseCard.schedules.length >= 7 ? baseCard.schedules : [
    { subject_code: '101', subject_name: 'Bangla 1st Paper', exam_date: '15-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
    { subject_code: '107', subject_name: 'English 1st Paper', exam_date: '17-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
    { subject_code: '109', subject_name: 'General Mathematics', exam_date: '20-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
    { subject_code: '136', subject_name: 'Physics', exam_date: '23-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
    { subject_code: '137', subject_name: 'Chemistry', exam_date: '25-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
    { subject_code: '138', subject_name: 'Biology', exam_date: '27-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' },
    { subject_code: '126', subject_name: 'Higher Mathematics (4th Sub)', exam_date: '30-Nov-2026', exam_time: '10:00 AM - 01:00 PM', room_number: 'Hall 301 (Desk 12)' }
  ];

  const cardPayload = AdmitCardService.generateAdmitCardPayload(baseCard, currentInstitute, currentStudent);
  const examRules = AdmitCardService.getOfficialExamRules();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast(`Downloading official board admit card for ${currentStudent.full_name}...`, 'info');
    setTimeout(() => {
      showToast(`Admit card downloaded: admit_card_${currentStudent.roll_number}_bise_dhaka.pdf`, 'success');
    }, 1000);
  };

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.admission_no.toLowerCase().includes(studentSearch.toLowerCase()) ||
    String(s.roll_number).includes(studentSearch)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header Controls (Hidden on Print) */}
      <div className="card no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} style={{ color: '#a855f7' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {isStudentOrGuardian ? 'Official Board Admit Card' : 'Board Examination Admit Card Authority'}
            </h1>
            <span className="badge badge-purple">BISE Dhaka Standard</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {exam.name} • Certified with Government Center Code 114 • Scannable Cryptographic QR Seal
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {isAdminOrController && (
            <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setViewMode('admit_card_only')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: viewMode === 'admit_card_only' ? '#3b82f6' : 'transparent',
                  color: viewMode === 'admit_card_only' ? '#fff' : 'var(--text-muted)'
                }}
              >
                <Maximize2 size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Admit Card View
              </button>
              <button
                onClick={() => setViewMode('batch_studio')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: viewMode === 'batch_studio' ? '#3b82f6' : 'transparent',
                  color: viewMode === 'batch_studio' ? '#fff' : 'var(--text-muted)'
                }}
              >
                <LayoutGrid size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Candidate Batch Studio
              </button>
            </div>
          )}

          <button className="btn btn-secondary" onClick={handleDownloadPdf}>
            <Download size={15} /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
            <Printer size={15} /> Print Admit Card
          </button>
        </div>
      </div>

      {/* Main Layout Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: (!isStudentOrGuardian && viewMode === 'batch_studio') ? '320px 1fr' : '1fr',
        gap: '22px',
        alignItems: 'start'
      }}>
        {/* Left Column: Student Selector (Only shown in Batch Studio mode for Admins) */}
        {!isStudentOrGuardian && viewMode === 'batch_studio' && (
          <div className="card no-print">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Enrolled Candidates ({students.length})
              </span>
              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>All Issued</span>
            </div>

            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search by Roll or Name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
              {filteredStudents.map(stu => {
                const isSelected = stu.id === currentStudent.id;
                return (
                  <div
                    key={stu.id}
                    onClick={() => {
                      const found = admitCards.find(c => c.student_id === stu.id) || {
                        ...baseCard,
                        student_id: stu.id,
                        student_name: stu.full_name,
                        roll_number: stu.roll_number,
                        registration_number: stu.admission_no
                      };
                      setSelectedAdmitCard(found);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid #a855f7' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: isSelected ? '#c084fc' : 'var(--text-main)' }}>
                        {stu.full_name}
                      </span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                        Roll #{stu.roll_number}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Reg: {stu.admission_no} • Science Group
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right / Center Column: THE AUTHENTIC BOARD ADMIT CARD */}
        <div className="admit-card-container">
          {/* Subtle Authentic Board Watermark */}
          <div className="admit-card-watermark">
            BISE DHAKA OFFICIAL
          </div>

          <div className="admit-card-inner">
            {/* Header: Board & Institution Identity */}
            <div className="admit-card-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                <ShieldCheck size={18} style={{ color: '#1e3a8a' }} />
                <span className="admit-card-board-title">
                  BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, DHAKA
                </span>
              </div>
              <div className="admit-card-institute-title">
                {currentInstitute.name}
              </div>
              <div className="admit-card-institute-meta">
                EIIN: <strong>{currentInstitute.eiin}</strong> • Center Code: <strong>114 (Uttara Model Center)</strong> • School Code: <strong>1402</strong>
              </div>
              <div className="admit-card-badge">
                OFFICIAL ADMIT CARD — {exam.name.toUpperCase()}
              </div>
            </div>

            {/* Candidate Bio + Photo & QR Section */}
            <div className="admit-card-bio-grid">
              {/* Left Bio Table */}
              <table className="admit-card-bio-table">
                <tbody>
                  <tr>
                    <td className="admit-card-bio-label">Candidate Name:</td>
                    <td className="admit-card-bio-val" style={{ fontSize: '1.05rem', color: '#1e3a8a' }}>
                      {currentStudent.full_name.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td className="admit-card-bio-label">Father's Name:</td>
                    <td className="admit-card-bio-val">MOHAMMAD FARUK</td>
                  </tr>
                  <tr>
                    <td className="admit-card-bio-label">Mother's Name:</td>
                    <td className="admit-card-bio-val">RAHIMA BEGUM</td>
                  </tr>
                  <tr>
                    <td className="admit-card-bio-label">Board Roll Number:</td>
                    <td className="admit-card-bio-val" style={{ fontSize: '1rem', color: '#0f172a' }}>
                      {currentStudent.roll_number}
                    </td>
                  </tr>
                  <tr>
                    <td className="admit-card-bio-label">Registration No:</td>
                    <td className="admit-card-bio-val" style={{ fontFamily: 'monospace' }}>
                      {cardPayload.registration_number}
                    </td>
                  </tr>
                  <tr>
                    <td className="admit-card-bio-label">Class & Section:</td>
                    <td>{currentStudent.class_name} — {currentStudent.section_name}</td>
                  </tr>
                  <tr>
                    <td className="admit-card-bio-label">Session / Group:</td>
                    <td>2026-2027 • Science Group (English/Bangla Medium)</td>
                  </tr>
                </tbody>
              </table>

              {/* Right Column: Photo + Real Scannable 2D QR Code */}
              <div className="admit-card-photo-box">
                {/* Photo Frame */}
                <div className="admit-card-photo-frame">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=220&q=80"
                    alt={currentStudent.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Real Scannable QR Code */}
                <SecurityQRCode
                  value={cardPayload.verification_url}
                  size={95}
                  label="Scan to Verify"
                  subLabel="Anti-Tamper Board Seal"
                />
              </div>
            </div>

            {/* Subject Examination Timetable Table */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e293b' }}>
                  Prescribed Subject Examination Timetable:
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
                  Candidates must verify subject codes with registration
                </span>
              </div>

              <table className="admit-card-timetable">
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>Sub Code</th>
                    <th>Subject Name</th>
                    <th style={{ width: '110px' }}>Exam Date</th>
                    <th style={{ width: '150px' }}>Exam Time</th>
                    <th style={{ width: '140px' }}>Designated Hall</th>
                    <th style={{ width: '110px', textAlign: 'center' }}>Invigilator Initial</th>
                  </tr>
                </thead>
                <tbody>
                  {fullSchedules.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e3a8a' }}>{item.subject_code}</td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{item.subject_name}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{item.exam_date}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{item.exam_time}</td>
                      <td style={{ fontWeight: 600 }}>{item.room_number}</td>
                      <td style={{ textAlign: 'center', color: '#cbd5e1' }}>___________</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Board Examination Instructions */}
            <div className="admit-card-rules-box">
              <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '6px', color: '#0f172a' }}>
                Mandatory Statutory Examination Rules for the Candidate:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
                {examRules.map((rule, idx) => (
                  <div key={idx} style={{ fontSize: '0.68rem', color: '#475569', lineHeight: 1.35 }}>
                    {rule}
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures & Red Official Circular Seal */}
            <div className="admit-card-signatures">
              {/* Candidate Signature */}
              <div style={{ textAlign: 'center', width: '160px' }}>
                <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'cursive', fontSize: '0.95rem', color: '#0f172a' }}>Ahmed Sifat</span>
                </div>
                <div style={{ borderBottom: '1.5px solid #0f172a', marginBottom: '4px' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Candidate's Signature</div>
              </div>

              {/* Official Red Embossed Stamp */}
              <div className="admit-card-seal-stamp">
                BISE DHAKA<br />
                GOVT. SEAL<br />
                VERIFIED
              </div>

              {/* Controller of Examinations Signature */}
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'cursive', fontSize: '1.25rem', color: '#1e40af', fontWeight: 700 }}>
                    M. Rahman
                  </span>
                </div>
                <div style={{ borderBottom: '1.5px solid #0f172a', marginBottom: '4px' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Controller of Examinations</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>{cardPayload.digital_signature}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
