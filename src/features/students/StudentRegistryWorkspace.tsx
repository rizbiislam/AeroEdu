import { useEffect, useState } from 'react';
import { Search, UserRoundPlus, Users, UserCheck, UserRoundX, AlertCircle, X, Pencil, Archive } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { apiClient, isApiAuthEnabled, type ApiStudent, type ApiStudentDraft, type ApiStudentSummary } from '../../services/ApiClient';
import type { ApiAcademicCatalog } from '../../services/academicCatalog';
import styles from './StudentRegistryWorkspace.module.css';

const today = new Date().toISOString().slice(0, 10);
const emptyCatalog: ApiAcademicCatalog = { years: [], classes: [], sections: [], subjects: [], classSubjects: [] };
const initialDraft: ApiStudentDraft = {
  admission_no: '', full_name: '', date_of_birth: null, gender: '', section_id: null,
  admission_date: today, status: 'active', photo_url: '', metadata: {},
};

export const StudentRegistryWorkspace = () => {
  const { can, currentInstitute, showToast } = useApp();
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [catalog, setCatalog] = useState(emptyCatalog);
  const [summary, setSummary] = useState<ApiStudentSummary>({ total: 0, active: 0, unassigned: 0 });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ApiStudent | null>(null);
  const [archivingId, setArchivingId] = useState('');
  const [draft, setDraft] = useState(initialDraft);
  const [classId, setClassId] = useState('');
  const canManage = can('students.records.manage');

  useEffect(() => {
    let mounted = true;
    Promise.all([apiClient.getAcademicCatalog(), apiClient.getStudentSummary()])
      .then(([academic, counts]) => {
        if (mounted) { setCatalog(academic); setSummary(counts); }
      })
      .catch((cause: unknown) => { if (mounted) setError(cause instanceof Error ? cause.message : 'Could not load student data.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    apiClient.getStudentPage({ search: debouncedSearch, status, page })
      .then((result) => {
        if (!mounted) return;
        setStudents(result.results);
        setPageCount(Math.max(1, Math.ceil(result.count / 25)));
      })
      .catch((cause: unknown) => { if (mounted) setError(cause instanceof Error ? cause.message : 'Could not load student records.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [debouncedSearch, status, page]);

  const visible = students;
  const availableSections = catalog.sections.filter((section) => section.class_id === classId && section.is_active);

  const saveStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...draft, section_id: draft.section_id || null, date_of_birth: draft.date_of_birth || null };
      if (selectedStudent) await apiClient.updateStudent(selectedStudent.id, payload);
      else await apiClient.createStudent(payload);
      const [records, counts] = await Promise.all([
        apiClient.getStudentPage({ search: debouncedSearch, status, page }),
        apiClient.getStudentSummary(),
      ]);
      setStudents(records.results);
      setSummary(counts);
      setPageCount(Math.max(1, Math.ceil(records.count / 25)));
      setDraft(initialDraft);
      setClassId('');
      setSelectedStudent(null);
      setFormOpen(false);
      showToast(selectedStudent ? 'Student record updated.' : 'Student record created.', 'success');
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Could not save the student record.');
    } finally {
      setSaving(false);
    }
  };

  const openStudentForm = (student?: ApiStudent) => {
    setSelectedStudent(student ?? null);
    setDraft(student ? {
      admission_no: student.admission_no,
      full_name: student.full_name,
      date_of_birth: student.date_of_birth,
      gender: student.gender,
      section_id: student.section_id,
      admission_date: student.admission_date,
      status: student.status,
      photo_url: student.photo_url,
      metadata: student.metadata,
    } : initialDraft);
    setClassId(student?.class_id ?? '');
    setFormOpen(true);
  };

  const archiveStudent = async (student: ApiStudent) => {
    if (!window.confirm(`Archive ${student.full_name}? Their record will be hidden from the active roster.`)) return;
    setArchivingId(student.id);
    setError('');
    try {
      await apiClient.archiveStudent(student.id);
      const [records, counts] = await Promise.all([
        apiClient.getStudentPage({ search: debouncedSearch, status, page }),
        apiClient.getStudentSummary(),
      ]);
      setStudents(records.results);
      setSummary(counts);
      setPageCount(Math.max(1, Math.ceil(records.count / 25)));
      if (page > 1 && records.results.length === 0) setPage((current) => current - 1);
      showToast('Student record archived.', 'success');
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Could not archive the student record.');
    } finally {
      setArchivingId('');
    }
  };

  if (!isApiAuthEnabled) return <main className={styles.page}><div className="card">Student records are available in API mode after creating a local institute and administrator.</div></main>;

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><span className={styles.eyebrow}>{currentInstitute.name} / STUDENT RECORDS</span><h1>Students</h1><p>Manage admissions and keep every learner connected to the right class and section.</p></div>
      {canManage && <button className="btn btn-primary" onClick={() => openStudentForm()}><UserRoundPlus size={16} /> Add student</button>}
    </header>

    {error && <div className={styles.error} role="alert"><AlertCircle size={17} />{error}<button type="button" aria-label="Dismiss" onClick={() => setError('')}><X size={15} /></button></div>}
    <section className={styles.metrics} aria-label="Student totals">
      <article className="card"><span><Users size={16} /> Total records</span><strong>{summary.total}</strong><small>Across this institute</small></article>
      <article className="card"><span><UserCheck size={16} /> Active learners</span><strong>{summary.active}</strong><small>Currently enrolled</small></article>
      <article className="card"><span><UserRoundX size={16} /> Needs placement</span><strong>{summary.unassigned}</strong><small>Active without a section</small></article>
    </section>

    <section className={`card ${styles.panel}`}>
      <div className={styles.toolbar}><label className={styles.search}><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, admission no., class..." /></label><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter by student status"><option value="all">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="graduated">Graduated</option><option value="transferred">Transferred</option></select></div>
      <div className={styles.tableScroll}><table><thead><tr><th>Student</th><th>Admission no.</th><th>Class & section</th><th>Admission date</th><th>Status</th>{canManage && <th>Actions</th>}</tr></thead><tbody>
        {loading && <tr><td colSpan={canManage ? 6 : 5} className={styles.empty}>Loading student records...</td></tr>}
        {!loading && visible.map((student) => <tr key={student.id}><td><strong>{student.full_name}</strong><small>{student.gender || 'Gender not specified'}</small></td><td>{student.admission_no}</td><td>{student.class_name ?? 'Unassigned'}<small>{student.section_name ?? 'No section'}</small></td><td>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${student.admission_date}T12:00:00`))}</td><td><span className={`${styles.status} ${styles[`status_${student.status}`]}`}>{student.status}</span></td>{canManage && <td><div className={styles.rowActions}><button type="button" className={styles.actionButton} onClick={() => openStudentForm(student)} aria-label={`Edit ${student.full_name}`} title="Edit"><Pencil size={15} /></button><button type="button" className={`${styles.actionButton} ${styles.archiveButton}`} disabled={archivingId === student.id} onClick={() => void archiveStudent(student)} aria-label={`Archive ${student.full_name}`} title="Archive"><Archive size={15} /></button></div></td>}</tr>)}
        {!loading && visible.length === 0 && <tr><td colSpan={canManage ? 6 : 5} className={styles.empty}>No students match these filters.</td></tr>}
      </tbody></table></div>
      <div className={styles.pagination}><span>{summary.total === 0 ? 'No records' : `Page ${page} of ${pageCount}`}</span><div><button type="button" className="btn btn-secondary" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>Previous</button><button type="button" className="btn btn-secondary" disabled={page >= pageCount || loading} onClick={() => setPage((current) => current + 1)}>Next</button></div></div>
    </section>

    {formOpen && <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="student-dialog-title">
      <header><div><span className={styles.eyebrow}>ADMISSIONS</span><h2 id="student-dialog-title">{selectedStudent ? 'Edit student' : 'Add student'}</h2><p>Enter the admission details and choose a class placement.</p></div><button className={styles.close} type="button" aria-label="Close" onClick={() => setFormOpen(false)}><X size={18} /></button></header>
      <form onSubmit={saveStudent}>
        <div className={styles.formGrid}><label>Full name<input required maxLength={200} value={draft.full_name} onChange={(event) => setDraft({ ...draft, full_name: event.target.value })} /></label><label>Admission number<input required maxLength={40} value={draft.admission_no} onChange={(event) => setDraft({ ...draft, admission_no: event.target.value })} /></label><label>Date of birth<input type="date" value={draft.date_of_birth ?? ''} onChange={(event) => setDraft({ ...draft, date_of_birth: event.target.value || null })} /></label><label>Gender<input maxLength={20} placeholder="Optional" value={draft.gender} onChange={(event) => setDraft({ ...draft, gender: event.target.value })} /></label><label>Admission date<input required type="date" value={draft.admission_date} onChange={(event) => setDraft({ ...draft, admission_date: event.target.value })} /></label><label>Status<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ApiStudentDraft['status'] })}><option value="active">Active</option><option value="suspended">Suspended</option><option value="graduated">Graduated</option><option value="transferred">Transferred</option></select></label><label>Class<select value={classId} onChange={(event) => { setClassId(event.target.value); setDraft({ ...draft, section_id: null }); }}><option value="">Choose later</option>{catalog.classes.filter((item) => item.is_active).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Section<select value={draft.section_id ?? ''} disabled={!classId} onChange={(event) => setDraft({ ...draft, section_id: event.target.value || null })}><option value="">No section</option>{availableSections.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
        <footer><button className="btn btn-secondary" type="button" onClick={() => setFormOpen(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : selectedStudent ? 'Save changes' : 'Save student'}</button></footer>
      </form>
    </section></div>}
  </main>;
};
