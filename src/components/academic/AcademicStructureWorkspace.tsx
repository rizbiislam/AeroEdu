import React, { useEffect, useState } from 'react';
import { BookOpen, CalendarRange, Check, Layers3, Plus, School, TriangleAlert } from 'lucide-react';
import { apiClient, isApiAuthEnabled } from '../../services/ApiClient';
import type { ApiAcademicCatalog } from '../../services/academicCatalog';
import { useApp } from '../../context/useApp';
import styles from './AcademicStructureWorkspace.module.css';

const currentYear = new Date().getFullYear();
const emptyCatalog: ApiAcademicCatalog = { years: [], classes: [], sections: [], subjects: [], classSubjects: [] };

export const AcademicStructureWorkspace: React.FC = () => {
  const { can, showToast } = useApp();
  const bn = false;
  const canManage = can('academic.structure.manage');
  const [catalog, setCatalog] = useState(emptyCatalog);
  const [loading, setLoading] = useState(isApiAuthEnabled);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [yearDraft, setYearDraft] = useState({ name: `${currentYear}-${currentYear + 1}`, start_date: `${currentYear}-01-01`, end_date: `${currentYear + 1}-01-01`, is_current: true });
  const [classDraft, setClassDraft] = useState({ academic_year: '', name: '', code: '', ordering: 0 });
  const [sectionDraft, setSectionDraft] = useState({ class_id: '', name: '', capacity: '' });
  const [subjectDraft, setSubjectDraft] = useState({ name: '', code: '', is_optional: false, total_marks: 100, pass_marks: 33 });
  const [assignmentDraft, setAssignmentDraft] = useState({ class_id: '', subject_id: '' });

  const load = async () => {
    const result = await apiClient.getAcademicCatalog();
    setCatalog(result);
    const currentAcademicYear = result.years.find((item) => item.is_current) ?? result.years[0];
    const firstClass = result.classes[0];
    if (currentAcademicYear) setClassDraft((previous) => ({ ...previous, academic_year: currentAcademicYear.id }));
    if (firstClass) {
      setSectionDraft((previous) => ({ ...previous, class_id: previous.class_id || firstClass.id }));
      setAssignmentDraft((previous) => ({ ...previous, class_id: previous.class_id || firstClass.id }));
    }
  };

  useEffect(() => {
    if (!isApiAuthEnabled) return;
    let active = true;
    apiClient.getAcademicCatalog()
      .then((result) => {
        if (!active) return;
        setCatalog(result);
        const activeYear = result.years.find((item) => item.is_current) ?? result.years[0];
        const firstClass = result.classes[0];
        if (activeYear) setClassDraft((previous) => ({ ...previous, academic_year: activeYear.id }));
        if (firstClass) {
          setSectionDraft((previous) => ({ ...previous, class_id: previous.class_id || firstClass.id }));
          setAssignmentDraft((previous) => ({ ...previous, class_id: previous.class_id || firstClass.id }));
        }
      })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : 'Could not load the academic structure.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const runSave = async (key: string, action: () => Promise<unknown>, successMessage: string) => {
    setSaving(key);
    setError('');
    try {
      await action();
      await load();
      showToast(successMessage, 'success');
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Could not save the academic structure.');
    } finally {
      setSaving('');
    }
  };

  const yearName = (id: string) => catalog.years.find((item) => item.id === id)?.name ?? '';
  const classSubjects = catalog.classSubjects.filter((item) => item.is_active);

  if (!isApiAuthEnabled) return <main className={styles.page}><div className="card">{bn ? '???????? ?????? ???????? ???? API ??? ? ???????? ???????? ??????? ??????? ?????' : 'Use API mode with a clean local database to edit academic structure. The demo workspace remains a preview.'}</div></main>;

  return <main className={styles.page}>
    <header className={styles.header}><div><span className={styles.eyebrow}>{bn ? '???????????? ???????? ??????????' : 'INSTITUTE ACADEMIC CONFIGURATION'}</span><h1>{bn ? '??????????, ?????? ? ?????' : 'Academic structure'}</h1><p>{bn ? '??????? ??????? ??????????, ???? ? ??????? ?????? ?? ?????? ???? ???????? ?????' : 'Set up academic years, classes, sections, and the subjects assigned to each class.'}</p></div></header>
    {error && <div className={styles.error} role="alert"><TriangleAlert size={17} />{error}</div>}
    {loading && <div className="card" role="status">{bn ? '???????? ???? ??? ?????�' : 'Loading academic structure�'}</div>}
    {!loading && <>
      <section className={styles.grid}>
        <article className="card"><div className={styles.cardHeading}><CalendarRange size={18} /><div><h2>{bn ? '??????????' : 'Academic years'}</h2><p>{bn ? '????? ? ??????? ?????????? ???????? ?????' : 'Define the institute calendar and current year.'}</p></div></div>
          {canManage && <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void runSave('year', () => apiClient.createAcademicYear(yearDraft), bn ? '?????????? ???????? ???????' : 'Academic year saved.'); }}>
            <label>{bn ? '???' : 'Year name'}<input required maxLength={20} value={yearDraft.name} onChange={(event) => setYearDraft({ ...yearDraft, name: event.target.value })} /></label>
            <div className={styles.twoColumns}><label>{bn ? '????' : 'Starts'}<input required type="date" value={yearDraft.start_date} onChange={(event) => setYearDraft({ ...yearDraft, start_date: event.target.value })} /></label><label>{bn ? '???' : 'Ends'}<input required type="date" value={yearDraft.end_date} onChange={(event) => setYearDraft({ ...yearDraft, end_date: event.target.value })} /></label></div>
            <label className={styles.check}><input type="checkbox" checked={yearDraft.is_current} onChange={(event) => setYearDraft({ ...yearDraft, is_current: event.target.checked })} />{bn ? '??????? ??????????' : 'Set as current year'}</label>
            <button className="btn btn-primary" disabled={!canManage || saving === 'year'}><Plus size={15} />{saving === 'year' ? (bn ? '??????? ?????�' : 'Saving�') : (bn ? '?????????? ??? ????' : 'Add academic year')}</button>
          </form>}
          <ul className={styles.list}>{catalog.years.map((year) => <li key={year.id}><span>{year.name}</span>{year.is_current && <span className={styles.current}><Check size={13} />{bn ? '???????' : 'Current'}</span>}</li>)}</ul>
        </article>

        <article className="card"><div className={styles.cardHeading}><School size={18} /><div><h2>{bn ? '?????? ? ????' : 'Classes & sections'}</h2><p>{bn ? '?????? ? ????? ???? ???????????? ????? ????? ?????' : 'Keep each class and section tied to an academic year.'}</p></div></div>
          {canManage && <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void runSave('class', () => apiClient.createAcademicClass({ ...classDraft, is_active: true }), bn ? '?????? ???????? ???????' : 'Class saved.'); }}>
            <label>{bn ? '??????????' : 'Academic year'}<select required value={classDraft.academic_year} onChange={(event) => setClassDraft({ ...classDraft, academic_year: event.target.value })}><option value="">{bn ? '?????????? ?????' : 'Select a year'}</option>{catalog.years.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}</select></label>
            <div className={styles.twoColumns}><label>{bn ? '??????? ???' : 'Class name'}<input required maxLength={50} value={classDraft.name} onChange={(event) => setClassDraft({ ...classDraft, name: event.target.value })} /></label><label>{bn ? '???' : 'Code'}<input maxLength={30} value={classDraft.code} onChange={(event) => setClassDraft({ ...classDraft, code: event.target.value })} /></label></div>
            <button className="btn btn-primary" disabled={!classDraft.academic_year || saving === 'class'}><Plus size={15} />{bn ? '?????? ??? ????' : 'Add class'}</button>
          </form>}
          {canManage && <form className={styles.compactForm} onSubmit={(event) => { event.preventDefault(); void runSave('section', () => apiClient.createAcademicSection({ class_id: sectionDraft.class_id, name: sectionDraft.name, capacity: sectionDraft.capacity ? Number(sectionDraft.capacity) : null, class_teacher_id: null, is_active: true }), bn ? '???? ???????? ???????' : 'Section saved.'); }}>
            <label>{bn ? '??????? ???? ??? ????' : 'Add a section'}<select required value={sectionDraft.class_id} onChange={(event) => setSectionDraft({ ...sectionDraft, class_id: event.target.value })}><option value="">{bn ? '?????? ?????' : 'Select a class'}</option>{catalog.classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <div className={styles.twoColumns}><input aria-label={bn ? '????? ???' : 'Section name'} placeholder={bn ? '????? ???' : 'Section name'} required maxLength={30} value={sectionDraft.name} onChange={(event) => setSectionDraft({ ...sectionDraft, name: event.target.value })} /><input aria-label={bn ? '??? ??????' : 'Capacity'} placeholder={bn ? '??? ??????' : 'Capacity'} type="number" min="1" value={sectionDraft.capacity} onChange={(event) => setSectionDraft({ ...sectionDraft, capacity: event.target.value })} /></div>
            <button className="btn btn-secondary" disabled={!sectionDraft.class_id || saving === 'section'}><Plus size={15} />{bn ? '???? ??? ????' : 'Add section'}</button>
          </form>}
          <ul className={styles.list}>{catalog.classes.map((item) => <li key={item.id}><span>{item.name}<small>{yearName(item.academic_year)}</small></span><strong>{catalog.sections.filter((section) => section.class_id === item.id && section.is_active).length} {bn ? '????' : 'sections'}</strong></li>)}</ul>
        </article>

        <article className="card"><div className={styles.cardHeading}><BookOpen size={18} /><div><h2>{bn ? '????? ??????' : 'Subject catalog'}</h2><p>{bn ? '???????????? ????? ? ??????? ?????? ???????? ?????' : 'Configure subjects and the standard pass-mark structure.'}</p></div></div>
          {canManage && <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void runSave('subject', () => apiClient.createAcademicSubject({ ...subjectDraft, is_active: true }), bn ? '????? ???????? ???????' : 'Subject saved.'); }}>
            <div className={styles.twoColumns}><label>{bn ? '??????? ???' : 'Subject name'}<input required maxLength={100} value={subjectDraft.name} onChange={(event) => setSubjectDraft({ ...subjectDraft, name: event.target.value })} /></label><label>{bn ? '???' : 'Code'}<input maxLength={30} value={subjectDraft.code} onChange={(event) => setSubjectDraft({ ...subjectDraft, code: event.target.value })} /></label></div>
            <div className={styles.twoColumns}><label>{bn ? '????????' : 'Total marks'}<input required min="1" type="number" value={subjectDraft.total_marks} onChange={(event) => setSubjectDraft({ ...subjectDraft, total_marks: Number(event.target.value) })} /></label><label>{bn ? '??? ?????' : 'Pass marks'}<input required min="0" type="number" value={subjectDraft.pass_marks} onChange={(event) => setSubjectDraft({ ...subjectDraft, pass_marks: Number(event.target.value) })} /></label></div>
            <label className={styles.check}><input type="checkbox" checked={subjectDraft.is_optional} onChange={(event) => setSubjectDraft({ ...subjectDraft, is_optional: event.target.checked })} />{bn ? '?????? ?????' : 'Optional subject'}</label>
            <button className="btn btn-primary" disabled={saving === 'subject'}><Plus size={15} />{bn ? '????? ??? ????' : 'Add subject'}</button>
          </form>}
          <ul className={styles.list}>{catalog.subjects.map((subject) => <li key={subject.id}><span>{subject.name}<small>{subject.code || (bn ? '??? ???' : 'No code')}</small></span><strong>{subject.pass_marks}/{subject.total_marks}</strong></li>)}</ul>
        </article>

        <article className="card"><div className={styles.cardHeading}><Layers3 size={18} /><div><h2>{bn ? '???????? ????? ??????' : 'Class subject assignments'}</h2><p>{bn ? '??? ???????? ??? ????? ?????? ??? ?? ???????? ?????' : 'Set the valid subject scope for class assessments.'}</p></div></div>
          {canManage && <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void runSave('assignment', () => apiClient.createClassSubject({ ...assignmentDraft, teacher_id: null, is_active: true }), bn ? '????? ?????? ??? ???????' : 'Subject assigned to class.'); }}>
            <label>{bn ? '??????' : 'Class'}<select required value={assignmentDraft.class_id} onChange={(event) => setAssignmentDraft({ ...assignmentDraft, class_id: event.target.value })}><option value="">{bn ? '?????? ?????' : 'Select a class'}</option>{catalog.classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label>{bn ? '?????' : 'Subject'}<select required value={assignmentDraft.subject_id} onChange={(event) => setAssignmentDraft({ ...assignmentDraft, subject_id: event.target.value })}><option value="">{bn ? '????? ?????' : 'Select a subject'}</option>{catalog.subjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <button className="btn btn-primary" disabled={!assignmentDraft.class_id || !assignmentDraft.subject_id || saving === 'assignment'}><Plus size={15} />{bn ? '????? ?????? ????' : 'Assign subject'}</button>
          </form>}
          <ul className={styles.list}>{classSubjects.map((item) => <li key={item.id}><span>{item.subject_name}<small>{item.class_name}</small></span>{item.teacher_name && <strong>{item.teacher_name}</strong>}</li>)}</ul>
        </article>
      </section>
      {!canManage && <p className={styles.readOnly}>{bn ? '????? ?????? ???????? ?????? ????? ?????? ????; ?????????? ?????? ????' : 'Your role can view the academic structure but cannot change it.'}</p>}
      {!canManage && !catalog.years.length && <div className="card">{bn ? '?????????? ?????????? ?????????? ? ?????? ???? ???? ?????' : 'Ask an institute administrator to create the academic year and classes.'}</div>}
    </>}
  </main>;
};
