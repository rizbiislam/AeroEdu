import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  Edit3,
  Copy,
  Printer,
  Sparkles,
  X
} from 'lucide-react';
import type { RoutineItem } from '../../types';

const DAYS: RoutineItem['day_of_week'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const TIME_SLOTS = [
  { period: 1, start: '08:00 AM', end: '08:45 AM' },
  { period: 2, start: '08:50 AM', end: '09:35 AM' },
  { period: 3, start: '09:40 AM', end: '10:25 AM' },
  { period: 4, start: '10:45 AM', end: '11:30 AM' },
  { period: 5, start: '11:35 AM', end: '12:20 PM' },
  { period: 6, start: '12:25 PM', end: '01:10 PM' },
];

const SUBJECT_COLORS: Record<string, string> = {
  'General Mathematics': '#3b82f6',
  'Physics': '#8b5cf6',
  'Chemistry': '#06b6d4',
  'Biology': '#10b981',
  'Bangla 1st Paper': '#f59e0b',
  'English 1st Paper': '#ef4444',
  'Information & Communication Tech': '#ec4899',
};

export const ClassRoutineView: React.FC = () => {
  const { routine, role, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [teacherScheduleMode, setTeacherScheduleMode] = useState<'my_teaching' | 'class'>('class');

  const isAdmin = ['super_admin', 'institute_admin', 'academic_director'].includes(role);
  const isTeacher = ['class_teacher', 'teacher'].includes(role);

  // Filter routine items
  const filteredRoutine = routine.filter(r => {
    if (isTeacher && teacherScheduleMode === 'my_teaching') {
      return r.teacher_name === 'Fatema Begum';
    }
    return r.class_name === selectedClass && r.section_name.includes(selectedSection.replace('Section ', ''));
  });

  const getSlot = (day: string, period: number) => {
    return filteredRoutine.find(r => r.day_of_week === day && r.period_number === period);
  };

  const handleSaveRoutine = () => {
    showToast(`Class routine saved for ${selectedClass} - ${selectedSection}! Teachers notified.`, 'success');
  };

  const handleDuplicateDay = (fromDay: string) => {
    showToast(`Routine from ${fromDay} duplicated. Adjust subjects and save.`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} style={{ color: '#38bdf8' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {isAdmin ? 'Class Routine Manager' : isTeacher ? 'Teacher Assigned Schedule' : 'My Class Routine'}
            </h1>
            <span className="badge badge-blue">
              {isAdmin ? 'Weekly Timetable Admin' : isTeacher ? 'Class Teacher View' : 'Weekly Timetable'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {isAdmin
              ? `Configure weekly timetable for all classes and sections • ${selectedClass} — ${selectedSection}`
              : isTeacher
              ? 'View and manage your assigned periods, room allocations, and daily teaching schedule'
              : 'Your weekly teaching or class schedule'
            }
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Class/Section Selectors (Admin only) */}
          {isAdmin && (
            <>
              <select
                className="form-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '140px', padding: '8px 10px', fontSize: '0.8rem' }}
              >
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11 (Science)">Class 11</option>
                <option value="Class 12 (Science)">Class 12</option>
              </select>
              <select
                className="form-select"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{ width: '160px', padding: '8px 10px', fontSize: '0.8rem' }}
              >
                <option value="Section A">Section A (Padma)</option>
                <option value="Section B">Section B (Meghna)</option>
              </select>
            </>
          )}

          {/* Teacher Mode Switcher */}
          {isTeacher && (
            <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3px' }}>
              <button
                onClick={() => setTeacherScheduleMode('class')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: teacherScheduleMode === 'class' ? '#8b5cf6' : 'transparent',
                  color: teacherScheduleMode === 'class' ? '#fff' : 'var(--text-muted)'
                }}
              >
                Class 10-A Timetable
              </button>
              <button
                onClick={() => setTeacherScheduleMode('my_teaching')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: teacherScheduleMode === 'my_teaching' ? '#8b5cf6' : 'transparent',
                  color: teacherScheduleMode === 'my_teaching' ? '#fff' : 'var(--text-muted)'
                }}
              >
                My Teaching Periods
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: viewMode === 'grid' ? '#3b82f6' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: viewMode === 'list' ? '#3b82f6' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}
            >
              List
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            <Printer size={14} /> Print
          </button>

          {isAdmin && (
            <button className="btn btn-primary btn-sm" onClick={handleSaveRoutine}>
              <Save size={14} /> Save Routine
            </button>
          )}
        </div>
      </div>

      {/* Live Period Status Tracker */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} style={{ color: '#38bdf8' }} />
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>Live Period Tracker:</span>{' '}
            <strong style={{ color: '#fff', fontSize: '0.85rem' }}>Period 2 (08:50 AM – 09:35 AM)</strong>{' '}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>— Physics with Fatema Begum (Room 302)</span>
          </div>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: 600 }}>
          Up Next: Period 3 (09:40 AM) Bangla 1st Paper
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '14px 16px',
                    background: 'var(--bg-surface)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-dim)',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    textAlign: 'left',
                    width: '90px',
                    position: 'sticky',
                    left: 0,
                    zIndex: 2
                  }}>
                    <Clock size={14} style={{ marginRight: '5px', display: 'inline' }} />
                    Period
                  </th>
                  {DAYS.map(day => (
                    <th key={day} style={{
                      padding: '14px 12px',
                      background: 'var(--bg-surface)',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-dim)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textAlign: 'center',
                      minWidth: '130px'
                    }}>
                      <div>{day}</div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDuplicateDay(day)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            fontSize: '0.65rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            marginTop: '3px',
                            opacity: 0.6
                          }}
                          title={`Copy ${day}'s schedule`}
                        >
                          <Copy size={10} /> Copy
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot.period}>
                    <td style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderRight: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      position: 'sticky',
                      left: 0,
                      zIndex: 1
                    }}>
                      <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.78rem' }}>P{slot.period}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', lineHeight: 1.2, marginTop: '2px' }}>
                        {slot.start}
                        <br />{slot.end}
                      </div>
                    </td>
                    {DAYS.map(day => {
                      const item = getSlot(day, slot.period);
                      const slotKey = `${day}-${slot.period}`;
                      const isEditing = editingSlot === slotKey;
                      const color = item ? (SUBJECT_COLORS[item.subject_name] || '#64748b') : 'transparent';

                      return (
                        <td
                          key={day}
                          style={{
                            padding: '6px',
                            borderBottom: '1px solid var(--border-subtle)',
                            borderRight: '1px solid var(--border-subtle)',
                            verticalAlign: 'top',
                            minHeight: '70px',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (!item) e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                          }}
                          onMouseLeave={(e) => {
                            if (!item) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {item ? (
                            <div
                              style={{
                                padding: '8px 10px',
                                borderRadius: '8px',
                                background: `${color}18`,
                                borderLeft: `3px solid ${color}`,
                                minHeight: '56px',
                                cursor: isAdmin ? 'pointer' : 'default',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                position: 'relative'
                              }}
                              onClick={() => isAdmin && setEditingSlot(isEditing ? null : slotKey)}
                              onMouseEnter={(e) => {
                                if (isAdmin) {
                                  e.currentTarget.style.transform = 'scale(1.02)';
                                  e.currentTarget.style.boxShadow = `0 4px 15px ${color}30`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div style={{
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                color: color,
                                marginBottom: '3px',
                                lineHeight: 1.2
                              }}>
                                {item.subject_name}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                                {item.teacher_name}
                              </div>
                              <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                                {item.room_number}
                              </div>

                              {isAdmin && isEditing && (
                                <div style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  display: 'flex',
                                  gap: '3px'
                                }}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setEditingSlot(null); showToast('Slot editor opened', 'info'); }}
                                    style={{
                                      width: '20px', height: '20px',
                                      borderRadius: '4px',
                                      border: 'none',
                                      background: 'rgba(59, 130, 246, 0.3)',
                                      color: '#60a5fa',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <Edit3 size={10} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); showToast('Slot cleared', 'info'); setEditingSlot(null); }}
                                    style={{
                                      width: '20px', height: '20px',
                                      borderRadius: '4px',
                                      border: 'none',
                                      background: 'rgba(239, 68, 68, 0.3)',
                                      color: '#f87171',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            isAdmin ? (
                              <button
                                onClick={() => setShowAddModal(true)}
                                style={{
                                  width: '100%',
                                  minHeight: '56px',
                                  borderRadius: '8px',
                                  border: '1px dashed var(--border-medium)',
                                  background: 'transparent',
                                  color: 'var(--text-dim)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s',
                                  fontSize: '0.7rem'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#3b82f6';
                                  e.currentTarget.style.color = '#60a5fa';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                                  e.currentTarget.style.color = 'var(--text-dim)';
                                }}
                              >
                                <Plus size={14} />
                              </button>
                            ) : (
                              <div style={{
                                minHeight: '56px',
                                borderRadius: '8px',
                                background: 'var(--bg-surface)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                color: 'var(--text-dim)',
                                opacity: 0.5
                              }}>
                                Free Period
                              </div>
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {DAYS.map(day => {
            const dayItems = filteredRoutine.filter(r => r.day_of_week === day).sort((a, b) => a.period_number - b.period_number);
            if (dayItems.length === 0) return null;

            return (
              <div key={day} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Calendar size={16} style={{ color: '#38bdf8' }} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{day}</h3>
                  <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                    {dayItems.length} Period{dayItems.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dayItems.map(item => {
                    const color = SUBJECT_COLORS[item.subject_name] || '#64748b';
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderLeft: `3px solid ${color}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: `${color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            color: color,
                            flexShrink: 0
                          }}>
                            P{item.period_number}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: color }}>
                              {item.subject_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              Teacher: {item.teacher_name} • Room: {item.room_number}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          {item.start_time} – {item.end_time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subject Legend */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
          Subject Color Legend
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
            <div key={subject} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: `${color}15`,
              border: `1px solid ${color}30`,
              fontSize: '0.72rem',
              fontWeight: 600,
              color: color
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: color,
                flexShrink: 0
              }} />
              {subject}
            </div>
          ))}
        </div>
      </div>

      {/* Add Slot Modal (placeholder) */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Add Routine Slot</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Subject</label>
                <select className="form-select">
                  <option>General Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>Bangla 1st Paper</option>
                  <option>English 1st Paper</option>
                  <option>ICT</option>
                </select>
              </div>
              <div>
                <label className="form-label">Teacher</label>
                <select className="form-select">
                  <option>Tanvir Ahmed</option>
                  <option>Fatema Begum</option>
                  <option>Kazi Nurul</option>
                  <option>Sadia Akhter</option>
                </select>
              </div>
              <div>
                <label className="form-label">Room Number</label>
                <input className="form-input" type="text" placeholder="e.g. Room 302" />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => { setShowAddModal(false); showToast('Routine slot added!', 'success'); }}
                style={{ marginTop: '6px' }}
              >
                <Plus size={16} /> Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
