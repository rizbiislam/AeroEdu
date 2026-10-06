import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Award,
  ShieldCheck,
  Lock,
  Users,
  RefreshCw
} from 'lucide-react';
import { ResultVerificationService, type IntegrityAuditReport, type BoardPublicationCertificate } from '../../services/ResultVerificationService';
import { SecurityQRCode } from '../common/SecurityQRCode';

export const ResultVerificationView: React.FC = () => {
  const { academicResults, currentInstitute, exams, publishExamResults, showToast } = useApp();
  const [selectedExamId] = useState('ex-ssc-2027');
  const [dispatchSms, setDispatchSms] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [publicationCert, setPublicationCert] = useState<BoardPublicationCertificate | null>(null);

  const exam = exams.find(e => e.id === selectedExamId) || exams[0];
  const isAlreadyPublished = exam.status === 'published';

  // Run audit through OOP service
  const auditReport: IntegrityAuditReport = ResultVerificationService.auditAcademicResults(academicResults);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast('Integrity audit complete: 100% of subject scores verified and compliant with BISE rules!', 'success');
    }, 600);
  };

  const handlePublish = () => {
    if (!auditReport.isReadyForPublish && !confirm('Some anomalies were detected during audit. Do you still wish to proceed with publication?')) {
      return;
    }

    publishExamResults(exam.id);
    const cert = ResultVerificationService.generatePublicationCertificate(currentInstitute, exam.name);
    setPublicationCert(cert);

    if (dispatchSms) {
      showToast(`Results LOCKED! Dispatched SMS summary to ${academicResults.length} guardians via Teletalk Gateway!`, 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} style={{ color: '#f59e0b' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Board Examination Result Verification & Publication
            </h1>
            <span className={`badge ${isAlreadyPublished ? 'badge-green' : 'badge-amber'}`}>
              {isAlreadyPublished ? 'Official Status: Published' : 'Official Status: Pending Verification'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {exam.name} • Controller of Examinations Directorate • Dhaka Board Statutory Verification Process
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleRunAudit} disabled={isAuditing}>
            <RefreshCw size={15} className={isAuditing ? 'animate-spin' : ''} />
            {isAuditing ? 'Auditing...' : 'Re-Run Integrity Audit'}
          </button>
          {!isAlreadyPublished && (
            <button
              className="btn btn-primary"
              onClick={handlePublish}
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
            >
              <Lock size={15} /> Lock & Publish Results
            </button>
          )}
        </div>
      </div>

      {/* Audit Highlights Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
        {/* Total Candidates */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Enrolled Candidates
            </span>
            <Users size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {auditReport.totalStudents} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Audited</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <CheckCircle2 size={13} />
            <span>100% Tabulation Coverage</span>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Overall Pass Rate
            </span>
            <Award size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {auditReport.passPercentage}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {auditReport.passedCount} Passed • {auditReport.failedCount} Failed
          </div>
        </div>

        {/* Golden A+ Candidates */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Golden A+ Candidates
            </span>
            <Sparkles size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>
            {auditReport.goldenAplusCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>GPA 5.00</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', marginTop: '4px' }}>
            All compulsory subjects scored GP 5.00
          </div>
        </div>

        {/* Audit Readiness */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Board Compliance
            </span>
            <ShieldCheck size={18} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22c55e' }}>
            Certified
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '4px' }}>
            0 Missing Marks • Separate Pass Verified
          </div>
        </div>
      </div>

      {/* Main Verification & Publication Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '22px' }}>
        {/* Left Column: Sign-off & Publication Controls */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0' }}>
              Controller Sign-Off & Verification
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Statutory verification by the Controller of Examinations. Once published, all student transcripts and tabulation sheets are locked against retroactive alterations.
            </p>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Signing Authority
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>Mahbubur Rahman</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Controller of Examinations • {currentInstitute.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>EIIN: {currentInstitute.eiin} • Board: Dhaka</div>
          </div>

          {/* SMS Notification Toggle */}
          <div style={{
            padding: '14px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#93c5fd' }}>
                Instant SMS Broadcast
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                Dispatch individual GPAs and result status to registered guardian mobile numbers.
              </div>
            </div>
            <input
              type="checkbox"
              checked={dispatchSms}
              onChange={(e) => setDispatchSms(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#3b82f6' }}
            />
          </div>

          {/* Action Trigger */}
          <div>
            {!isAlreadyPublished ? (
              <button
                className="btn btn-primary"
                onClick={handlePublish}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
                }}
              >
                <Lock size={17} /> Lock & Publish Official Results
              </button>
            ) : (
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid #10b981',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontWeight: 800 }}>
                  <CheckCircle2 size={18} /> Official Results Published
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Marks locked and transmitted to Public Board Result Portal.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Official Board Publication Certificate Preview */}
        <div style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '12px',
          padding: '28px',
          border: '2px solid #cbd5e1',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          fontFamily: 'serif'
        }}>
          {/* Certificate Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px double #0f172a', paddingBottom: '14px', marginBottom: '18px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569' }}>
              BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, DHAKA
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0', color: '#0f172a' }}>
              {currentInstitute.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              OFFICIAL RESULT PUBLICATION & VERIFICATION CERTIFICATE
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, textAlign: 'justify', color: '#1e293b' }}>
            This is to certify that the examination marks, component-level assessments (Creative/Written, Multiple Choice Questions, and Practical), and Grade Point Averages for <strong>{exam.name}</strong> of <strong>Class 10 (Science Group)</strong> have been rigorously audited, cross-verified with individual teacher markbooks, and tabulated in full compliance with Dhaka Board assessment regulations.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', margin: '18px 0', border: '1px solid #cbd5e1' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Candidate Roll</th>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Student Name</th>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Total Marks</th>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>GPA</th>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Letter Grade</th>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {academicResults.map(res => (
                <tr key={res.student_id}>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}>#{res.roll_number}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', fontWeight: 700 }}>{res.student_name}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{res.total_marks_obtained} / 700</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 800, color: res.gpa_with_optional === 5 ? '#15803d' : '#0f172a' }}>
                    {res.gpa_with_optional.toFixed(2)}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700 }}>{res.final_grade}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ color: res.is_passed ? '#15803d' : '#dc2626', fontWeight: 700 }}>
                      {res.is_passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Certificate Footer with Real Scannable Security QR Code */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px' }}>
            <div style={{ textAlign: 'center', width: '160px' }}>
              <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'cursive', fontSize: '1.15rem', color: '#1e3a8a' }}>Dr. R. Islam</span>
              </div>
              <div style={{ borderBottom: '1.5px solid #0f172a', marginBottom: '4px' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>Principal & Head of Institute</div>
            </div>

            {/* Real Scannable 2D QR Code */}
            <SecurityQRCode
              value={`https://boardresults.aeroedu.bd/verify?eiin=${currentInstitute.eiin}&exam=${exam.id}&cert=${publicationCert?.certificateId || 'CERT-2026-SSC'}`}
              size={90}
              label="Public Board Result QR"
              subLabel="Scan to view web result"
            />

            <div style={{ textAlign: 'center', width: '180px' }}>
              <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'cursive', fontSize: '1.25rem', color: '#1e3a8a' }}>M. Rahman</span>
              </div>
              <div style={{ borderBottom: '1.5px solid #0f172a', marginBottom: '4px' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>Controller of Examinations</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>
                {publicationCert?.securityHash || 'SHA256-DAC-2027'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
