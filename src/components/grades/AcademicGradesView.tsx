import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  GraduationCap,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';
import { TabulationSheetTable } from './TabulationSheetTable';
import { SubjectMarkEntryForm } from './SubjectMarkEntryForm';
import { StudentTranscriptCard } from './StudentTranscriptCard';
import { GradeAnalyticsCard } from './GradeAnalyticsCard';

type GradeTabMode = 'tabulation' | 'entry' | 'transcript' | 'analytics';

export const AcademicGradesView: React.FC = () => {
  const {
    academicResults,
    updateSubjectScore,
    currentInstitute,
    role,
    showToast
  } = useApp();

  const isTeacher = ['class_teacher', 'teacher'].includes(role);
  const isPortalUser = ['student', 'guardian'].includes(role);
  const availableTabs: GradeTabMode[] = isPortalUser
    ? ['transcript']
    : role === 'teacher' ? ['entry']
      : role === 'class_teacher' ? ['entry', 'transcript']
        : role === 'exam_controller' ? ['tabulation', 'transcript', 'analytics']
          : ['tabulation', 'entry', 'transcript', 'analytics'];
  const [activeTab, setActiveTab] = useState<GradeTabMode>(isPortalUser ? 'transcript' : isTeacher ? 'entry' : 'tabulation');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('136'); // Physics by default
  const visibleResults = isPortalUser
    ? academicResults.filter((result) => result.student_id === 'stu-001')
    : isTeacher ? academicResults.filter((result) => result.class_name === 'Class 10') : academicResults;
  const [selectedStudentId, setSelectedStudentId] = useState<string>(isPortalUser ? 'stu-001' : visibleResults[0]?.student_id || 'stu-001');

  const selectedResult = visibleResults.find(r => r.student_id === selectedStudentId) || visibleResults[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = (label: string) => {
    showToast(`Generating board-standard PDF for ${label}...`, 'info');
    setTimeout(() => {
      showToast(`Document ready: ${label.toLowerCase().replace(/\s+/g, '_')}.pdf`, 'success');
    }, 1000);
  };

  const handleSaveBatch = () => {
    showToast('Marks successfully saved & synced with Board Examination Registry!', 'success');
  };

  return (
    <div className="grades-container">
      {/* Top Header Card */}
      <div className="card grades-header no-print">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={24} style={{ color: '#38bdf8' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Academic Assessment & Board Grading Suite
            </h1>
            <span className="badge badge-purple">BISE 5.00 GPA Standard</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Class 10 — Section A (Padma) • Exam: SSC Model Test 2027 • Component Assessment (CQ + MCQ + Practical)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => handleDownloadPdf('Academic Document')}>
            <Download size={15} /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
            <Printer size={15} /> Print Document
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar (Hidden on print) */}
      <div className="grades-tabs-nav no-print">
        {availableTabs.includes('tabulation') && (
        <button
          onClick={() => setActiveTab('tabulation')}
          className={`grades-tab-btn ${activeTab === 'tabulation' ? 'active' : ''}`}
        >
          <FileSpreadsheet size={16} />
          Master Tabulation Sheet (ট্যাবুলেশন শিট)
        </button>
        )}

        {availableTabs.includes('entry') && (
        <button
          onClick={() => setActiveTab('entry')}
          className={`grades-tab-btn ${activeTab === 'entry' ? 'active' : ''}`}
        >
          <Award size={16} />
          Subject Mark Entry (শিক্ষক নম্বর এন্ট্রি)
        </button>
        )}

        {availableTabs.includes('transcript') && (
        <button
          onClick={() => setActiveTab('transcript')}
          className={`grades-tab-btn ${activeTab === 'transcript' ? 'active' : ''}`}
        >
          <FileText size={16} />
          Student Transcript & Report Card (একাডেমিক ট্রান্সক্রিপ্ট)
        </button>
        )}

        {availableTabs.includes('analytics') && (
        <button
          onClick={() => setActiveTab('analytics')}
          className={`grades-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          <TrendingUp size={16} />
          Board Analytics & Pass Health (পরিসংখ্যান)
        </button>
        )}
      </div>

      {/* Tab Views */}
      {activeTab === 'tabulation' && (
        <TabulationSheetTable
          results={visibleResults}
          onSelectStudent={(stuId) => {
            setSelectedStudentId(stuId);
            setActiveTab('transcript');
          }}
        />
      )}

      {activeTab === 'entry' && (
        <SubjectMarkEntryForm
          results={visibleResults}
          selectedSubjectCode={selectedSubjectCode}
          onSubjectChange={setSelectedSubjectCode}
          onUpdateScore={updateSubjectScore}
          onSaveBatch={handleSaveBatch}
        />
      )}

      {activeTab === 'transcript' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Student Selector Bar (No-print) */}
          {!isPortalUser && role !== 'teacher' && <div className="card no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Select Candidate Transcript:
            </span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {visibleResults.map(r => (
                <option key={r.student_id} value={r.student_id}>
                  Roll #{r.roll_number} — {r.student_name} (GPA {r.gpa_with_optional.toFixed(2)})
                </option>
              ))}
            </select>
          </div>}

          <StudentTranscriptCard
            result={selectedResult}
            institute={currentInstitute}
          />
        </div>
      )}

      {activeTab === 'analytics' && (
        <GradeAnalyticsCard
          results={academicResults}
        />
      )}
    </div>
  );
};
