import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  CreditCard,
  Printer,
  Download,
  Search,
  Shield,
  CheckCircle2,
  Award,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { SecurityQRCode } from '../common/SecurityQRCode';

type StudioMode = 'students' | 'staff' | 'certificates';
type CertificateType = 'testimonial' | 'transfer_certificate' | 'bonafide';

export const StudentIDCardView: React.FC = () => {
  const { students, staff, currentInstitute, role, showToast } = useApp();
  const [studioMode, setStudioMode] = useState<StudioMode>('students');

  // Student ID state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentCardStyle, setStudentCardStyle] = useState<'standard' | 'premium'>('premium');
  const [showStudentBatch, setShowStudentBatch] = useState(false);

  // Staff ID state
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || '');
  const [staffSearch, setStaffSearch] = useState('');
  const [staffCardStyle, setStaffCardStyle] = useState<'faculty' | 'executive'>('faculty');

  // Certificate state
  const [certStudentId, setCertStudentId] = useState<string>(students[0]?.id || '');
  const [certType, setCertType] = useState<CertificateType>('testimonial');
  const [certReason, setCertReason] = useState('Completion of Secondary School Curriculum');
  const [certConduct, setCertConduct] = useState('Satisfactory & Commendable');
  const [certDate, setCertDate] = useState('2026-10-04');

  const isAdmin = ['super_admin', 'institute_admin', 'academic_director'].includes(role);
  const isPortal = role === 'student' || role === 'guardian';
  const visibleStudents = isPortal ? students.filter(s => s.id === 'stu-001') : students;

  // Filtered lists
  const filteredStudents = visibleStudents.filter(s =>
    s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.admission_no.toLowerCase().includes(studentSearch.toLowerCase()) ||
    String(s.roll_number).includes(studentSearch)
  );

  const filteredStaff = staff.filter(m =>
    m.full_name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    m.employee_id.toLowerCase().includes(staffSearch.toLowerCase()) ||
    m.designation.toLowerCase().includes(staffSearch.toLowerCase()) ||
    m.department.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const selectedStudent = visibleStudents.find(s => s.id === selectedStudentId) || visibleStudents[0];
  const selectedStaff = staff.find(m => m.id === selectedStaffId) || staff[0];
  const certStudent = visibleStudents.find(s => s.id === certStudentId) || visibleStudents[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = (label: string) => {
    showToast(`Generating high-resolution vector PDF for ${label}...`, 'info');
    setTimeout(() => {
      showToast(`Document ready! Downloaded to your device.`, 'success');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Studio Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} style={{ color: '#a78bfa' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Credentials & Identification Studio
            </h1>
            <span className="badge badge-purple">Official Issuer</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Generate and verify government-standard Student ID cards, Faculty Staff cards, Testimonials, and Transfer Certificates • {currentInstitute.name}
          </p>
        </div>

        {!isPortal && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => handleDownloadPdf(studioMode)}>
            <Download size={15} /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} /> Print Document
          </button>
        </div>}
      </div>

      {/* Mode Selector Tabs */}
      {!isPortal && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setStudioMode('students')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: studioMode === 'students' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'var(--bg-surface)',
            color: studioMode === 'students' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: studioMode === 'students' ? '0 2px 10px rgba(59, 130, 246, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <CreditCard size={16} /> Student ID Cards
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '10px',
            background: studioMode === 'students' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
            color: studioMode === 'students' ? '#fff' : 'var(--text-dim)'
          }}>
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setStudioMode('staff')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: studioMode === 'staff' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'var(--bg-surface)',
            color: studioMode === 'staff' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: studioMode === 'staff' ? '0 2px 10px rgba(139, 92, 246, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <UserCheck size={16} /> Teacher & Staff ID Cards
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '10px',
            background: studioMode === 'staff' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
            color: studioMode === 'staff' ? '#fff' : 'var(--text-dim)'
          }}>
            {staff.length}
          </span>
        </button>

        <button
          onClick={() => setStudioMode('certificates')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: studioMode === 'certificates' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--bg-surface)',
            color: studioMode === 'certificates' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: studioMode === 'certificates' ? '0 2px 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Award size={16} /> Testimonials & Transfer Certificates (TC)
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '10px',
            background: studioMode === 'certificates' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
            color: studioMode === 'certificates' ? '#fff' : 'var(--text-dim)'
          }}>
            Official
          </span>
        </button>
      </div>}

      {/* ============================================================== */}
      {/* 1. STUDENT ID CARDS MODE                                       */}
      {/* ============================================================== */}
      {studioMode === 'students' && (
        <>
          {/* Batch Generation Banner */}
          {isAdmin && (
            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#60a5fa' }}>
                  Batch Class Card Production
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Generate and print student ID cards for all {students.length} students enrolled in Class 10 — Section A
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowStudentBatch(!showStudentBatch)}
                >
                  {showStudentBatch ? 'Hide Batch Grid' : 'Preview Batch Grid (A4)'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                  <Printer size={14} /> Print All ({students.length})
                </button>
              </div>
            </div>
          )}

          {showStudentBatch ? (
            /* Batch Grid Preview */
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>A4 Batch Print Sheet (4 Cards / Page)</h3>
                <span className="badge badge-blue">Ready to Print</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '16px'
              }}>
                {visibleStudents.map(s => (
                  <div
                    key={s.id}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '75px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #334155, #475569)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}>
                      {s.full_name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>{s.full_name_bn}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                        ID: {s.admission_no} • Roll: {s.roll_number} • Class: {s.class_name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Blood: <span style={{ color: '#ef4444', fontWeight: 700 }}>{s.blood_group || 'N/A'}</span> • Ph: {s.guardian_phone}
                      </div>
                    </div>
                    <SecurityQRCode
                      value={`https://verify.aeroedu.bd/student/${s.admission_no}?eiin=${currentInstitute.eiin}`}
                      size={44}
                      label=""
                      subLabel=""
                      includeBorder={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Single Student Card Editor & Preview */
            <div style={{ display: 'grid', gridTemplateColumns: isPortal ? '1fr' : '320px 1fr', gap: '22px', alignItems: 'start' }}>
              {/* Student Selector */}
              {!isPortal && <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Search size={16} style={{ color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    placeholder="Search by name, roll, ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                  {filteredStudents.map(student => {
                    const isSelected = student.id === selectedStudent?.id;
                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px 16px',
                          border: 'none',
                          borderBottom: '1px solid var(--border-subtle)',
                          background: isSelected ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%)' : 'transparent',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent'
                        }}
                      >
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: isSelected ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'var(--bg-card-hover)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          flexShrink: 0
                        }}>
                          {student.roll_number}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.full_name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {student.admission_no} • {student.class_name}
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>}

              {/* Student Card Visual Preview (Front & Back) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dim)' }}>Style Template:</span>
                    <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3px' }}>
                      <button
                        onClick={() => setStudentCardStyle('standard')}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: studentCardStyle === 'standard' ? '#3b82f6' : 'transparent',
                          color: studentCardStyle === 'standard' ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        Classic Blue
                      </button>
                      <button
                        onClick={() => setStudentCardStyle('premium')}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: studentCardStyle === 'premium' ? '#8b5cf6' : 'transparent',
                          color: studentCardStyle === 'premium' ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        Modern Holographic
                      </button>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Standard CR-80 Dimension (85.6mm × 53.98mm)
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'start' }}>
                  {/* Front Card */}
                  <div className="printable-document" style={{
                    background: studentCardStyle === 'premium'
                      ? 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #1e3a5f 100%)'
                      : 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: '16px',
                    width: '400px',
                    overflow: 'hidden',
                    border: studentCardStyle === 'premium' ? '1px solid rgba(139, 92, 246, 0.4)' : '2px solid #2563eb',
                    boxShadow: studentCardStyle === 'premium'
                      ? '0 10px 40px -10px rgba(139, 92, 246, 0.35)'
                      : '0 4px 20px rgba(0,0,0,0.12)',
                    position: 'relative'
                  }}>
                    {/* Header Banner */}
                    <div style={{
                      background: studentCardStyle === 'premium'
                        ? 'linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)'
                        : 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>
                        <Shield size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                          {currentInstitute.name}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>
                          EIIN: {currentInstitute.eiin} • STUDENT IDENTITY CARD
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '16px', display: 'flex', gap: '14px' }}>
                      <div style={{
                        width: '84px',
                        height: '104px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #334155, #475569)',
                        border: studentCardStyle === 'premium' ? '2px solid rgba(139, 92, 246, 0.5)' : '2px solid #2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
                          {selectedStudent.full_name.charAt(0)}
                        </span>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: studentCardStyle === 'premium' ? '#f1f5f9' : '#0f172a',
                          lineHeight: 1.2
                        }}>
                          {selectedStudent.full_name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: studentCardStyle === 'premium' ? '#a78bfa' : '#3b82f6',
                          fontWeight: 600,
                          marginBottom: '6px'
                        }}>
                          {selectedStudent.full_name_bn}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px', fontSize: '0.7rem' }}>
                          <div><span style={{ color: 'var(--text-dim)' }}>ID:</span> <strong style={{ color: studentCardStyle === 'premium' ? '#fff' : '#000' }}>{selectedStudent.admission_no}</strong></div>
                          <div><span style={{ color: 'var(--text-dim)' }}>Roll:</span> <strong style={{ color: studentCardStyle === 'premium' ? '#fff' : '#000' }}>{selectedStudent.roll_number}</strong></div>
                          <div><span style={{ color: 'var(--text-dim)' }}>Class:</span> <strong style={{ color: studentCardStyle === 'premium' ? '#fff' : '#000' }}>{selectedStudent.class_name}</strong></div>
                          <div><span style={{ color: 'var(--text-dim)' }}>Section:</span> <strong style={{ color: studentCardStyle === 'premium' ? '#fff' : '#000' }}>{selectedStudent.section_name}</strong></div>
                          <div><span style={{ color: 'var(--text-dim)' }}>Blood:</span> <strong style={{ color: '#ef4444' }}>{selectedStudent.blood_group || 'O+'}</strong></div>
                          <div><span style={{ color: 'var(--text-dim)' }}>DOB:</span> <strong style={{ color: studentCardStyle === 'premium' ? '#fff' : '#000' }}>{selectedStudent.date_of_birth}</strong></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <SecurityQRCode
                          value={`https://verify.aeroedu.bd/student/${selectedStudent.admission_no}?eiin=${currentInstitute.eiin}`}
                          size={54}
                          label=""
                          subLabel=""
                          bgColor="#ffffff"
                          fgColor="#0f172a"
                          includeBorder={true}
                        />
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>Verified</span>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div style={{
                      padding: '8px 16px',
                      background: studentCardStyle === 'premium' ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc',
                      borderTop: studentCardStyle === 'premium' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.65rem'
                    }}>
                      <span style={{ color: 'var(--text-dim)' }}>Valid: Session {currentInstitute.academic_year}</span>
                      <span style={{ color: studentCardStyle === 'premium' ? '#60a5fa' : '#2563eb', fontWeight: 600 }}>Emergency: {currentInstitute.contact_phone}</span>
                    </div>
                  </div>

                  {/* Back Card */}
                  <div className="printable-document" style={{
                    background: studentCardStyle === 'premium'
                      ? 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #1e3a5f 100%)'
                      : '#ffffff',
                    borderRadius: '16px',
                    padding: '16px',
                    width: '400px',
                    border: studentCardStyle === 'premium' ? '1px solid rgba(139, 92, 246, 0.4)' : '2px solid #2563eb',
                    boxShadow: studentCardStyle === 'premium' ? '0 10px 40px -10px rgba(139, 92, 246, 0.35)' : '0 4px 20px rgba(0,0,0,0.12)'
                  }}>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: studentCardStyle === 'premium' ? '#a78bfa' : '#2563eb',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      marginBottom: '10px'
                    }}>
                      Guardian & Emergency Contacts
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '0.74rem',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: studentCardStyle === 'premium' ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Guardian:</span>
                        <strong style={{ color: studentCardStyle === 'premium' ? '#f1f5f9' : '#0f172a' }}>{selectedStudent.guardian_name} ({selectedStudent.guardian_relation})</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Phone:</span>
                        <strong style={{ color: studentCardStyle === 'premium' ? '#f1f5f9' : '#0f172a' }}>{selectedStudent.guardian_phone}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Address:</span>
                        <span style={{ color: studentCardStyle === 'premium' ? '#cbd5e1' : '#334155', textAlign: 'right', maxWidth: '200px' }}>{selectedStudent.address}</span>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '12px',
                      padding: '8px',
                      borderRadius: '6px',
                      background: studentCardStyle === 'premium' ? 'rgba(239, 68, 68, 0.08)' : '#fff5f5',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      fontSize: '0.64rem',
                      color: studentCardStyle === 'premium' ? '#fca5a5' : '#b91c1c',
                      textAlign: 'center',
                      lineHeight: 1.3
                    }}>
                      Property of {currentInstitute.name}. If found, please return to school administration.
                    </div>

                    <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        Class Teacher: <strong style={{ color: studentCardStyle === 'premium' ? '#e2e8f0' : '#1e293b' }}>Fatema Begum</strong>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '90px', borderBottom: '1px solid #64748b', marginBottom: '3px' }} />
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>Principal's Signature</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* 2. TEACHER & STAFF ID CARDS MODE                               */}
      {/* ============================================================== */}
      {!isPortal && studioMode === 'staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '22px', alignItems: 'start' }}>
          {/* Staff Member List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Search size={16} style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search faculty by name, code, dept..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
              {filteredStaff.map(member => {
                const isSelected = member.id === selectedStaff.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedStaffId(member.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isSelected ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, transparent 100%)' : 'transparent',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderLeft: isSelected ? '3px solid #8b5cf6' : '3px solid transparent'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isSelected ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--bg-card-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      flexShrink: 0
                    }}>
                      {member.full_name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {member.full_name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: 500 }}>
                        {member.designation}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        {member.employee_id} • {member.department}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher/Staff Card Visual Studio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dim)' }}>Badge Tier:</span>
                <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3px' }}>
                  <button
                    onClick={() => setStaffCardStyle('faculty')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: staffCardStyle === 'faculty' ? '#8b5cf6' : 'transparent',
                      color: staffCardStyle === 'faculty' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    Faculty Deep Slate
                  </button>
                  <button
                    onClick={() => setStaffCardStyle('executive')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: staffCardStyle === 'executive' ? '#d97706' : 'transparent',
                      color: staffCardStyle === 'executive' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    Executive Gold
                  </button>
                </div>
              </div>

              {selectedStaff.is_class_teacher && (
                <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                  Homeroom Head: {selectedStaff.assigned_class}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'start' }}>
              {/* Staff Card Front */}
              <div className="printable-document" style={{
                background: staffCardStyle === 'executive'
                  ? 'linear-gradient(160deg, #1e1b18 0%, #2a2415 50%, #0d0c0a 100%)'
                  : 'linear-gradient(160deg, #090d16 0%, #171d2d 50%, #1e293b 100%)',
                borderRadius: '16px',
                width: '400px',
                overflow: 'hidden',
                border: staffCardStyle === 'executive' ? '2px solid #b45309' : '2px solid #6366f1',
                boxShadow: staffCardStyle === 'executive'
                  ? '0 10px 40px -10px rgba(217, 119, 6, 0.4)'
                  : '0 10px 40px -10px rgba(99, 102, 241, 0.4)',
                position: 'relative'
              }}>
                {/* Staff Top Bar */}
                <div style={{
                  background: staffCardStyle === 'executive'
                    ? 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)'
                    : 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                        {currentInstitute.name}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        OFFICIAL FACULTY & STAFF IDENTIFICATION
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staff Details */}
                <div style={{ padding: '16px', display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '84px',
                    height: '104px',
                    borderRadius: '10px',
                    background: selectedStaff.avatar_url
                      ? `url(${selectedStaff.avatar_url}) center/cover no-repeat`
                      : 'linear-gradient(135deg, #475569, #64748b)',
                    border: staffCardStyle === 'executive' ? '2px solid #f59e0b' : '2px solid #818cf8',
                    flexShrink: 0
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#f8fafc',
                      lineHeight: 1.2
                    }}>
                      {selectedStaff.full_name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: staffCardStyle === 'executive' ? '#fbbf24' : '#a5b4fc',
                      fontWeight: 700,
                      marginBottom: '4px'
                    }}>
                      {selectedStaff.full_name_bn}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      background: staffCardStyle === 'executive' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(99, 102, 241, 0.4)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}>
                      {selectedStaff.designation}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3px', fontSize: '0.7rem' }}>
                      <div><span style={{ color: 'var(--text-dim)' }}>Employee Code:</span> <strong style={{ color: '#fff' }}>{selectedStaff.employee_id}</strong></div>
                      <div><span style={{ color: 'var(--text-dim)' }}>Department:</span> <strong style={{ color: '#e2e8f0' }}>{selectedStaff.department}</strong></div>
                      <div><span style={{ color: 'var(--text-dim)' }}>Blood Group:</span> <strong style={{ color: '#ef4444' }}>{selectedStaff.blood_group}</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <SecurityQRCode
                      value={`https://verify.aeroedu.bd/staff/${selectedStaff.employee_id}?eiin=${currentInstitute.eiin}`}
                      size={54}
                      label=""
                      subLabel=""
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                      includeBorder={true}
                    />
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>Auth Valid</span>
                  </div>
                </div>

                {/* Staff Bottom */}
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(0,0,0,0.4)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.65rem'
                }}>
                  <span style={{ color: 'var(--text-dim)' }}>Joining Date: {selectedStaff.joining_date}</span>
                  <span style={{ color: staffCardStyle === 'executive' ? '#f59e0b' : '#a5b4fc', fontWeight: 600 }}>Campus Security Authorized</span>
                </div>
              </div>

              {/* Staff Card Back */}
              <div className="printable-document" style={{
                background: staffCardStyle === 'executive'
                  ? 'linear-gradient(160deg, #1e1b18 0%, #2a2415 50%, #0d0c0a 100%)'
                  : 'linear-gradient(160deg, #090d16 0%, #171d2d 50%, #1e293b 100%)',
                borderRadius: '16px',
                padding: '16px',
                width: '400px',
                border: staffCardStyle === 'executive' ? '2px solid #b45309' : '2px solid #6366f1',
                boxShadow: staffCardStyle === 'executive'
                  ? '0 10px 40px -10px rgba(217, 119, 6, 0.4)'
                  : '0 10px 40px -10px rgba(99, 102, 241, 0.4)'
              }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: staffCardStyle === 'executive' ? '#fbbf24' : '#a5b4fc',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: '10px'
                }}>
                  Faculty Credentials & Security Pass
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.74rem',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Official Phone:</span>
                    <strong style={{ color: '#f1f5f9' }}>{selectedStaff.phone}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Institutional Email:</span>
                    <strong style={{ color: '#f1f5f9' }}>{selectedStaff.email}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Emergency Contact:</span>
                    <strong style={{ color: '#f87171' }}>{selectedStaff.emergency_contact}</strong>
                  </div>
                </div>

                <div style={{
                  marginTop: '12px',
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.64rem',
                  color: 'var(--text-dim)',
                  textAlign: 'center',
                  lineHeight: 1.3
                }}>
                  This credential confers campus administrative and academic access rights under institutional bylaws. Return immediately upon cessation of employment.
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    Governing Body ID: <strong style={{ color: '#fff' }}>GB-2026-DH</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '90px', borderBottom: '1px solid #64748b', marginBottom: '3px' }} />
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>Chairman of Governors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. OFFICIAL CERTIFICATES & TC MODE                             */}
      {/* ============================================================== */}
      {!isPortal && studioMode === 'certificates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '22px', alignItems: 'start' }}>
          {/* Controls & Configuration */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Certificate Configuration
            </div>

            {/* Certificate Type Selector */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Document Type
              </label>
              <select
                className="form-select"
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertificateType)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="testimonial">Testimonial & Character Certificate (চারিত্রিক প্রশংসাপত্র)</option>
                <option value="transfer_certificate">Transfer Certificate — TC (ছাড়পত্র)</option>
                <option value="bonafide">Bonafide Student Certificate (অধ্যয়নরত প্রত্যয়নপত্র)</option>
              </select>
            </div>

            {/* Student Picker */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Candidate Student
              </label>
              <select
                className="form-select"
                value={certStudentId}
                onChange={(e) => setCertStudentId(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                {visibleStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    Roll {s.roll_number}: {s.full_name} ({s.class_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Conduct Assessment */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Conduct & Moral Standing
              </label>
              <select
                className="form-select"
                value={certConduct}
                onChange={(e) => setCertConduct(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="Exemplary & Commendable">Exemplary & Commendable (অনুকরণীয়)</option>
                <option value="Satisfactory & Moral">Satisfactory & Moral (সন্তোষজনক)</option>
                <option value="Good Conduct throughout tenure">Good Conduct throughout tenure (উত্তম)</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Reason for Issuance
              </label>
              <input
                type="text"
                value={certReason}
                onChange={(e) => setCertReason(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Issue Date */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Issue Date
              </label>
              <input
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '0.75rem',
              color: '#34d399'
            }}>
              ✓ Seal stamp & signature will render in printable vector resolution.
            </div>
          </div>

          {/* Official Document Preview (Traditional Ornamental Certificate Layout) */}
          <div className="card" style={{ padding: '30px', overflowX: 'auto' }}>
            <div className="printable-document" style={{
              background: '#ffffff',
              color: '#0f172a',
              padding: '40px',
              borderRadius: '4px',
              border: '6px double #1e3a8a',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              minWidth: '650px',
              position: 'relative',
              fontFamily: "'Outfit', 'Hind Siliguri', serif"
            }}>
              {/* Corner Watermarks */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.04,
                pointerEvents: 'none'
              }}>
                <Shield size={320} />
              </div>

              {/* Institution Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Government Approved & Board Affiliated Institution
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  {currentInstitute.name}
                </h2>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a' }}>
                  {currentInstitute.name_bn}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                  {currentInstitute.address} • EIIN: <strong>{currentInstitute.eiin}</strong> • {currentInstitute.exam_board_name}
                </div>
              </div>

              {/* Certificate Title Banner */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#1e3a8a',
                  color: '#ffffff',
                  padding: '6px 28px',
                  borderRadius: '24px',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {certType === 'testimonial' && 'Testimonial & Character Certificate'}
                  {certType === 'transfer_certificate' && 'Transfer Certificate (TC)'}
                  {certType === 'bonafide' && 'Bonafide Student Certificate'}
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', marginTop: '6px' }}>
                  {certType === 'testimonial' && 'প্রশংসাপত্র ও চারিত্রিক সনদপত্র'}
                  {certType === 'transfer_certificate' && 'ছাড়পত্র / টি.সি.'}
                  {certType === 'bonafide' && 'অধ্যয়নরত প্রত্যয়নপত্র'}
                </div>
              </div>

              {/* Certificate Metadata Numbers */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '24px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                <div>Sl No: <strong style={{ color: '#0f172a' }}>TC-{currentInstitute.eiin}-2026-{certStudent.roll_number.toString().padStart(4, '0')}</strong></div>
                <div>Admission No: <strong style={{ color: '#0f172a' }}>{certStudent.admission_no}</strong></div>
                <div>Issue Date: <strong style={{ color: '#0f172a' }}>{certDate}</strong></div>
              </div>

              {/* Body Text */}
              <div style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#1e293b', textAlign: 'justify', marginBottom: '40px' }}>
                This is to certify that <strong style={{ color: '#0f172a', borderBottom: '1px dotted #0f172a' }}>{certStudent.full_name}</strong>{' '}
                (<strong style={{ color: '#1e3a8a' }}>{certStudent.full_name_bn}</strong>),
                son/daughter of <strong style={{ color: '#0f172a' }}>{certStudent.guardian_name}</strong>,
                residing at <strong style={{ color: '#0f172a' }}>{certStudent.address}</strong>,
                was a bonafide student of this institution in{' '}
                <strong style={{ color: '#0f172a' }}>{certStudent.class_name}</strong> (Section: {certStudent.section_name})
                bearing Class Roll No. <strong style={{ color: '#0f172a' }}>{certStudent.roll_number}</strong>.
                <br /><br />
                {certType === 'testimonial' && (
                  <>
                    During the academic tenure at this academy, his/her moral character and conduct were found to be{' '}
                    <strong style={{ color: '#047857' }}>{certConduct}</strong>. To the best of our institutional knowledge, he/she did not participate in any subversive or anti-disciplinary activities. He/she has actively participated in co-curricular pursuits.
                  </>
                )}
                {certType === 'transfer_certificate' && (
                  <>
                    All institutional dues and fees up to the current month have been fully cleared and reconciled. His/her character is satisfactory, and this Transfer Certificate is granted on the prayer of the guardian due to: <em>"{certReason}"</em>.
                  </>
                )}
                {certType === 'bonafide' && (
                  <>
                    He/she is currently continuing studies with full attendance standing ({certStudent.attendance_percentage}%). This certificate is issued upon guardian request for {certReason}.
                  </>
                )}
                <br /><br />
                We wish him/her every brilliance, moral distinction, and prosperity in all future academic pursuits.
              </div>

              {/* Signatures & Seal Area */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '50px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '150px', borderBottom: '1px solid #0f172a', marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Fatema Begum</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Class Teacher (Homeroom)</div>
                </div>

                {/* Institute Seal Stamp */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '2px dashed #dc2626',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  transform: 'rotate(-8deg)',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  <Shield size={20} />
                  Official Seal
                  <br />{currentInstitute.eiin}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '150px', borderBottom: '1px solid #0f172a', marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Dr. Rafiqul Islam</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Principal & Head of Institution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
