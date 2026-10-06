import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Users,
  Save,
  Check,
  Eye,
  Send,
  AlertTriangle,
  Download,
  Bell,
  MessageSquare,
  X
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { students, attendanceRecords, updateAttendance, markAllPresent, showToast, role, currentInstitute } = useApp();
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('Section A (Padma)');
  const [attendanceDate, setAttendanceDate] = useState('2026-10-04');
  const [homeroomRemark, setHomeroomRemark] = useState('All students attended physics lecture and practicals. Lab equipment checked.');
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'roster' | 'analytics'>('roster');

  const isTeacher = ['class_teacher', 'teacher'].includes(role);
  const isAdmin = ['super_admin', 'institute_admin', 'academic_director'].includes(role);
  const isReadOnly = !isTeacher; // Strict enforcement: Class teachers take daily attendance

  const presentCount = Object.values(attendanceRecords).filter(s => s === 'present').length;
  const absentCount = Object.values(attendanceRecords).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendanceRecords).filter(s => s === 'late').length;
  const excusedCount = Object.values(attendanceRecords).filter(s => s === 'excused').length;
  const total = students.length;
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  // Absent students list
  const absentStudents = students.filter(s => attendanceRecords[s.id] === 'absent');

  const handleSaveBatch = () => {
    if (absentCount > 0) {
      setShowSmsModal(true);
    } else {
      showToast(`Daily register saved for ${selectedClass} - ${selectedSection}! 100% Attendance recorded.`, 'success');
    }
  };

  const handleConfirmSmsBlast = () => {
    setShowSmsModal(false);
    showToast(`Attendance saved! Dispatched SMS alerts to ${absentCount} absentee guardian(s) via Teletalk/GP Gateway.`, 'success');
  };

  const handleNudgeTeachers = () => {
    showToast('Push alert and reminder SMS dispatched to 2 teachers with pending daily registers!', 'info');
  };

  const handleExportCsv = () => {
    showToast('Exporting official monthly attendance register as CSV...', 'info');
    setTimeout(() => {
      showToast('Download complete: attendance_register_class10a_oct2026.csv', 'success');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarCheck size={24} style={{ color: '#22c55e' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {isTeacher ? 'Homeroom Daily Attendance Register' : isAdmin ? 'Institutional Attendance Oversight' : 'My Attendance Record'}
            </h1>
            <span className={`badge ${isTeacher ? 'badge-green' : 'badge-blue'}`}>
              {isTeacher ? 'Class Teacher Exclusive' : isAdmin ? 'Administrative Monitoring' : 'Student/Parent Portal'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {isTeacher
              ? `Homeroom: Class 10 — Section A (Padma) • Assigned Class Teacher: Fatema Begum • Direct Parent SMS Alert Integration`
              : isAdmin
              ? `Administrative oversight across all classes & sections • Real-time attendance submission audit and board eligibility`
              : `Your official attendance log for academic year ${currentInstitute.academic_year}`
            }
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isTeacher ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={markAllPresent}
                style={{ borderColor: 'rgba(34, 197, 94, 0.4)', color: '#22c55e' }}
              >
                <Check size={16} /> Mark All Present
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveBatch}
              >
                <Save size={16} /> Save Register & SMS
              </button>
            </>
          ) : isAdmin ? (
            <>
              <button className="btn btn-secondary" onClick={handleExportCsv}>
                <Download size={15} /> Export Register (CSV)
              </button>
              <button className="btn btn-secondary" onClick={handleNudgeTeachers} style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                <Bell size={15} /> Nudge Pending Teachers
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'var(--accent-primary-light)', color: '#4f8ff7', fontSize: '0.8rem', fontWeight: 600 }}>
              <Eye size={14} /> Official Verified Record
            </div>
          )}
        </div>
      </div>

      {/* Admin Tab Switcher if Admin */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveAdminTab('roster')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeAdminTab === 'roster' ? '#3b82f6' : 'var(--bg-surface)',
              color: activeAdminTab === 'roster' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Class Roster View
          </button>
          <button
            onClick={() => setActiveAdminTab('analytics')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeAdminTab === 'analytics' ? '#3b82f6' : 'var(--bg-surface)',
              color: activeAdminTab === 'analytics' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Institutional Daily Submission Audit
          </button>
        </div>
      )}

      {/* Admin Institutional Analytics View */}
      {isAdmin && activeAdminTab === 'analytics' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Section Submission Status Grid */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Daily Attendance Submission Audit — {attendanceDate}</span>
              <span className="badge badge-green">3 of 5 Sections Submitted</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {[
                { class: 'Class 10 - Section A', teacher: 'Fatema Begum', status: 'Submitted (08:32 AM)', rate: '96%', color: 'green', complete: true },
                { class: 'Class 10 - Section B', teacher: 'Tanvir Ahmed', status: 'Submitted (08:41 AM)', rate: '94%', color: 'green', complete: true },
                { class: 'Class 9 - Section A', teacher: 'Sadia Akhter', status: 'Submitted (08:28 AM)', rate: '98%', color: 'green', complete: true },
                { class: 'Class 9 - Section B', teacher: 'Kazi Nurul Islam', status: 'Pending Roll Call', rate: '—', color: 'amber', complete: false },
                { class: 'Class 11 - Science', teacher: 'Dr. Rafiqul Islam', status: 'Pending Roll Call', rate: '—', color: 'red', complete: false },
              ].map((sec, i) => (
                <div key={i} style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: `1px solid ${sec.complete ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{sec.class}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Teacher: <strong style={{ color: 'var(--text-main)' }}>{sec.teacher}</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: sec.complete ? '#22c55e' : '#f59e0b', fontWeight: 600, marginTop: '4px' }}>
                      {sec.status}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: sec.complete ? '#38bdf8' : 'var(--text-dim)' }}>
                      {sec.rate}
                    </div>
                    {!sec.complete && (
                      <button
                        onClick={handleNudgeTeachers}
                        style={{
                          marginTop: '6px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          color: '#f59e0b',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Nudge Teacher
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronic Absenteeism Board Alert */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <AlertTriangle size={20} style={{ color: '#ef4444' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#ef4444' }}>
                BISE Board Eligibility Risk: Chronic Absenteeism Warning
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0' }}>
              Students below 75% aggregate attendance risk being disqualified from registering for the SSC Board Examination under BISE Dhaka regulations.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {students.filter(s => s.attendance_percentage < 90).map(s => (
                <div key={s.id} style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.full_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Roll #{s.roll_number} • {s.class_name}</div>
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                    {s.attendance_percentage}% (Warning)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px'
          }}>
            {/* Class Filter */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Class & Section
              </div>
              {isAdmin ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '6px' }}
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                  </select>
                  <select
                    className="form-select"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '6px' }}
                  >
                    <option value="Section A (Padma)">Sec A (Padma)</option>
                    <option value="Section B (Meghna)">Sec B (Meghna)</option>
                  </select>
                </div>
              ) : (
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>
                  {selectedClass} — {selectedSection}
                </div>
              )}
            </div>

            {/* Date Filter */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Attendance Date
              </div>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f1f5f9',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Present Pill */}
            <div className="card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                Present
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
                {presentCount} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>({attendanceRate}%)</span>
              </div>
            </div>

            {/* Absent Pill */}
            <div className="card" style={{ padding: '16px', borderLeft: '4px solid #ef4444' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                Absent (SMS Trigger)
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171' }}>
                {absentCount}
              </div>
            </div>

            {/* Late Pill */}
            <div className="card" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                Late / Excused
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>
                {lateCount + excusedCount}
              </div>
            </div>
          </div>

          {/* Teacher Homeroom Remarks Field (for class teachers) */}
          {isTeacher && (
            <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageSquare size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Homeroom Teacher's Daily Log / Remarks
                </div>
                <input
                  type="text"
                  value={homeroomRemark}
                  onChange={(e) => setHomeroomRemark(e.target.value)}
                  placeholder="Note student sick leaves, lab attendances, conduct notes..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    marginTop: '2px'
                  }}
                />
              </div>
              <span className="badge badge-blue" style={{ fontSize: '0.68rem', flexShrink: 0 }}>
                Logged to Principal
              </span>
            </div>
          )}

          {/* Attendance Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ color: '#38bdf8' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  {selectedClass} — {selectedSection} Student Roll Call ({students.length})
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {isTeacher ? '1-Tap to switch status • Automatically staged for Parent SMS' : 'Read-only administrative view'}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Roll</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Student Name</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Guardian & Phone</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Historical %</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const currentStatus = attendanceRecords[student.id] || 'present';
                    return (
                      <tr 
                        key={student.id}
                        style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '14px 18px', fontWeight: 700, color: '#38bdf8' }}>
                          #{student.roll_number}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{student.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{student.admission_no} • {student.blood_group}</div>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ color: 'var(--text-muted)' }}>{student.guardian_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{student.guardian_phone}</div>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', background: 'var(--bg-surface)', borderRadius: '999px', overflow: 'hidden', minWidth: '60px' }}>
                              <div style={{
                                width: `${student.attendance_percentage}%`,
                                height: '100%',
                                backgroundColor: student.attendance_percentage >= 90 ? '#10b981' : '#f59e0b'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                              {student.attendance_percentage}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            {(['present', 'absent', 'late', 'excused'] as const).map((status) => {
                              const isActive = currentStatus === status;
                              const colorMap = { present: '#22c55e', absent: '#f43f5e', late: '#f59e0b', excused: '#4f8ff7' };
                              const labelMap = { present: 'Present', absent: 'Absent', late: 'Late', excused: 'Excused' };
                              return (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => !isReadOnly && updateAttendance(student.id, status)}
                                  disabled={isReadOnly}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: isReadOnly ? 'default' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    background: isActive ? colorMap[status] : 'transparent',
                                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                                    opacity: isReadOnly && !isActive ? 0.35 : 1
                                  }}
                                >
                                  {labelMap[status]}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Parent Absentee SMS Dispatch Confirmation Modal */}
      {showSmsModal && (
        <div className="modal-backdrop" onClick={() => setShowSmsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={20} style={{ color: '#f43f5e' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                  Automated Absentee Parent SMS Dispatch
                </h3>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
              You have marked <strong style={{ color: '#f43f5e' }}>{absentCount} student(s)</strong> absent today ({attendanceDate}). An immediate SMS notice will be delivered to their registered guardians.
            </p>

            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                SMS Broadcast Preview (Bengali + English)
              </div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.5, color: '#f1f5f9', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>
                [{currentInstitute.name}] সম্মানিত অভিভাবক, আপনার সন্তান আজ ({attendanceDate}) তারিখে ক্লাসে অনুপস্থিত রয়েছে। কোনো সমস্যা থাকলে শ্রেণিশিক্ষিকা ফাতেমা বেগুম (+880 1713-123456)-এর সাথে যোগাযোগ করুন।
              </div>
            </div>

            <div style={{ maxHeight: '140px', overflowY: 'auto', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Target Recipients ({absentStudents.length})
              </div>
              {absentStudents.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>Roll #{s.roll_number} {s.full_name} ({s.guardian_name})</span>
                  <strong style={{ color: '#38bdf8' }}>{s.guardian_phone}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowSmsModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmSmsBlast} style={{ background: '#f43f5e', borderColor: '#f43f5e' }}>
                <Send size={15} /> Confirm & Blast SMS ({absentCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
