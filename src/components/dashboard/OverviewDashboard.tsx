import React from 'react';
import { useApp } from '../../context/useApp';
import {
  Users,
  CalendarCheck,
  CreditCard,
  Award,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Building2,
  Shield,
  BookOpen,
  GraduationCap,
  FileText,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Check
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    currentInstitute,
    students,
    invoices,
    feeWaivers,
    admissions,
    teacherLeaves,
    boardCompliance,
    academicResults,
    attendanceRecords,
    routine,
    announcements,
    availableInstitutes,
    role,
    setActiveTab,
    t
  } = useApp();

  const totalInvoicesAmount = invoices.reduce((sum, i) => sum + i.total_amount, 0);
  const paidInvoicesAmount = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0);
  const collectionRate = Math.round((paidInvoicesAmount / (totalInvoicesAmount || 1)) * 100);

  // Administrative metrics
  const pendingAdmissions = admissions.filter(a => a.status === 'pending' || a.status === 'interview_scheduled');
  const pendingLeaves = teacherLeaves.filter(l => l.status === 'pending');
  const pendingWaivers = feeWaivers.filter(w => w.status === 'pending');
  const ineligibleBoardStudents = boardCompliance.filter(b => !b.is_eligible_for_board);

  // Attendance statistics
  const presentCount = Object.values(attendanceRecords).filter(s => s === 'present').length;

  // Student Ahmed Sifat's academic result
  const sifatResult = academicResults.find(r => r.student_id === 'stu-001') || academicResults[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ========================================================================= */}
      {/* 1. ROLE-SPECIFIC WELCOME & BANNER                                         */}
      {/* ========================================================================= */}

      {/* CASE A: INSTITUTE ADMIN / PRINCIPAL */}
      {role === 'institute_admin' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.35) 0%, rgba(37, 99, 235, 0.2) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Building2 size={24} style={{ color: '#38bdf8' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Principal & Institutional Governance Desk
              </h1>
              <span className="badge badge-blue">EIIN: {currentInstitute.eiin}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              {currentInstitute.name} • Executive oversight of Admissions, Faculty Workload, Fee Concessions & Board Compliance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('admin_hub')}
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              <Shield size={16} /> Open Governance & Admin Hub
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('students')}
            >
              <Users size={16} /> Student ID & Records
            </button>
          </div>
        </div>
      )}

      {/* CASE B: CLASS TEACHER (HOMEROOM 10-A) */}
      {role === 'class_teacher' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.35) 0%, rgba(16, 185, 129, 0.2) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <CalendarCheck size={24} style={{ color: '#34d399' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Homeroom Desk • Fatema Begum
              </h1>
              <span className="badge badge-green">Class 10 — Section A (Padma)</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Responsible for morning roll call, parent communication, homeroom conduct, and term report cards.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('attendance_entry')}
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
            >
              <CalendarCheck size={16} /> Take Today's Roll Call
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('routine')}
            >
              <Clock size={16} /> Class 10 Routine
            </button>
          </div>
        </div>
      )}

      {/* CASE C: SUBJECT TEACHER */}
      {role === 'teacher' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(91, 33, 182, 0.35) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <BookOpen size={24} style={{ color: '#c084fc' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Academic Faculty Desk • Tanvir Ahmed
              </h1>
              <span className="badge badge-purple">Department of Mathematics</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Classroom instruction, continuous assessment grading (CQ + MCQ + Practical), and schedule tracking.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('grades')}
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' }}
            >
              <GraduationCap size={16} /> Enter Continuous Marks
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('routine')}
            >
              <Clock size={16} /> My 18-Period Schedule
            </button>
          </div>
        </div>
      )}

      {/* CASE D: EXAM CONTROLLER */}
      {role === 'exam_controller' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(146, 64, 14, 0.35) 0%, rgba(245, 158, 11, 0.2) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Award size={24} style={{ color: '#fbbf24' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Examination Council & Assessment Directorate
              </h1>
              <span className="badge badge-amber">Controller Mahbubur Rahman</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              SSC Model Test 2026 Examination cycle • Tabulation sheets, QR Admit Cards & Board Result Publication.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('grades')}
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
            >
              <FileText size={16} /> Master Tabulation Sheet
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('admit_cards')}
            >
              <Award size={16} /> Generate Admit Cards
            </button>
          </div>
        </div>
      )}

      {/* CASE E: ACCOUNTANT / BURSAR */}
      {role === 'accountant' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(21, 94, 117, 0.35) 0%, rgba(6, 182, 212, 0.2) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <CreditCard size={24} style={{ color: '#22d3ee' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Finance & Accounts Directorate • Kamrul Hasan CPA
              </h1>
              <span className="badge badge-blue">Session 2026-27</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Tuition billing, mobile banking IPN reconciliation (bKash & Nagad), and fee waiver verification.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('billing')}
              style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
            >
              <CreditCard size={16} /> Billing & Invoicing
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('waiver_queue')}
            >
              <FileText size={16} /> Fee Waiver Queue ({pendingWaivers.length})
            </button>
          </div>
        </div>
      )}

      {/* CASE F: STUDENT (AHMED SIFAT) */}
      {role === 'student' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(76, 29, 149, 0.35) 0%, rgba(124, 58, 237, 0.2) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <GraduationCap size={24} style={{ color: '#c084fc' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Welcome back, Ahmed Sifat!
              </h1>
              <span className="badge badge-purple">Class 10-A • Roll 01 (Science)</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Academic Standing: <strong>GPA {sifatResult.gpa_with_optional.toFixed(2)} ({sifatResult.final_grade})</strong> • Current Merit Rank: <strong>#1 of 42</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('grades')}
              style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)' }}
            >
              <Award size={16} /> View Academic Transcript
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('admit_cards')}
            >
              <FileText size={16} /> Download Admit Card
            </button>
          </div>
        </div>
      )}

      {/* CASE G: GUARDIAN */}
      {role === 'guardian' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(159, 18, 57, 0.35) 0%, rgba(244, 63, 94, 0.2) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Users size={24} style={{ color: '#fb7185' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Parent & Guardian Portal • Mohammad Faruk
              </h1>
              <span className="badge badge-purple">Student: Ahmed Sifat (Class 10-A)</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Daily attendance tracking, term report card review, and instant digital fee settlement.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('billing')}
              style={{ background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)' }}
            >
              <CreditCard size={16} /> Pay Due ৳3,400 via bKash
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('grades')}
            >
              <Award size={16} /> Child's Progress Report
            </button>
          </div>
        </div>
      )}

      {/* CASE H: SUPER ADMIN */}
      {role === 'super_admin' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(49, 46, 129, 0.35) 0%, rgba(99, 102, 241, 0.2) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Sparkles size={24} style={{ color: '#818cf8' }} />
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                {t.dashboard_platform_title}
              </h1>
              <span className="badge badge-blue">
                {availableInstitutes.length} {t.dashboard_accessible_institutes}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              {t.dashboard_platform_description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('institutes')}
            >
              <Building2 size={16} /> {t.directory_title}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('audit_logs')}
            >
              <Shield size={16} /> {t.nav_audit_logs}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADAPTIVE KPI CARDS MATRIX                                              */}
      {/* ========================================================================= */}

      {/* 2A: FOR INSTITUTE ADMIN (Principal Administrative KPI) */}
      {role === 'institute_admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
          {/* Card 1: Admissions Intake */}
          <div className="card card-interactive" onClick={() => setActiveTab('admin_hub')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                New Admissions
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {pendingAdmissions.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Pending Scrutiny</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#38bdf8' }}>
              <ArrowRight size={14} />
              <span>Review applicant GPA & documents</span>
            </div>
          </div>

          {/* Card 2: Faculty HR & Leaves */}
          <div className="card card-interactive" onClick={() => setActiveTab('admin_hub')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Faculty HR & Leaves
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <Briefcase size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {pendingLeaves.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Leave Requests</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f59e0b' }}>
              <Clock size={14} />
              <span>Substitute teachers required</span>
            </div>
          </div>

          {/* Card 3: Fee Concessions */}
          <div className="card card-interactive" onClick={() => setActiveTab('admin_hub')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Fee Waivers
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {pendingWaivers.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Sanctions Pending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
              <CheckCircle2 size={14} />
              <span>Merit, Poverty & Sibling quotes</span>
            </div>
          </div>

          {/* Card 4: Board Compliance */}
          <div className="card card-interactive" onClick={() => setActiveTab('admin_hub')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                BISE Board Audit
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                <AlertTriangle size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {ineligibleBoardStudents.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>At Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f87171' }}>
              <AlertCircle size={14} />
              <span>Attendance &lt; 75% or pre-test failure</span>
            </div>
          </div>
        </div>
      )}

      {/* 2B: FOR CLASS TEACHER & SUBJECT TEACHER */}
      {(role === 'class_teacher' || role === 'teacher') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
          <div className="card card-interactive" onClick={() => setActiveTab('attendance_entry')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Today's Roll Call (10-A)
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <CalendarCheck size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {presentCount} / {students.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Present</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
              <CheckCircle2 size={14} />
              <span>{Math.round((presentCount / (students.length || 1)) * 100)}% attendance rate</span>
            </div>
          </div>

          <div className="card card-interactive" onClick={() => setActiveTab('grades')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Marks Entry Status
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
                <GraduationCap size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              CQ + MCQ + PR
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#c084fc' }}>
              <Sparkles size={14} />
              <span>Model Test component grading open</span>
            </div>
          </div>

          <div className="card card-interactive" onClick={() => setActiveTab('routine')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Teaching Workload
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              18 Periods/Wk
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#38bdf8' }}>
              <CheckCircle2 size={14} />
              <span>3 Lectures scheduled today</span>
            </div>
          </div>

          <div className="card card-interactive" onClick={() => setActiveTab('students')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Homeroom Diary
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <BookOpen size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              42 Students
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f59e0b' }}>
              <Check size={14} />
              <span>All ID cards verified & issued</span>
            </div>
          </div>
        </div>
      )}

      {/* 2C: FOR STUDENT & GUARDIAN */}
      {(role === 'student' || role === 'guardian') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
          <div className="card card-interactive" onClick={() => setActiveTab('grades')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                SSC Model GPA
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              5.00 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>(Golden A+)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
              <CheckCircle2 size={14} />
              <span>Rank #1 in Section 10-A</span>
            </div>
          </div>

          <div className="card card-interactive" onClick={() => setActiveTab('attendance_entry')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Attendance Rate
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <CalendarCheck size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              96.4%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#38bdf8' }}>
              <CheckCircle2 size={14} />
              <span>Fully eligible for BISE Board Exam</span>
            </div>
          </div>

          <div className="card card-interactive" onClick={() => setActiveTab('billing')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Fee Balance
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              ৳3,400 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Due</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f87171' }}>
              <ArrowRight size={14} />
              <span>October Tuition + Lab Fee</span>
            </div>
          </div>

          <div className="card card-interactive" onClick={() => setActiveTab('admit_cards')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Admit Card
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
                <FileText size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Ready
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#c084fc' }}>
              <Sparkles size={14} />
              <span>Signed with official QR seal</span>
            </div>
          </div>
        </div>
      )}

      {role === 'super_admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div className="card">
            <span className="dashboard-metric-label">{t.dashboard_accessible_institutes}</span>
            <strong className="dashboard-metric-value">{availableInstitutes.length}</strong>
          </div>
          <div className="card">
            <span className="dashboard-metric-label">{t.total_students}</span>
            <strong className="dashboard-metric-value">
              {currentInstitute.student_count.toLocaleString()}
              <small> / {currentInstitute.student_cap.toLocaleString()}</small>
            </strong>
          </div>
          <div className="card">
            <span className="dashboard-metric-label">{t.total_staff}</span>
            <strong className="dashboard-metric-value">
              {currentInstitute.staff_count.toLocaleString()}
              <small> / {currentInstitute.staff_cap.toLocaleString()}</small>
            </strong>
          </div>
          <div className="card">
            <span className="dashboard-metric-label">{t.dashboard_academic_year}</span>
            <strong className="dashboard-metric-value">{currentInstitute.academic_year}</strong>
          </div>
        </div>
      )}

      {/* 2D: EXAM CONTROLLER / ACCOUNTANT */}
      {['exam_controller', 'accountant'].includes(role) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
          <div className="card card-interactive">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Enrolled Students
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {currentInstitute.student_count} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dim)' }}>/ {currentInstitute.student_cap} Cap</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
              <TrendingUp size={14} />
              <span>+14 admissions this session</span>
            </div>
          </div>

          <div className="card card-interactive">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Fee Collection Rate
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              ৳{paidInvoicesAmount.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
              <ArrowUpRight size={14} />
              <span>{collectionRate}% collected via bKash/Nagad</span>
            </div>
          </div>

          <div className="card card-interactive">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Model Test Readiness
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              100% Ready
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#a855f7' }}>
              <Sparkles size={14} />
              <span>Admit cards generated & signed</span>
            </div>
          </div>

          <div className="card card-interactive">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Platform Health
              </span>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <Shield size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              99.98%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
              <CheckCircle2 size={14} />
              <span>Postgres RLS & Redis Active</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EXECUTIVE ADMINISTRATIVE FOCUS WIDGET (For Institute Admin)           */}
      {/* ========================================================================= */}
      {role === 'institute_admin' && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <Shield size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Executive Actions Pending Principal Decision</h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Statutory responsibilities: Admissions Intake, Faculty Leave Roster, Fee Concessions & Board Eligibility
                </div>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('admin_hub')}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              Open Full Hub <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Quick Admissions Queue */}
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>Admissions Scrutiny ({pendingAdmissions.length})</span>
                <span className="badge badge-blue">Intake 2026-27</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {admissions.slice(0, 2).map(app => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{app.applicant_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Applying: {app.target_class} ({app.target_group}) • Prior GPA: {app.previous_gpa}</div>
                    </div>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>{app.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Staff Leaves */}
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>Teacher Leave Requests ({pendingLeaves.length})</span>
                <span className="badge badge-amber">HR Action</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {teacherLeaves.slice(0, 2).map(leave => (
                  <div key={leave.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{leave.teacher_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{leave.leave_type.toUpperCase()} • Substitute: {leave.substitute_teacher_name}</div>
                    </div>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{leave.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GRID: ROUTINE + ANNOUNCEMENTS                                          */}
      {/* ========================================================================= */}
      {role !== 'super_admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Today's Schedule */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: '#38bdf8' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Class 10 Routine (Today)</h2>
            </div>
            <span className="badge badge-blue">Monday</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {routine.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.subject_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Teacher: {item.teacher_name} • Room: {item.room_number}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {item.start_time} - {item.end_time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Announcements */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ color: '#f59e0b' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Campus Circulars & Notices</h2>
            </div>
            <span className="badge badge-amber">Public</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f1f5f9' }}>
                    {a.title}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{a.created_at}</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {a.content}
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  By: <strong style={{ color: 'var(--text-muted)' }}>{a.author_name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
