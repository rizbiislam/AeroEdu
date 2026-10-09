import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ClipboardList, Plus, Search, X } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { apiClient, isApiAuthEnabled, type ApiAssessment, type ApiAcademicClass, type ApiAcademicSection, type ApiAcademicSubject, type ApiClassSubject } from '../../services/ApiClient';
import { AssessmentCatalog } from './AssessmentCatalog';
import { AssessmentScopeService } from './AssessmentScopeService';
import type { AssessmentDefinition, AssessmentDraft, AssessmentKind, EvaluationCriterion, EvaluationMode } from './assessment.types';
import styles from './AssessmentWorkspace.module.css';

const words = {
    en: { title: 'Assessments', subtitle: 'Create class and subject assessments, then set how teachers evaluate them.', new: 'New assessment', total: 'All assessments', active: 'In progress', graded: 'Results entered', search: 'Search assessments', all: 'All types', quiz: 'Quiz', assignment: 'Assignment', exam: 'Exam', board_exam: 'Board exam', class: 'Class', section: 'Section', subject: 'Subject', type: 'Type', due: 'Due date', evaluation: 'Evaluation', status: 'Status', points: 'Points', components: 'Weighted components', rubric: 'Rubric', draft: 'Draft', scheduled: 'Scheduled', marking: 'Mark entry', completed: 'Completed', empty: 'No assessments match these filters.', setupTitle: 'Set up an assessment', step1: 'Details', step2: 'Class & subject', step3: 'Evaluation', stepCount: (step: number) => `Step ${step} of 3`, name: 'Assessment name', next: 'Continue', back: 'Back', save: 'Save draft', cancel: 'Cancel', max: 'Maximum score', pass: 'Pass score', teacher: 'Evaluator', criteria: 'Evaluation components', addCriterion: 'Add component', criteriaNote: 'Weights must total 100%.', quizNote: 'Quizzes here are teacher-managed assessments. Interactive self-graded quizzes are outside this release.', created: 'Assessment draft created.', noSection: 'No section available for this class' },
  bn: { title: '?????????', subtitle: '?????? ? ???????????? ????????? ???? ???? ??? ????? ??????? ?????? ???????? ?????', new: '???? ?????????', total: '?? ?????????', active: '?????', graded: '????? ?????? ??????', search: '????????? ??????', all: '?? ???', quiz: '????', assignment: '?????????????', exam: '???????', board_exam: '????? ???????', class: '??????', section: '????', subject: '?????', type: '???', due: '??? ?????', evaluation: '????????? ??????', status: '??????', points: '?????', components: '???????????? ?????', rubric: '???????', draft: '?????', scheduled: '?????????', marking: '????? ??????', completed: '???????', empty: '?? ???????? ???? ????????? ????', setupTitle: '????????? ???? ????', step1: '?????', step2: '?????? ? ?????', step3: '????????? ??????', stepCount: (step: number) => `??? ${step} / ?`, name: '??????????? ???', next: '???????', back: '?????', save: '????? ???????', cancel: '?????', max: '???????? ?????', pass: '??? ?????', teacher: '?????????????', criteria: '??????????? ?????', addCriterion: '????? ??? ????', criteriaNote: '??????? ????? ????? ???% ??? ????', quizNote: '?? ???????? ???? ?????? ????????? ?????? ???????????? ???? ??????? ????? ????', created: '??????????? ????? ???? ???????', noSection: '?? ???????? ???? ???? ???' }
} as const;

const kindOptions: AssessmentKind[] = ['quiz', 'assignment', 'exam', 'board_exam'];
const sampleCriteria: Record<Exclude<EvaluationMode, 'points'>, EvaluationCriterion[]> = {
  components: [{ name: 'Written', weight: 60 }, { name: 'MCQ', weight: 20 }, { name: 'Practical', weight: 20 }],
  rubric: [{ name: 'Accuracy', weight: 40 }, { name: 'Method', weight: 30 }, { name: 'Presentation', weight: 30 }]
};

const sampleAssessments = (instituteId: string, academicYear: string): AssessmentDefinition[] => [
  { id: 'sample-exam', instituteId, academicYear, title: 'Half-yearly examination', kind: 'exam', classId: 'cls-10', sectionId: 'sec-10a', subjectId: 'sub-136', evaluationMode: 'components', evaluationCriteria: sampleCriteria.components, maxScore: 100, passScore: 33, dueAt: '2026-11-18', evaluatorId: 'usr-t-002', status: 'marking', evaluatedCount: 18, cohortCount: 48 },
  { id: 'sample-quiz', instituteId, academicYear, title: 'Motion and energy quiz', kind: 'quiz', classId: 'cls-10', sectionId: 'sec-10a', subjectId: 'sub-136', evaluationMode: 'points', evaluationCriteria: [], maxScore: 20, passScore: 7, dueAt: '2026-11-21', evaluatorId: 'usr-t-002', status: 'scheduled', evaluatedCount: 0, cohortCount: 48 },
  { id: 'sample-assignment', instituteId, academicYear, title: 'Simple pendulum lab report', kind: 'assignment', classId: 'cls-10', sectionId: 'sec-10b', subjectId: 'sub-136', evaluationMode: 'rubric', evaluationCriteria: sampleCriteria.rubric, maxScore: 30, passScore: 10, dueAt: '2026-11-25', evaluatorId: 'usr-t-002', status: 'scheduled', evaluatedCount: 0, cohortCount: 50 }
];

const mapAcademicClass = (item: ApiAcademicClass) => ({ id: item.id, name: item.name, name_bn: item.name, code: item.code, sections_count: 0, students_count: 0 });
const mapAcademicSection = (item: ApiAcademicSection) => ({ id: item.id, class_id: item.class_id, class_name: item.class_name, name: item.name, room_number: '', capacity: item.capacity ?? 0, enrolled: 0, class_teacher_id: item.class_teacher_id ?? '', class_teacher_name: item.class_teacher_name ?? '' });
const mapAcademicSubject = (item: ApiAcademicSubject) => ({ id: item.id, code: item.code, name: item.name, name_bn: item.name, is_optional: item.is_optional, total_marks: Number(item.total_marks), pass_marks: Number(item.pass_marks) });
const mapClassSubject = (item: ApiClassSubject) => ({ id: item.id, class_id: item.class_id, subject_id: item.subject_id, teacher_id: item.teacher_id ?? undefined });
const mapAssessment = (item: ApiAssessment, instituteId: string): AssessmentDefinition => ({
  id: item.id,
  instituteId,
  academicYear: item.academic_year_name,
  title: item.title,
  kind: item.kind,
  classId: item.class_id,
  sectionId: item.section_id,
  subjectId: item.subject_id,
  evaluationMode: item.evaluation_mode,
  evaluationCriteria: item.evaluation_criteria,
  maxScore: Number(item.max_score),
  passScore: Number(item.pass_score),
  dueAt: item.due_at,
  evaluatorId: item.evaluator_id ?? '',
  status: item.status,
  evaluatedCount: 0,
  cohortCount: 0,
});

export const AssessmentWorkspace = () => {
  const { currentInstitute, currentUser, academicClasses: demoClasses, sections: demoSections, subjects: demoSubjects, classSubjects: demoClassSubjects, students, staff, showToast } = useApp();
  const t = words.en;
  const [items, setItems] = useState<AssessmentDefinition[]>(() => isApiAuthEnabled ? [] : sampleAssessments(currentInstitute.id, currentInstitute.academic_year));
  const [academicClasses, setAcademicClasses] = useState(demoClasses);
  const [sections, setSections] = useState(demoSections);
  const [subjects, setSubjects] = useState(demoSubjects);
  const [classSubjects, setClassSubjects] = useState(demoClassSubjects);
  const [loading, setLoading] = useState(isApiAuthEnabled);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(1);
  const initialClass = academicClasses.find((item) => sections.some((section) => section.class_id === item.id))?.id ?? academicClasses[0]?.id ?? '';
  const initialSubjects = AssessmentScopeService.subjectsForClass(subjects, classSubjects, initialClass);
  const [draft, setDraft] = useState<AssessmentDraft>({ title: '', kind: 'exam', classId: initialClass, sectionId: sections.find((item) => item.class_id === initialClass)?.id ?? '', subjectId: initialSubjects[0]?.id ?? '', evaluationMode: 'points', evaluationCriteria: [], maxScore: 100, passScore: 33, dueAt: '', evaluatorId: isApiAuthEnabled ? currentUser.id : staff.find((item) => item.role === 'exam_controller')?.id ?? staff[0]?.id ?? '' });
  const availableSections = sections.filter((item) => item.class_id === draft.classId);
  const availableSubjects = AssessmentScopeService.subjectsForClass(subjects, classSubjects, draft.classId);
  const filterSubjects = classFilter === 'all' ? subjects : AssessmentScopeService.subjectsForClass(subjects, classSubjects, classFilter);
  const visible = useMemo(() => AssessmentCatalog.filter(items, { query, kind, classId: classFilter, subjectId: subjectFilter }), [items, query, kind, classFilter, subjectFilter]);
  const className = (id: string) => academicClasses.find((item) => item.id === id)?.name ?? 'Â·';
  const sectionName = (id: string) => sections.find((item) => item.id === id)?.name ?? 'Â·';
  const subjectName = (id: string) => subjects.find((item) => item.id === id)?.name ?? 'Â·';
  const evaluatorName = (id: string) => staff.find((item) => item.id === id)?.full_name ?? 'Â·';

  useEffect(() => {
    if (!isApiAuthEnabled) return;
    let active = true;
    Promise.all([apiClient.getAcademicCatalog(), apiClient.getAssessments()])
      .then(([catalog, assessmentRows]) => {
        if (!active) return;
        const classes = catalog.classes.filter((item) => item.is_active).map(mapAcademicClass);
        const classIds = new Set(classes.map((item) => item.id));
        const activeSections = catalog.sections.filter((item) => item.is_active && classIds.has(item.class_id)).map(mapAcademicSection);
        const activeSubjects = catalog.subjects.filter((item) => item.is_active).map(mapAcademicSubject);
        const assignments = catalog.classSubjects.filter((item) => item.is_active && classIds.has(item.class_id));
        setAcademicClasses(classes);
        setSections(activeSections);
        setSubjects(activeSubjects);
        setClassSubjects(assignments.map(mapClassSubject));
        setItems(assessmentRows.map((item) => mapAssessment(item, currentInstitute.id)));

        const firstClass = classes[0];
        const firstSection = activeSections.find((item) => item.class_id === firstClass?.id);
        const firstSubject = activeSubjects.find((subject) => assignments.some((item) => item.class_id === firstClass?.id && item.subject_id === subject.id));
        setDraft((current) => ({
          ...current,
          classId: firstClass?.id ?? '',
          sectionId: firstSection?.id ?? '',
          subjectId: firstSubject?.id ?? '',
          evaluatorId: currentUser.id,
        }));
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Could not load academic assessment data.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [currentInstitute.id, currentUser.id]);

  const updateDraft = <K extends keyof AssessmentDraft>(key: K, value: AssessmentDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateCriterion = (index: number, key: keyof EvaluationCriterion, value: string | number) => updateDraft('evaluationCriteria', draft.evaluationCriteria.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const createAssessment = async () => {
    setSaving(true);
    try {
      let created = AssessmentCatalog.create(currentInstitute.id, currentInstitute.academic_year, draft, classSubjects, sections);
      if (isApiAuthEnabled) {
        const saved = await apiClient.createAssessment({
          title: draft.title.trim(),
          kind: draft.kind,
          class_id: draft.classId,
          section_id: draft.sectionId,
          subject_id: draft.subjectId,
          evaluation_mode: draft.evaluationMode,
          evaluation_criteria: draft.evaluationCriteria,
          max_score: draft.maxScore,
          pass_score: draft.passScore,
          due_at: draft.dueAt,
          evaluator_id: draft.evaluatorId || currentUser.id,
        });
        created = mapAssessment(saved, currentInstitute.id);
      } else {
        created.cohortCount = students.filter((student) => student.class_id === draft.classId && student.section_id === draft.sectionId).length;
      }
      setItems((current) => [created, ...current]);
      setDialogOpen(false);
      setStep(1);
      showToast(t.created, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save this assessment.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return <main className={styles.page}>
    <header className={styles.header}><div><span className={styles.kicker}>{currentInstitute.name} <span>Â·</span> {currentInstitute.academic_year}</span><h1>{t.title}</h1><p>{t.subtitle}</p></div><button className="btn btn-primary" type="button" onClick={() => setDialogOpen(true)} disabled={loading || academicClasses.length === 0}><Plus size={17} />{t.new}</button></header>
    {loadError && <p role="alert" className={styles.notice}>{loadError}</p>}{loading && <p role="status" className={styles.notice}>Loading academic and assessment records...</p>}<div className={styles.metrics}><article><span>{t.total}</span><strong>{items.length}</strong><small>{t.title}</small></article><article><span>{t.active}</span><strong>{items.filter((item) => item.status === 'marking').length}</strong><small>{t.status}</small></article><article><span>{t.graded}</span><strong>{items.reduce((sum, item) => sum + item.evaluatedCount, 0)}</strong><small>{isApiAuthEnabled ? 'Enrollment data not connected' : `${items.reduce((sum, item) => sum + item.cohortCount, 0)} assigned`}</small></article></div>
    <section className={styles.panel} aria-label={t.title}>
      <div className={styles.toolbar}><label className={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><select value={kind} onChange={(event) => setKind(event.target.value)} aria-label={t.type}><option value="all">{t.all}</option>{kindOptions.map((value) => <option key={value} value={value}>{t[value]}</option>)}</select><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-label={t.class}><option value="all">{t.class}</option>{academicClasses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} aria-label={t.subject}><option value="all">{t.subject}</option>{filterSubjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
      <div className={styles.tableScroll}><table><thead><tr><th>{t.title}</th><th>{t.class} / {t.section}</th><th>{t.subject}</th><th>{t.due}</th><th>{t.evaluation}</th><th>{t.status}</th></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><span className={styles.assessmentIcon}><ClipboardList size={16} /></span><span className={styles.assessmentTitle}><strong>{item.title}</strong><small>{t[item.kind]} Â· {item.academicYear}</small></span></td><td>{className(item.classId)}<small className={styles.subtle}>{sectionName(item.sectionId)}</small></td><td>{subjectName(item.subjectId)}</td><td>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${item.dueAt}T12:00:00`))}</td><td><strong>{item.maxScore}</strong><small className={styles.subtle}>{t[item.evaluationMode]}</small></td><td><span className={`${styles.status} ${styles[`status_${item.status}`]}`}>{t[item.status]}</span></td></tr>)}{visible.length === 0 && <tr><td className={styles.empty} colSpan={6}>{t.empty}</td></tr>}</tbody></table></div>
      <div className={styles.footnote}><span>{t.quizNote}</span></div>
    </section>
      {dialogOpen && <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }}><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="assessment-dialog-title"><header><div><span className={styles.kicker}>{t.stepCount(step)}</span><h2 id="assessment-dialog-title">{t.setupTitle}</h2></div><button className={styles.iconButton} type="button" onClick={() => setDialogOpen(false)} aria-label={t.cancel}><X size={19} /></button></header><div className={styles.stepper}>{[t.step1, t.step2, t.step3].map((label, index) => <span className={step === index + 1 ? styles.stepActive : step > index + 1 ? styles.stepDone : ''} key={label}><i>{index + 1}</i>{label}</span>)}</div>
      {step === 1 && <div className={styles.form}><label>{t.name}<input autoFocus value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="e.g. Half-yearly physics examination" /></label><label>{t.type}<select value={draft.kind} onChange={(event) => updateDraft('kind', event.target.value as AssessmentKind)}>{kindOptions.map((value) => <option key={value} value={value}>{t[value]}</option>)}</select></label>{draft.kind === 'quiz' && <p className={styles.notice}>{t.quizNote}</p>}</div>}
      {step === 2 && <div className={styles.form}><label>{t.class}<select value={draft.classId} onChange={(event) => { const value = event.target.value; updateDraft('classId', value); updateDraft('sectionId', sections.find((item) => item.class_id === value)?.id ?? ''); updateDraft('subjectId', AssessmentScopeService.subjectsForClass(subjects, classSubjects, value)[0]?.id ?? ''); }}>{academicClasses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>{t.section}<select value={draft.sectionId} onChange={(event) => updateDraft('sectionId', event.target.value)}>{availableSections.length ? availableSections.map((item) => <option key={item.id} value={item.id}>{item.name}</option>) : <option value="">{t.noSection}</option>}</select></label><label>{t.subject}<select value={draft.subjectId} onChange={(event) => updateDraft('subjectId', event.target.value)}>{availableSubjects.map((item) => <option key={item.id} value={item.id}>{item.name} Â· {item.code}</option>)}</select></label>{availableSubjects.length === 0 && <p className={styles.notice}>No subjects are assigned to this class yet. Assign a subject before creating an assessment.</p>}<div className={styles.scopeSummary}><strong>{className(draft.classId)} Â· {sectionName(draft.sectionId)}</strong><span>{students.filter((student) => student.class_id === draft.classId && student.section_id === draft.sectionId).length} students Â· {subjectName(draft.subjectId)}</span></div></div>}
      {step === 3 && <div className={styles.form}><div className={styles.formPair}><label>{t.max}<input min="1" type="number" value={draft.maxScore} onChange={(event) => updateDraft('maxScore', Number(event.target.value))} /></label><label>{t.pass}<input min="0" max={draft.maxScore} type="number" value={draft.passScore} onChange={(event) => updateDraft('passScore', Number(event.target.value))} /></label></div><label>{t.evaluation}<select value={draft.evaluationMode} onChange={(event) => { const mode = event.target.value as EvaluationMode; updateDraft('evaluationMode', mode); updateDraft('evaluationCriteria', mode === 'points' ? [] : sampleCriteria[mode]); }}><option value="points">{t.points}</option><option value="components">{t.components}</option><option value="rubric">{t.rubric}</option></select></label>{draft.evaluationMode !== 'points' && <div className={styles.criteria}><div className={styles.criteriaHeader}><strong>{t.criteria}</strong><button type="button" onClick={() => updateDraft('evaluationCriteria', [...draft.evaluationCriteria, { name: '', weight: 0 }])}><Plus size={14} />{t.addCriterion}</button></div>{draft.evaluationCriteria.map((item, index) => <div className={styles.criterion} key={`${index}-${item.name}`}><input aria-label={`${t.criteria} ${index + 1}`} value={item.name} onChange={(event) => updateCriterion(index, 'name', event.target.value)} /><input aria-label="Weight percent" min="0" max="100" type="number" value={item.weight} onChange={(event) => updateCriterion(index, 'weight', Number(event.target.value))} /><span>%</span><button type="button" onClick={() => updateDraft('evaluationCriteria', draft.evaluationCriteria.filter((_, itemIndex) => index !== itemIndex))} aria-label={t.cancel}><X size={14} /></button></div>)}<small>{t.criteriaNote} Â· {draft.evaluationCriteria.reduce((sum, item) => sum + item.weight, 0)}%</small></div>}<div className={styles.formPair}><label>{t.due}<input required type="date" value={draft.dueAt} onChange={(event) => updateDraft('dueAt', event.target.value)} /></label><label>{t.teacher}<select value={draft.evaluatorId} onChange={(event) => updateDraft('evaluatorId', event.target.value)}>{isApiAuthEnabled ? <option value={currentUser.id}>{currentUser.full_name}</option> : staff.filter((item) => ['teacher', 'class_teacher', 'exam_controller'].includes(item.role)).map((item) => <option key={item.id} value={item.id}>{item.full_name}</option>)}</select></label></div><p className={styles.scopeSummary}><strong>{className(draft.classId)} Â· {sectionName(draft.sectionId)} Â· {subjectName(draft.subjectId)}</strong><span>{evaluatorName(draft.evaluatorId)}</span></p></div>}
      <footer className={styles.dialogFooter}><button className="btn btn-secondary" type="button" onClick={() => step === 1 ? setDialogOpen(false) : setStep((value) => value - 1)}>{step === 1 ? t.cancel : t.back}</button>{step < 3 ? <button className="btn btn-primary" type="button" onClick={() => setStep((value) => value + 1)}>{t.next}<ArrowRight size={15} /></button> : <button className="btn btn-primary" type="button" onClick={createAssessment} disabled={saving || loading || !draft.classId || !draft.sectionId || !draft.subjectId}>{saving ? 'Saving...' : t.save}</button>}</footer></section></div>}
  </main>;
};

