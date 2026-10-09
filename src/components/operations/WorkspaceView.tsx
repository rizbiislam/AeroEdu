import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowDownToLine, ArrowRight, BadgeCheck, Bell, BookOpen, Building2,
  Check, ChevronDown, CircleHelp, CreditCard, KeyRound, LockKeyhole,
  Megaphone, Plus, Search, Settings2, ShieldCheck, Sparkles, Users
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import type { StaffMember } from '../../types';
import styles from './WorkspaceView.module.css';

type WorkspaceId = 'staff' | 'classes' | 'my_classes' | 'institute_setup' | 'communications' | 'settings' | 'subscription' | 'plans' | 'onboarding' | 'api_access' | 'library' | 'transport' | 'hostel' | 'admissions' | 'reports' | 'knowledge_base' | 'fee_structures' | 'dues_report';

const copy = {
  en: {
    eyebrow: 'INSTITUTE WORKSPACE', search: 'Search this workspace…', new: 'Create new', save: 'Save changes',
    active: 'Active', total: 'Total', staffTitle: 'People make a campus work', staffDesc: 'Manage staff profiles, teaching assignments, and access in one place.',
    classTitle: 'Classes & sections', classDesc: 'Keep the academic structure, section capacity, and homeroom assignments up to date.',
    setupTitle: 'Institute profile', setupDesc: 'Manage your public identity, academic calendar, and board affiliation.',
    commTitle: 'Campus communication', commDesc: 'Share clear, timely updates with the right students, families, and staff.',
    settingsTitle: 'Your account & security', settingsDesc: 'Manage sign-in security, language preferences, and recent account activity.',
    plansTitle: 'Plans & entitlements', plansDesc: 'Manage the capabilities and usage limits available to each subscription tier.',
    onboardingTitle: 'Bring an institute on board', onboardingDesc: 'Create a workspace and prepare its first administrator.',
    apiTitle: 'Developer access', apiDesc: 'Manage scoped API credentials and monitor event delivery.',
    libraryTitle: 'Learning resources', libraryDesc: 'Browse shared class materials and campus library resources.',
    transportTitle: 'Transport services', transportDesc: 'View routes, stops, and student transport assignments.',
    hostelTitle: 'Hostel & residence', hostelDesc: 'Review room availability and student residence allocations.',
    admissionsTitle: 'Admissions pipeline', admissionsDesc: 'Track new applications from first contact through enrollment.',
    reportsTitle: 'Institute performance', reportsDesc: 'A clear view of attendance, learning, and campus operations.',
    helpTitle: 'Help center', helpDesc: 'Find clear answers and practical guides in English and Bengali.',
    feeTitle: 'Fee structures', feeDesc: 'Set clear fee heads and schedules for each class and billing cycle.',
    duesTitle: 'Dues & reminders', duesDesc: 'Find outstanding balances and follow up with families in a few steps.',
    announcements: 'Announcements', materials: 'Study materials', all: 'All', published: 'Published', draft: 'Draft', audience: 'Audience',
    latest: 'Latest updates', viewAll: 'View all', empty: 'No items match this search.', addStaff: 'Add staff member', addClass: 'Add class or section',
    post: 'Publish update', postPlaceholder: 'Write an update for your campus…', subject: 'Subject', audienceAll: 'All campus',
    audienceTeachers: 'Teachers', audienceGuardians: 'Guardians', security: 'Security', preferences: 'Preferences', activity: 'Recent login activity',
    mfa: 'Two-step verification', mfaDesc: 'Require a second step when signing in to protect your account.', enabled: 'Enabled', disabled: 'Not enabled', enable: 'Enable protection',
    loginSuccess: 'Successful sign-in', loginFailed: 'Unrecognized sign-in blocked', device: 'Chrome on Windows', location: 'Dhaka, Bangladesh',
    instituteName: 'Institute name', eiin: 'EIIN', board: 'Education board', academicYear: 'Academic year', address: 'Campus address', email: 'Contact email', phone: 'Phone number',
    currentPlan: 'Current plan', usage: 'Plan usage', students: 'Students', staff: 'Staff', sms: 'SMS this month', upgrade: 'Compare plans',
    perYear: 'per year', starter: 'Starter', growth: 'Growth', enterprise: 'Enterprise', included: 'Included',
    step: 'Step', next: 'Continue', create: 'Create institute', basics: 'Institute details', admin: 'First administrator', review: 'Review & create',
    keyName: 'Key name', lastUsed: 'Last used', createKey: 'Create API key', activeKeys: 'Active keys', webhook: 'Webhook endpoints', addWebhook: 'Add endpoint',
    routes: 'Routes', seats: 'Assigned students', capacity: 'Capacity', rooms: 'Rooms', occupancy: 'Occupancy', available: 'Available', occupied: 'Occupied',
    view: 'View details', edit: 'Edit', confirm: 'Confirm changes', signIn: 'Sign-in', mfaOn: 'Multi-factor authentication is enabled for your account.',
    settingsSaved: 'Your settings were saved.', demoNote: 'Demo workspace · Changes are local to this preview.', learnMore: 'Learn more', filters: 'Filters',
  },
  bn: {
    eyebrow: 'প্রতিষ্ঠান কর্মক্ষেত্র', search: 'এই কর্মক্ষেত্রে খুঁজুন…', new: 'নতুন তৈরি করুন', save: 'পরিবর্তন সংরক্ষণ',
    active: 'সক্রিয়', total: 'মোট', staffTitle: 'মানুষেই ক্যাম্পাস সচল থাকে', staffDesc: 'এক জায়গা থেকে কর্মী, পাঠদান ও প্রবেশাধিকার পরিচালনা করুন।',
    classTitle: 'শ্রেণি ও শাখা', classDesc: 'শ্রেণি কাঠামো, আসনসংখ্যা এবং শ্রেণিশিক্ষকের তথ্য হালনাগাদ রাখুন।',
    setupTitle: 'প্রতিষ্ঠানের পরিচিতি', setupDesc: 'প্রতিষ্ঠানের পরিচয়, শিক্ষাবর্ষ ও বোর্ডের তথ্য পরিচালনা করুন।',
    commTitle: 'ক্যাম্পাস যোগাযোগ', commDesc: 'শিক্ষার্থী, পরিবার ও কর্মীদের কাছে সময়মতো সঠিক তথ্য পৌঁছে দিন।',
    settingsTitle: 'অ্যাকাউন্ট ও নিরাপত্তা', settingsDesc: 'সাইন-ইন নিরাপত্তা, ভাষা ও সাম্প্রতিক অ্যাকাউন্ট কার্যক্রম দেখুন।',
    plansTitle: 'প্ল্যান ও সুবিধা', plansDesc: 'প্রতিটি সাবস্ক্রিপশন স্তরের সুবিধা ও ব্যবহারসীমা পরিচালনা করুন।',
    onboardingTitle: 'নতুন প্রতিষ্ঠান যুক্ত করুন', onboardingDesc: 'কর্মক্ষেত্র তৈরি করে প্রথম প্রশাসক প্রস্তুত করুন।',
    apiTitle: 'ডেভেলপার অ্যাক্সেস', apiDesc: 'এপিআই কী পরিচালনা ও ইভেন্ট ডেলিভারি পর্যবেক্ষণ করুন।',
    libraryTitle: 'শিক্ষার উপকরণ', libraryDesc: 'শ্রেণির নোট ও গ্রন্থাগারের উপকরণ দেখুন।',
    transportTitle: 'যাতায়াত সেবা', transportDesc: 'রুট, স্টপ ও শিক্ষার্থীদের যাতায়াত বরাদ্দ দেখুন।',
    hostelTitle: 'আবাসিক ব্যবস্থা', hostelDesc: 'কক্ষের প্রাপ্যতা ও শিক্ষার্থীদের আবাসন দেখুন।',
    admissionsTitle: 'ভর্তি কার্যক্রম', admissionsDesc: 'আবেদন থেকে ভর্তি পর্যন্ত প্রতিটি ধাপ অনুসরণ করুন।',
    reportsTitle: 'প্রতিষ্ঠানের অগ্রগতি', reportsDesc: 'উপস্থিতি, শেখা ও ক্যাম্পাস পরিচালনার সংক্ষিপ্ত চিত্র।',
    helpTitle: 'সহায়তা কেন্দ্র', helpDesc: 'বাংলা ও ইংরেজিতে সহজ উত্তর ও ব্যবহারিক নির্দেশনা খুঁজুন।',
    feeTitle: 'ফি কাঠামো', feeDesc: 'শ্রেণি ও বিলিং সময় অনুযায়ী ফি নির্ধারণ করুন।',
    duesTitle: 'বকেয়া ও অনুস্মারক', duesDesc: 'বকেয়া খুঁজে পরিবারকে সহজে অনুস্মারক পাঠান।',
    announcements: 'ঘোষণা', materials: 'পাঠ্য উপকরণ', all: 'সব', published: 'প্রকাশিত', draft: 'খসড়া', audience: 'প্রাপক',
    latest: 'সাম্প্রতিক আপডেট', viewAll: 'সব দেখুন', empty: 'এই অনুসন্ধানে কোনো তথ্য নেই।', addStaff: 'কর্মী যোগ করুন', addClass: 'শ্রেণি বা শাখা যোগ করুন',
    post: 'আপডেট প্রকাশ', postPlaceholder: 'ক্যাম্পাসের জন্য আপডেট লিখুন…', subject: 'বিষয়', audienceAll: 'পুরো ক্যাম্পাস',
    audienceTeachers: 'শিক্ষক', audienceGuardians: 'অভিভাবক', security: 'নিরাপত্তা', preferences: 'পছন্দ', activity: 'সাম্প্রতিক লগইন',
    mfa: 'দুই ধাপ যাচাইকরণ', mfaDesc: 'অ্যাকাউন্ট সুরক্ষায় সাইন-ইনের সময় দ্বিতীয় ধাপ চালু রাখুন।', enabled: 'চালু', disabled: 'চালু নেই', enable: 'সুরক্ষা চালু করুন',
    loginSuccess: 'সফল সাইন-ইন', loginFailed: 'অপরিচিত সাইন-ইন আটকে দেওয়া হয়েছে', device: 'উইন্ডোজে ক্রোম', location: 'ঢাকা, বাংলাদেশ',
    instituteName: 'প্রতিষ্ঠানের নাম', eiin: 'ইআইআইএন', board: 'শিক্ষা বোর্ড', academicYear: 'শিক্ষাবর্ষ', address: 'ক্যাম্পাসের ঠিকানা', email: 'যোগাযোগের ইমেইল', phone: 'ফোন নম্বর',
    currentPlan: 'বর্তমান প্ল্যান', usage: 'প্ল্যান ব্যবহার', students: 'শিক্ষার্থী', staff: 'কর্মী', sms: 'এই মাসের এসএমএস', upgrade: 'প্ল্যান তুলনা',
    perYear: 'প্রতি বছর', starter: 'স্টার্টার', growth: 'গ্রোথ', enterprise: 'এন্টারপ্রাইজ', included: 'অন্তর্ভুক্ত',
    step: 'ধাপ', next: 'এগিয়ে যান', create: 'প্রতিষ্ঠান তৈরি', basics: 'প্রতিষ্ঠানের তথ্য', admin: 'প্রথম প্রশাসক', review: 'যাচাই ও তৈরি',
    keyName: 'কী-এর নাম', lastUsed: 'সর্বশেষ ব্যবহার', createKey: 'এপিআই কী তৈরি', activeKeys: 'সক্রিয় কী', webhook: 'ওয়েবহুক ঠিকানা', addWebhook: 'ঠিকানা যোগ',
    routes: 'রুট', seats: 'বরাদ্দ শিক্ষার্থী', capacity: 'ধারণক্ষমতা', rooms: 'কক্ষ', occupancy: 'ব্যবহার', available: 'খালি', occupied: 'ব্যবহৃত',
    view: 'বিস্তারিত দেখুন', edit: 'সম্পাদনা', confirm: 'পরিবর্তন নিশ্চিত', signIn: 'সাইন-ইন', mfaOn: 'আপনার অ্যাকাউন্টে বহু-ধাপ যাচাইকরণ চালু আছে।',
    settingsSaved: 'আপনার সেটিংস সংরক্ষণ করা হয়েছে।', demoNote: 'ডেমো কর্মক্ষেত্র · পরিবর্তন শুধু এই প্রিভিউতে থাকবে।', learnMore: 'আরও জানুন', filters: 'ফিল্টার',
  }
} as const;

const headings: Record<WorkspaceId, keyof typeof copy.en> = {
  staff: 'staffTitle', classes: 'classTitle', my_classes: 'classTitle', institute_setup: 'setupTitle', communications: 'commTitle', settings: 'settingsTitle',
  subscription: 'plansTitle', plans: 'plansTitle', onboarding: 'onboardingTitle', api_access: 'apiTitle', library: 'libraryTitle',
  transport: 'transportTitle', hostel: 'hostelTitle', admissions: 'admissionsTitle', reports: 'reportsTitle', knowledge_base: 'helpTitle', fee_structures: 'feeTitle', dues_report: 'duesTitle'
};

const descriptions: Record<WorkspaceId, keyof typeof copy.en> = {
  staff: 'staffDesc', classes: 'classDesc', my_classes: 'classDesc', institute_setup: 'setupDesc', communications: 'commDesc', settings: 'settingsDesc',
  subscription: 'plansDesc', plans: 'plansDesc', onboarding: 'onboardingDesc', api_access: 'apiDesc', library: 'libraryDesc',
  transport: 'transportDesc', hostel: 'hostelDesc', admissions: 'admissionsDesc', reports: 'reportsDesc', knowledge_base: 'helpDesc', fee_structures: 'feeDesc', dues_report: 'duesDesc'
};

export const WorkspaceView: React.FC = () => {
  const { activeTab, availableWorkspaces, language, currentInstitute, currentUser, staff, academicClasses, students, routine, announcements, showToast, createStaffMember, createAcademicClass, publishAnnouncement } = useApp();
  const words = copy[language];
  const moduleId = activeTab as WorkspaceId;
  const [query, setQuery] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(Boolean(currentUser.mfa_enabled));
  const [postText, setPostText] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postAudience, setPostAudience] = useState('all');
  const [postKind, setPostKind] = useState<'announcement' | 'material'>('announcement');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [keyCount, setKeyCount] = useState(2);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createDepartment, setCreateDepartment] = useState('Academic');
  const [createDesignation, setCreateDesignation] = useState('Teacher');
  const [createRole, setCreateRole] = useState<StaffMember['role']>('teacher');
  const nav = availableWorkspaces.find((item) => item.id === activeTab);
  const filteredStaff = useMemo(() => staff.filter((item) => `${item.full_name} ${item.designation} ${item.department}`.toLowerCase().includes(query.toLowerCase())), [staff, query]);
  const filteredStudents = useMemo(() => students.filter((item) => `${item.full_name} ${item.class_name} ${item.section_name}`.toLowerCase().includes(query.toLowerCase())), [students, query]);
  const title = words[headings[moduleId] ?? 'settingsTitle'];
  const description = words[descriptions[moduleId] ?? 'settingsDesc'];

  const save = () => showToast(words.settingsSaved, 'success');
  const publish = () => {
    if (!postTitle.trim() || !postText.trim()) return;
    publishAnnouncement({ title: postTitle.trim(), content: postText.trim(), target_audience: postAudience as 'all' | 'teachers' | 'students' | 'guardians' });
    setPostTitle('');
    setPostText('');
  };
  const submitCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (moduleId === 'staff') {
      createStaffMember({ full_name: createName.trim(), email: createEmail.trim(), designation: createDesignation.trim(), department: createDepartment.trim(), role: createRole });
    } else if (moduleId === 'classes') {
      createAcademicClass({ name: createName.trim(), code: createName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '') });
    }
    setCreateOpen(false);
    setCreateName('');
    setCreateEmail('');
  };

  return (
    <section className={styles.page} aria-labelledby="workspace-title">
      <header className={styles.pageHeader}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>{words.eyebrow}<span> / </span>{nav?.label ?? currentInstitute.name}</span>
          <h1 id="workspace-title">{title}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.headerActions}>
          {(['staff', 'classes', 'onboarding', 'api_access'].includes(moduleId) || (moduleId === 'communications' && !['student', 'guardian'].includes(currentUser.role))) && (
            <button className="btn btn-primary" type="button" onClick={() => ['staff', 'classes'].includes(moduleId) ? setCreateOpen(true) : moduleId === 'communications' ? document.getElementById('workspace-composer')?.focus() : showToast(language === 'bn' ? 'নতুন ফর্ম প্রস্তুত।' : 'The create form is ready.', 'info')}>
              <Plus size={16} /> {moduleId === 'staff' ? words.addStaff : moduleId === 'classes' ? words.addClass : moduleId === 'communications' ? words.post : moduleId === 'api_access' ? words.createKey : words.create}
            </button>
          )}
        </div>
      </header>

      <div className={styles.demoBanner}><Sparkles size={15} /><span>{words.demoNote}</span><span className={styles.bannerRight}>{currentInstitute.academic_year}</span></div>

      {moduleId === 'staff' && <StaffWorkspace />}
      {(moduleId === 'classes' || moduleId === 'my_classes') && <ClassesWorkspace />}
      {moduleId === 'institute_setup' && <InstituteWorkspace />}
      {moduleId === 'communications' && (
        <CommunicationsWorkspace words={words} language={language} announcements={announcements} postTitle={postTitle} setPostTitle={setPostTitle} postText={postText} setPostText={setPostText} postAudience={postAudience} setPostAudience={setPostAudience} postKind={postKind} setPostKind={setPostKind} publish={publish} canPublish={!['student', 'guardian'].includes(currentUser.role)} audienceFilter={currentUser.role === 'student' ? 'students' : currentUser.role === 'guardian' ? 'guardians' : currentUser.role === 'teacher' || currentUser.role === 'class_teacher' ? 'teachers' : 'all'} />
      )}
      {moduleId === 'settings' && <SecurityWorkspace words={words} language={language} mfaEnabled={mfaEnabled} setMfaEnabled={setMfaEnabled} save={save} currentUser={currentUser} />}
      {(moduleId === 'subscription' || moduleId === 'plans') && <PlansWorkspace words={words} language={language} institute={currentInstitute} save={save} />}
      {moduleId === 'onboarding' && <OnboardingWorkspace words={words} language={language} step={onboardingStep} setStep={setOnboardingStep} showToast={showToast} />}
      {moduleId === 'api_access' && <ApiWorkspace words={words} language={language} count={keyCount} addKey={() => { setKeyCount((count) => count + 1); showToast(language === 'bn' ? 'নতুন এপিআই কী তৈরি হয়েছে।' : 'A scoped API key was created.', 'success'); }} />}
      {(moduleId === 'library' || moduleId === 'transport' || moduleId === 'hostel' || moduleId === 'admissions') && (
        <CampusServicesWorkspace moduleId={moduleId} words={words} language={language} query={query} setQuery={setQuery} students={filteredStudents} />
      )}
      {moduleId === 'reports' && <ReportsWorkspace words={words} language={language} institute={currentInstitute} routineCount={routine.length} />}
      {moduleId === 'knowledge_base' && <KnowledgeBaseWorkspace language={language} />}
      {moduleId === 'fee_structures' && <FeeStructureWorkspace language={language} />}
      {moduleId === 'dues_report' && <DuesWorkspace language={language} />}
      {moduleId === 'staff' && <StaffTable rows={filteredStaff} query={query} setQuery={setQuery} words={words} language={language} />}
      {(moduleId === 'classes' || moduleId === 'my_classes') && <ClassCards rows={students} classes={academicClasses} language={language} query={query} setQuery={setQuery} />}
      {createOpen && (moduleId === 'staff' || moduleId === 'classes') && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}>
          <form className={styles.createModal} onSubmit={submitCreate} aria-labelledby="create-workspace-record">
            <button className={styles.modalClose} type="button" onClick={() => setCreateOpen(false)} aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}>×</button>
            <span className={styles.modalIcon}>{moduleId === 'staff' ? <Users size={19} /> : <Building2 size={19} />}</span>
            <h2 id="create-workspace-record">{moduleId === 'staff' ? words.addStaff : words.addClass}</h2>
            <p>{language === 'bn' ? 'প্রাথমিক তথ্য যোগ করুন। পরে সম্পূর্ণ প্রোফাইল সম্পাদনা করা যাবে।' : 'Add the essential details now. You can complete the profile later.'}</p>
            <label className={styles.field}><span>{moduleId === 'staff' ? (language === 'bn' ? 'পূর্ণ নাম' : 'Full name') : (language === 'bn' ? 'শ্রেণির নাম' : 'Class name')}</span><input className="form-input" required autoFocus value={createName} onChange={(event) => setCreateName(event.target.value)} /></label>
            {moduleId === 'staff' ? <>
              <label className={styles.field}><span>{words.email}</span><input className="form-input" type="email" required value={createEmail} onChange={(event) => setCreateEmail(event.target.value)} /></label>
              <div className={styles.formGrid}><label className={styles.field}><span>{language === 'bn' ? 'বিভাগ' : 'Department'}</span><input className="form-input" required value={createDepartment} onChange={(event) => setCreateDepartment(event.target.value)} /></label><label className={styles.field}><span>{language === 'bn' ? 'পদবি' : 'Designation'}</span><input className="form-input" required value={createDesignation} onChange={(event) => setCreateDesignation(event.target.value)} /></label></div>
              <label className={styles.field}><span>{language === 'bn' ? 'সিস্টেম ভূমিকা' : 'System role'}</span><select className="form-select" value={createRole} onChange={(event) => setCreateRole(event.target.value as StaffMember['role'])}><option value="teacher">Teacher</option><option value="class_teacher">Class teacher</option><option value="accountant">Accountant</option><option value="receptionist">Receptionist</option><option value="academic_director">Academic director</option></select></label>
            </> : <label className={styles.field}><span>{language === 'bn' ? 'কোড' : 'Class code'}</span><input className="form-input" readOnly value={createName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'CLASS-CODE'} /></label>}
            <div className={styles.modalActions}><button className="btn btn-secondary" type="button" onClick={() => setCreateOpen(false)}>{language === 'bn' ? 'বাতিল' : 'Cancel'}</button><button className="btn btn-primary" type="submit"><Plus size={15} />{language === 'bn' ? 'তৈরি করুন' : 'Create'}</button></div>
          </form>
        </div>
      )}
    </section>
  );
};

type Words = { [Key in keyof typeof copy.en]: string };

const StaffWorkspace: React.FC = () => {
  const { staff, teacherLeaves, language } = useApp();
  const words = copy[language];
  const active = staff.length;
  const onLeave = teacherLeaves.filter((leave) => leave.status === 'pending').length;
  return <div className={styles.metricGrid}>
    <Metric icon={<Users size={18} />} label={words.staff} value={active.toString()} note={language === 'bn' ? 'শিক্ষক ও কর্মী মিলিয়ে' : 'Across teaching and operations'} />
    <Metric icon={<BadgeCheck size={18} />} label={language === 'bn' ? 'শিক্ষক' : 'Teaching faculty'} value={staff.filter((member) => member.role === 'teacher' || member.role === 'class_teacher').length.toString()} note={language === 'bn' ? 'শ্রেণিতে বরাদ্দ' : 'Assigned to classes'} />
    <Metric icon={<Activity size={18} />} label={language === 'bn' ? 'ছুটির আবেদন' : 'Pending leave'} value={onLeave.toString()} note={language === 'bn' ? 'সিদ্ধান্ত প্রয়োজন' : 'Requires a decision'} accent="amber" />
  </div>;
};

const StaffTable: React.FC<{ rows: ReturnType<typeof useApp>['staff']; query: string; setQuery: (value: string) => void; words: Words; language: 'en' | 'bn' }> = ({ rows, query, setQuery, words, language }) => {
  const { showToast } = useApp();
  return <div className={styles.panel}>
    <PanelHeading title={words.staff} detail={`${rows.length} ${words.total.toLowerCase()}`} />
    <SearchToolbar query={query} setQuery={setQuery} placeholder={language === 'bn' ? 'নাম, পদ বা বিভাগ খুঁজুন' : 'Search name, role, or department'} />
    <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{language === 'bn' ? 'কর্মী' : 'STAFF MEMBER'}</th><th>{language === 'bn' ? 'বিভাগ' : 'DEPARTMENT'}</th><th>{language === 'bn' ? 'দায়িত্ব' : 'ROLE'}</th><th>{language === 'bn' ? 'যোগাযোগ' : 'CONTACT'}</th><th>{language === 'bn' ? 'অবস্থা' : 'STATUS'}</th><th /></tr></thead><tbody>
      {rows.map((member) => <tr key={member.id}><td><Person name={member.full_name} meta={`${member.employee_id} · ${member.designation}`} initials={member.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('')} /></td><td>{member.department}</td><td><span className={styles.rolePill}>{roleLabel(member.role)}</span></td><td><a className={styles.contactLink} href={`mailto:${member.email}`}>{member.email}</a></td><td><span className={`${styles.status} ${styles.statusGreen}`}><span />{words.active}</span></td><td><button className={styles.moreButton} type="button" onClick={() => showToast(`${member.full_name} · ${member.designation}`, 'info')} aria-label={`${words.view}: ${member.full_name}`}><ChevronDown size={16} /></button></td></tr>)}
      {rows.length === 0 && <EmptyRow message={words.empty} columns={6} />}
    </tbody></table></div>
  </div>;
};

const ClassesWorkspace: React.FC = () => {
  const { students, academicClasses, language } = useApp();
  return <div className={styles.metricGrid}>
    <Metric icon={<Building2 size={18} />} label={language === 'bn' ? 'শ্রেণি' : 'Classes'} value={academicClasses.length.toString()} note={language === 'bn' ? 'চলতি শিক্ষাবর্ষে' : 'Across the active academic year'} />
    <Metric icon={<Users size={18} />} label={language === 'bn' ? 'শিক্ষার্থী' : 'Enrolled students'} value={academicClasses.reduce((sum, item) => sum + item.students_count, 0).toLocaleString()} note={language === 'bn' ? 'বর্তমান শ্রেণি তালিকা' : 'Across all active classes'} />
    <Metric icon={<Activity size={18} />} label={language === 'bn' ? 'শাখা' : 'Sections'} value={academicClasses.reduce((sum, item) => sum + item.sections_count, 0).toString()} note={language === 'bn' ? 'শ্রেণিশিক্ষক বরাদ্দসহ' : `${students.length} students in demo roster`} accent="green" />
  </div>;
};

const ClassCards: React.FC<{ rows: ReturnType<typeof useApp>['students']; classes: ReturnType<typeof useApp>['academicClasses']; language: 'en' | 'bn'; query: string; setQuery: (value: string) => void }> = ({ rows, classes, language, query, setQuery }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const visibleClasses = useMemo(() => classes.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(query.toLowerCase())), [classes, query]);
  return <div className={styles.panel}>
    <PanelHeading title={language === 'bn' ? 'শ্রেণি ও শাখা' : 'Classes & sections'} detail={language === 'bn' ? 'শ্রেণি, শাখা ও শ্রেণিশিক্ষক' : 'Classes, sections, and homeroom assignments'} />
    <SearchToolbar query={query} setQuery={setQuery} placeholder={language === 'bn' ? 'শ্রেণি বা শাখা খুঁজুন' : 'Search classes or sections'} />
    <div className={styles.classGrid}>{visibleClasses.map((group, index) => <article className={styles.classCard} key={group.id}>
      <div className={styles.classCardTop}><span className={styles.classIcon}>{String(index + 1).padStart(2, '0')}</span><span className={styles.status}>{language === 'bn' ? 'চলমান' : 'In session'}</span></div>
      <h3>{group.name}</h3><p>{group.code} · {group.sections_count} {language === 'bn' ? 'টি শাখা' : 'sections'}</p>
      <div className={styles.capacityLine}><span>{language === 'bn' ? 'শিক্ষার্থী' : 'Students'}</span><strong>{group.students_count.toLocaleString()}</strong></div>
      <div className={styles.progress}><span style={{ width: `${Math.min(group.students_count / 250 * 100, 100)}%` }} /></div>
      <button className={styles.textButton} type="button" onClick={() => setExpanded(expanded === group.id ? null : group.id)}>{expanded === group.id ? (language === 'bn' ? 'তালিকা লুকান' : 'Hide roster') : (language === 'bn' ? 'শিক্ষার্থীদের তালিকা' : 'View class roster')}<ArrowRight size={15} /></button>
      {expanded === group.id && <div className={styles.roster}>{rows.filter((student) => student.class_name === group.name).slice(0, 4).map((student) => <span key={student.id}>{student.full_name}<small>Roll {student.roll_number}</small></span>)}{rows.every((student) => student.class_name !== group.name) && <span>{language === 'bn' ? 'এই নমুনায় তালিকা নেই' : 'No roster in this demo sample'}</span>}</div>}
    </article>)}</div>
  </div>;
};

const InstituteWorkspace: React.FC = () => {
  const { currentInstitute, language, showToast } = useApp();
  const words = copy[language];
  return <div className={styles.settingsGrid}>
    <aside className={styles.settingsNav}><button className={styles.settingsActive}><Building2 size={16} />{words.basics}</button><button onClick={() => showToast(language === 'bn' ? 'শিক্ষাবর্ষ সেটিংস নির্বাচিত।' : 'Academic calendar settings selected.', 'info')}><BookOpen size={16} />{words.academicYear}</button><button onClick={() => showToast(language === 'bn' ? 'ব্র্যান্ডিং সেটিংস নির্বাচিত।' : 'Branding settings selected.', 'info')}><Sparkles size={16} />Branding</button><button onClick={() => showToast(language === 'bn' ? 'ইন্টিগ্রেশন সেটিংস নির্বাচিত।' : 'Integrations settings selected.', 'info')}><KeyRound size={16} />Integrations</button></aside>
    <div className={styles.panel}>
      <PanelHeading title={words.basics} detail={language === 'bn' ? 'সরকারি ও যোগাযোগের তথ্য' : 'Official and contact details'} />
      <div className={styles.formGrid}>
        <Field label={words.instituteName} value={currentInstitute.name} />
        <Field label={words.eiin} value={currentInstitute.eiin} />
        <Field label={words.board} value={currentInstitute.exam_board_name} />
        <Field label={words.academicYear} value={currentInstitute.academic_year} />
        <Field label={words.email} value={currentInstitute.contact_email} />
        <Field label={words.phone} value={currentInstitute.contact_phone} />
        <Field label={words.address} value={currentInstitute.address} wide />
      </div>
      <div className={styles.formFooter}><span>{language === 'bn' ? 'সর্বশেষ সংরক্ষণ: আজ সকাল ৯:৪১' : 'Last saved today at 9:41 AM'}</span><button className="btn btn-primary" type="button" onClick={() => showToast(words.settingsSaved, 'success')}>{words.save}</button></div>
    </div>
  </div>;
};

const CommunicationsWorkspace: React.FC<{ words: Words; language: 'en' | 'bn'; announcements: ReturnType<typeof useApp>['announcements']; postTitle: string; setPostTitle: (value: string) => void; postText: string; setPostText: (value: string) => void; postAudience: string; setPostAudience: (value: string) => void; postKind: 'announcement' | 'material'; setPostKind: (value: 'announcement' | 'material') => void; publish: () => void; canPublish: boolean; audienceFilter: string }> = ({ words, language, announcements, postTitle, setPostTitle, postText, setPostText, postAudience, setPostAudience, postKind, setPostKind, publish, canPublish, audienceFilter }) => (
  <div className={styles.communicationGrid}>
    <div className={styles.mainColumn}>
      {canPublish && <div className={styles.panel}>
        <div className={styles.tabBar}><button className={postKind === 'announcement' ? styles.tabActive : ''} type="button" onClick={() => setPostKind('announcement')}><Megaphone size={15} />{words.announcements}</button><button className={postKind === 'material' ? styles.tabActive : ''} type="button" onClick={() => setPostKind('material')}><BookOpen size={15} />{words.materials}</button></div>
        <label className={styles.srOnly} htmlFor="workspace-title-input">{words.subject}</label>
        <input id="workspace-title-input" className={styles.postTitleInput} value={postTitle} onChange={(event) => setPostTitle(event.target.value)} placeholder={language === 'bn' ? 'শিরোনাম লিখুন' : 'Add a clear title'} />
        <label className={styles.srOnly} htmlFor="workspace-composer">{words.postPlaceholder}</label>
        <textarea id="workspace-composer" className={styles.composer} placeholder={words.postPlaceholder} value={postText} onChange={(event) => setPostText(event.target.value)} />
        <div className={styles.composerFooter}><label className={styles.audienceSelect}><span>{words.audience}</span><select value={postAudience} onChange={(event) => setPostAudience(event.target.value)}><option value="all">{words.audienceAll}</option><option value="teachers">{words.audienceTeachers}</option><option value="students">{language === 'bn' ? 'শিক্ষার্থী' : 'Students'}</option><option value="guardians">{words.audienceGuardians}</option></select></label><button className="btn btn-primary" type="button" onClick={publish} disabled={!postTitle.trim() || !postText.trim()}><Megaphone size={15} />{words.post}</button></div>
      </div>}
      <div className={styles.feedHeader}><div><h2>{words.latest}</h2><p>{language === 'bn' ? 'সাম্প্রতিক ক্যাম্পাস বার্তা ও উপকরণ' : 'Recent campus announcements and resources'}</p></div><button className={styles.filterButton} type="button"><Settings2 size={15} />{words.filters}</button></div>
      <div className={styles.feed}>{announcements.filter((item) => audienceFilter === 'all' || item.target_audience === 'all' || item.target_audience === audienceFilter).map((item) => <article className={styles.feedItem} key={item.id}><span className={styles.feedIcon}><Megaphone size={17} /></span><div className={styles.feedBody}><div className={styles.feedMeta}><strong>{item.author_name}</strong><span>{item.created_at}</span></div><h3>{item.title}</h3><p>{item.content}</p><span className={styles.audienceBadge}><Users size={12} />{item.target_audience}</span></div></article>)}</div>
    </div>
    <aside className={styles.sideColumn}><div className={styles.sideCard}><h3>{language === 'bn' ? 'প্রকাশনার সংক্ষিপ্তসার' : 'Publishing overview'}</h3><div className={styles.sideStat}><span>{words.published}</span><strong>{announcements.length + 8}</strong></div><div className={styles.sideStat}><span>{words.draft}</span><strong>2</strong></div><div className={styles.sideStat}><span>{language === 'bn' ? 'প্রাপক' : 'Reached this month'}</span><strong>1,248</strong></div><div className={styles.sideFoot}><Bell size={14} />{language === 'bn' ? 'নোটিশ অ্যাপে ও এসএমএসে যায়' : 'Notices reach app and SMS inboxes'}</div></div><div className={styles.sideCard}><h3>{language === 'bn' ? 'লেখার সহায়তা' : 'Before you publish'}</h3><p>{language === 'bn' ? 'গুরুত্বপূর্ণ নোটিশে তারিখ, সময় ও প্রাপক স্পষ্টভাবে উল্লেখ করুন।' : 'Include dates, times, and the intended audience in time-sensitive notices.'}</p><button className={styles.textButton} type="button">{words.learnMore}<ArrowRight size={15} /></button></div></aside>
  </div>
);

const SecurityWorkspace: React.FC<{ words: Words; language: 'en' | 'bn'; mfaEnabled: boolean; setMfaEnabled: (enabled: boolean) => void; save: () => void; currentUser: ReturnType<typeof useApp>['currentUser'] }> = ({ words, language, mfaEnabled, setMfaEnabled, save, currentUser }) => (
  <div className={styles.settingsGrid}>
    <aside className={styles.settingsNav}><button className={styles.settingsActive}><LockKeyhole size={16} />{words.security}</button><button type="button"><Settings2 size={16} />{words.preferences}</button><button type="button"><Activity size={16} />{words.activity}</button></aside>
    <div className={styles.mainColumn}>
      <div className={styles.panel}><PanelHeading title={words.security} detail={language === 'bn' ? 'আপনার পরিচয় ও সাইন-ইন সুরক্ষিত রাখুন' : 'Protect your identity and sign-in'} />
        <div className={styles.securityRow}><span className={styles.securityIcon}><ShieldCheck size={19} /></span><div className={styles.securityCopy}><strong>{words.mfa}</strong><p>{words.mfaDesc}</p></div><button className={`${styles.toggle} ${mfaEnabled ? styles.toggleOn : ''}`} type="button" role="switch" aria-checked={mfaEnabled} onClick={() => { setMfaEnabled(!mfaEnabled); }}>{mfaEnabled ? words.enabled : words.disabled}<span /></button></div>
        <div className={styles.passwordRow}><div><strong>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</strong><p>{language === 'bn' ? 'শেষ পরিবর্তন ৪ মাস আগে' : 'Last changed 4 months ago'}</p></div><button className={styles.secondaryButton} type="button" onClick={save}>{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change password'}<ArrowRight size={15} /></button></div>
      </div>
      <div className={styles.panel}><PanelHeading title={words.activity} detail={language === 'bn' ? 'আপনার অ্যাকাউন্টে সাম্প্রতিক প্রবেশ' : 'Recent access to your account'} />
        <div className={styles.loginItem}><span className={styles.loginIcon}><Check size={16} /></span><div><strong>{words.loginSuccess}</strong><p>{words.device} · {words.location}</p></div><time>{language === 'bn' ? 'আজ, সকাল ৯:৪১' : 'Today, 9:41 AM'}</time></div>
        <div className={styles.loginItem}><span className={`${styles.loginIcon} ${styles.loginWarning}`}><LockKeyhole size={15} /></span><div><strong>{words.loginFailed}</strong><p>{language === 'bn' ? 'অন্য একটি ডিভাইস · চট্টগ্রাম' : 'Unknown device · Chattogram'}</p></div><time>{language === 'bn' ? 'গতকাল, রাত ১১:১৬' : 'Yesterday, 11:16 PM'}</time></div>
        <p className={styles.accountMeta}>{currentUser.email} <span>·</span> {currentUser.role.replace('_', ' ')}</p>
      </div>
    </div>
  </div>
);

const PlansWorkspace: React.FC<{ words: Words; language: 'en' | 'bn'; institute: ReturnType<typeof useApp>['currentInstitute']; save: () => void }> = ({ words, language, institute, save }) => {
  const [entitlements, setEntitlements] = useState<Record<string, boolean>>({ 'student-starter': true, 'attendance-starter': true, 'exams-starter': true, 'billing-starter': true, 'guardian-growth': true, 'sms-growth': true, 'api-enterprise': true, 'analytics-enterprise': true });
  const [limits, setLimits] = useState({ starter: 300, growth: 2000, enterprise: 10000 });
  const modules = [
    { id: 'student', label: language === 'bn' ? 'শিক্ষার্থী ব্যবস্থাপনা' : 'Student management', tier: 'starter' },
    { id: 'attendance', label: language === 'bn' ? 'উপস্থিতি ও সময়সূচি' : 'Attendance & schedules', tier: 'starter' },
    { id: 'exams', label: language === 'bn' ? 'পরীক্ষা ও ফলাফল' : 'Exams & results', tier: 'starter' },
    { id: 'billing', label: language === 'bn' ? 'ফি ও বিলিং' : 'Fees & billing', tier: 'starter' },
    { id: 'guardian', label: language === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian portal', tier: 'growth' },
    { id: 'sms', label: language === 'bn' ? 'এসএমএস বিজ্ঞপ্তি' : 'SMS notifications', tier: 'growth' },
    { id: 'api', label: language === 'bn' ? 'এপিআই ও ওয়েবহুক' : 'API & webhooks', tier: 'enterprise' },
    { id: 'analytics', label: language === 'bn' ? 'উন্নত বিশ্লেষণ' : 'Advanced analytics', tier: 'enterprise' }
  ];
  const used = [
    { label: words.students, current: institute.student_count, limit: institute.student_cap, unit: 'students' },
    { label: words.staff, current: institute.staff_count, limit: institute.staff_cap, unit: 'members' },
    { label: words.sms, current: institute.sms_sent_this_month, limit: institute.sms_cap, unit: 'messages' }
  ];
  return <>
    <div className={styles.planHero}><div><span className={styles.planLabel}>{words.currentPlan}</span><h2>{institute.current_plan.toUpperCase()} <span>{language === 'bn' ? 'প্ল্যান' : 'PLAN'}</span></h2><p>{language === 'bn' ? 'পরবর্তী নবায়ন ১ জানুয়ারি, ২০২৭' : 'Next renewal · January 1, 2027'}</p></div><span className={styles.planSeal}><BadgeCheck size={18} />{words.active}</span></div>
    <div className={styles.usageGrid}>{used.map((item) => <div className={styles.usageCard} key={item.label}><div><span>{item.label}</span><strong>{item.current.toLocaleString()} <small>/ {item.limit.toLocaleString()}</small></strong></div><div className={styles.progress}><span style={{ width: `${Math.min(item.current / (item.limit || 1) * 100, 100)}%` }} /></div><small>{Math.round(item.current / (item.limit || 1) * 100)}% {language === 'bn' ? 'ব্যবহৃত' : 'used'}</small></div>)}</div>
    <div className={styles.planGrid}>{([
      { name: words.starter, price: '৳18,000', description: language === 'bn' ? 'ছোট ও উন্নয়নশীল প্রতিষ্ঠানের জন্য' : 'For growing schools and institutes', features: ['Student records', 'Attendance & exams', 'Fee collection'] },
      { name: words.growth, price: '৳42,000', description: language === 'bn' ? 'বিস্তৃত শিক্ষার্থী ও পরিবারের জন্য' : 'For connected campus communities', features: ['Everything in Starter', 'Guardian portal & SMS', 'Reports and automations'] },
      { name: words.enterprise, price: 'Custom', description: language === 'bn' ? 'বৃহৎ ও বহু ক্যাম্পাসের জন্য' : 'For large and multi-campus groups', features: ['Everything in Growth', 'API & webhooks', 'Advanced analytics'] }
    ]).map((plan, index) => <article className={`${styles.planCard} ${plan.name.toLowerCase() === institute.current_plan ? styles.planSelected : ''}`} key={plan.name}><div className={styles.planCardTop}><h3>{plan.name}</h3>{plan.name.toLowerCase() === institute.current_plan && <span>{words.currentPlan}</span>}</div><div className={styles.planPrice}>{plan.price}<small>{index === 2 ? '' : ` / ${words.perYear}`}</small></div><p>{plan.description}</p><ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><button className={index === 2 ? styles.secondaryButton : 'btn btn-primary'} type="button" onClick={save}>{index === 2 ? (language === 'bn' ? 'বিক্রয় দলের সাথে যোগাযোগ' : 'Contact sales') : words.upgrade}</button></article>)}</div>
    {institute.current_plan === 'enterprise' && <div className={styles.panel}><PanelHeading title={language === 'bn' ? 'সুবিধা ও সীমা সম্পাদনা' : 'Plan entitlement editor'} detail={language === 'bn' ? 'প্রতিটি প্ল্যানে মডিউল ও শিক্ষার্থী সীমা নির্ধারণ করুন' : 'Set which modules and student limits each plan includes'} /><div className={styles.entitlementTable}><div className={styles.entitlementHeader}><strong>{language === 'bn' ? 'মডিউল' : 'MODULE'}</strong><strong>{words.starter}</strong><strong>{words.growth}</strong><strong>{words.enterprise}</strong></div>{modules.map((module) => <div className={styles.entitlementRow} key={module.id}><span>{module.label}</span>{(['starter', 'growth', 'enterprise'] as const).map((plan) => { const isDefault = plan === 'starter' || plan === 'growth' && module.tier !== 'enterprise' || plan === 'enterprise'; const key = `${module.id}-${plan}`; return <label className={styles.checkboxCell} key={plan}><input type="checkbox" checked={entitlements[key] ?? isDefault} onChange={(event) => setEntitlements((previous) => ({ ...previous, [key]: event.target.checked }))} aria-label={`${module.label} · ${plan}`} /></label>; })}</div>)}<div className={styles.entitlementLimits}><strong>{language === 'bn' ? 'সর্বোচ্চ শিক্ষার্থী' : 'Student limit'}</strong>{(['starter', 'growth', 'enterprise'] as const).map((plan) => <label key={plan}><span className={styles.srOnly}>{plan} student limit</span><input type="number" min="1" value={limits[plan]} onChange={(event) => setLimits((previous) => ({ ...previous, [plan]: Number(event.target.value) }))} /></label>)}</div></div><div className={styles.formFooter}><span>{language === 'bn' ? 'পরিবর্তনগুলো এখনো প্রিভিউতে সংরক্ষিত হয়নি।' : 'Changes are staged in this local demo.'}</span><button className="btn btn-primary" type="button" onClick={save}>{words.save}</button></div></div>}
  </>;
};

const OnboardingWorkspace: React.FC<{ words: Words; language: 'en' | 'bn'; step: number; setStep: (step: number) => void; showToast: (message: string, type?: 'success' | 'error' | 'info') => void }> = ({ words, language, step, setStep, showToast }) => (
  <div className={styles.wizardPanel}>
    <div className={styles.stepper}>{[words.basics, words.admin, words.review].map((label, index) => <div className={`${styles.step} ${index <= step ? styles.stepDone : ''}`} key={label}><span>{index < step ? <Check size={14} /> : index + 1}</span><strong>{label}</strong></div>)}</div>
    {step < 2 ? <div className={styles.wizardBody}><PanelHeading title={step === 0 ? words.basics : words.admin} detail={language === 'bn' ? `ধাপ ${step + 1} / 3` : `Step ${step + 1} of 3`} /><div className={styles.formGrid}>{(step === 0 ? [[words.instituteName, 'Dhaka Model School'], [words.eiin, '108277'], [words.board, 'Dhaka Education Board'], [words.academicYear, '2026–2027']] : [[language === 'bn' ? 'প্রশাসকের নাম' : 'Administrator name', ''], [words.email, 'admin@school.edu.bd'], [words.phone, '+880 1XXX-XXXXXX'], [language === 'bn' ? 'পদবি' : 'Role', 'Institute Admin']]).map(([label, value]) => <label className={styles.field} key={label}><span>{label}</span><input className="form-input" defaultValue={value} /></label>)}</div><div className={styles.formFooter}><span>{language === 'bn' ? 'প্রতিটি ধাপ পরে সম্পাদনা করা যাবে।' : 'You can edit these details later.'}</span><button className="btn btn-primary" type="button" onClick={() => setStep(step + 1)}>{words.next}<ArrowRight size={15} /></button></div></div> : <div className={styles.completeState}><span><BadgeCheck size={28} /></span><h2>{language === 'bn' ? 'প্রতিষ্ঠান তৈরির জন্য প্রস্তুত' : 'Ready to create the institute'}</h2><p>{language === 'bn' ? 'তথ্য যাচাই করে ডেমো কর্মক্ষেত্র তৈরি করুন।' : 'Review the workspace details and create this demo institute.'}</p><button className="btn btn-primary" type="button" onClick={() => { setStep(0); showToast(language === 'bn' ? 'ডেমো প্রতিষ্ঠান তৈরি হয়েছে।' : 'Demo institute created successfully.', 'success'); }}>{words.create}<Check size={15} /></button></div>}
  </div>
);

const ApiWorkspace: React.FC<{ words: Words; language: 'en' | 'bn'; count: number; addKey: () => void }> = ({ words, language, count, addKey }) => (
  <div className={styles.mainColumn}>
    <div className={styles.apiNotice}><KeyRound size={17} /><div><strong>{language === 'bn' ? 'সীমিত প্রবেশাধিকার ব্যবহার করুন' : 'Use scoped credentials'}</strong><p>{language === 'bn' ? 'প্রতিটি কী-তে শুধু প্রয়োজনীয় অনুমতি দিন। গোপন কী তৈরির সময় একবারই দেখানো হয়।' : 'Grant only the permissions each integration needs. Secret values are shown once when created.'}</p></div><CircleHelp size={17} /></div>
    <div className={styles.panel}><div className={styles.panelHeading}><div><h2>{words.activeKeys}</h2><p>{language === 'bn' ? `${count}টি সক্রিয় সংযোগ` : `${count} active integration credentials`}</p></div><button className="btn btn-primary" type="button" onClick={addKey}><Plus size={15} />{words.createKey}</button></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{words.keyName}</th><th>{language === 'bn' ? 'অনুমতি' : 'SCOPES'}</th><th>{words.lastUsed}</th><th>{language === 'bn' ? 'অবস্থা' : 'STATUS'}</th></tr></thead><tbody>{['Student sync · ERP', 'Guardian notifications'].map((name, index) => <tr key={name}><td><strong>{name}</strong><small className={styles.tableSub}>aero_••••••••{index ? '9f2c' : 'd18a'}</small></td><td><span className={styles.rolePill}>{index ? 'notifications.send' : 'students.read'}</span></td><td>{index ? 'Oct 8, 2026' : 'Oct 9, 2026'}</td><td><span className={`${styles.status} ${styles.statusGreen}`}><span />{words.active}</span></td></tr>)}</tbody></table></div></div>
    <div className={styles.panel}><div className={styles.panelHeading}><div><h2>{words.webhook}</h2><p>{language === 'bn' ? 'নির্বাচিত ইভেন্টে স্বয়ংক্রিয় বিজ্ঞপ্তি' : 'Automatic delivery for selected platform events'}</p></div><button className={styles.secondaryButton} type="button" onClick={addKey}><Plus size={15} />{words.addWebhook}</button></div><div className={styles.webhookRow}><span className={styles.webhookDot} /><div><strong>Billing events</strong><p>https://api.example.com/webhooks/aeroedu</p></div><span className={styles.status}>{language === 'bn' ? 'সফল · ২ মিনিট আগে' : 'Delivered · 2 min ago'}</span></div></div>
  </div>
);

const CampusServicesWorkspace: React.FC<{ moduleId: WorkspaceId; words: Words; language: 'en' | 'bn'; query: string; setQuery: (value: string) => void; students: ReturnType<typeof useApp>['students'] }> = ({ moduleId, words, language, query, setQuery, students }) => {
  const { showToast } = useApp();
  const isAdmission = moduleId === 'admissions';
  const title = moduleId === 'library' ? words.libraryTitle : moduleId === 'transport' ? words.routes : moduleId === 'hostel' ? words.rooms : words.admissionsTitle;
  const items = moduleId === 'library'
    ? [{ title: 'Algebra · Chapter 6', meta: 'Mathematics · Class 10', tag: 'PDF · 2.4 MB', icon: <BookOpen size={18} /> }, { title: 'Bangladesh & Global Studies', meta: 'Class 9 · Reading list', tag: 'Reading', icon: <BookOpen size={18} /> }, { title: 'SSC Model Test Guide', meta: 'Exam preparation · 2026', tag: 'PDF · 4.1 MB', icon: <BookOpen size={18} /> }]
    : moduleId === 'transport'
      ? [{ title: 'Route A · Dhanmondi', meta: '4 stops · Bus DHA-TA-1245', tag: '32 students', icon: <Building2 size={18} /> }, { title: 'Route B · Mirpur', meta: '6 stops · Bus DHA-MI-8802', tag: '28 students', icon: <Building2 size={18} /> }, { title: 'Route C · Uttara', meta: '5 stops · Bus DHA-UT-3301', tag: '24 students', icon: <Building2 size={18} /> }]
      : moduleId === 'hostel'
        ? [{ title: 'Padma Residence · Girls', meta: '48 rooms · Warden: Shahana Akter', tag: '84% occupied', icon: <Building2 size={18} /> }, { title: 'Meghna Residence · Boys', meta: '62 rooms · Warden: Rafiqul Islam', tag: '76% occupied', icon: <Building2 size={18} /> }, { title: 'Residential waitlist', meta: 'Applications awaiting review', tag: '7 requests', icon: <Users size={18} /> }]
        : students.slice(0, 5).map((student) => ({ title: student.full_name, meta: `${student.class_name} · Section ${student.section_name}`, tag: language === 'bn' ? 'নথি যাচাই' : 'Documents review', icon: <Users size={18} /> }));
  const filtered = items.filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={styles.serviceLayout}><div className={styles.panel}><PanelHeading title={title} detail={language === 'bn' ? 'প্রতিষ্ঠানের হালনাগাদ তথ্য' : 'Current institute records'} /><SearchToolbar query={query} setQuery={setQuery} placeholder={words.search} /><div className={styles.serviceList}>{filtered.map((item) => <article className={styles.serviceItem} key={item.title}><span className={styles.serviceIcon}>{item.icon}</span><div className={styles.serviceCopy}><strong>{item.title}</strong><p>{item.meta}</p></div><span className={styles.serviceTag}>{item.tag}</span><button className={styles.moreButton} type="button" onClick={() => showToast(`${item.title} · ${words.view}`, 'info')}><ArrowRight size={16} /></button></article>)}{filtered.length === 0 && <p className={styles.emptyState}>{words.empty}</p>}</div></div><aside className={styles.sideColumn}><div className={styles.sideCard}><h3>{moduleId === 'library' ? (language === 'bn' ? 'সংগ্রহ' : 'Collection') : moduleId === 'transport' ? words.routes : moduleId === 'hostel' ? words.occupancy : words.filters}</h3><div className={styles.bigStat}>{moduleId === 'library' ? '128' : moduleId === 'transport' ? '12' : moduleId === 'hostel' ? '79%' : '24'}<small>{moduleId === 'library' ? (language === 'bn' ? 'উপকরণ' : 'resources') : moduleId === 'transport' ? (language === 'bn' ? 'সক্রিয় রুট' : 'active routes') : moduleId === 'hostel' ? (language === 'bn' ? 'মোট ব্যবহার' : 'overall occupancy') : (language === 'bn' ? 'নতুন আবেদন' : 'new applications')}</small></div><button className={styles.textButton} type="button" onClick={() => showToast(language === 'bn' ? 'তথ্য ডাউনলোডের জন্য প্রস্তুত।' : 'The filtered data is ready to export.', 'success')}><ArrowDownToLine size={15} />{language === 'bn' ? 'তথ্য রপ্তানি' : 'Export data'}</button></div>{isAdmission && <div className={styles.sideCard}><h3>{language === 'bn' ? 'ভর্তি ধাপ' : 'Application stages'}</h3><div className={styles.pipeline}><span>Submitted <b>12</b></span><span>Interview <b>7</b></span><span>Approved <b>18</b></span></div></div>}</aside></div>;
};

const ReportsWorkspace: React.FC<{ words: Words; language: 'en' | 'bn'; institute: ReturnType<typeof useApp>['currentInstitute']; routineCount: number }> = ({ words, language, institute, routineCount }) => {
  const values = [42, 52, 48, 68, 59, 76, 71, 86, 78, 91, 84, 96];
  const points = values.map((value, index) => `${index * 48},${108 - value}`).join(' ');
  return <><div className={styles.reportStats}><Metric icon={<Users size={18} />} label={words.students} value={institute.student_count.toLocaleString()} note={language === 'bn' ? 'এই শিক্ষাবর্ষে' : 'Current academic year'} /><Metric icon={<Activity size={18} />} label={language === 'bn' ? 'উপস্থিতি' : 'Attendance today'} value="94.8%" note={language === 'bn' ? 'গত সপ্তাহের তুলনায় +২.৪%' : '+2.4% from last week'} accent="green" /><Metric icon={<CreditCard size={18} />} label={language === 'bn' ? 'ফি আদায়' : 'Fee collection'} value="৳8.42L" note={language === 'bn' ? 'মাসিক লক্ষ্যের ৮১%' : '81% of monthly target'} accent="amber" /><Metric icon={<BookOpen size={18} />} label={language === 'bn' ? 'চলমান ক্লাস' : 'Active routines'} value={routineCount.toString()} note={language === 'bn' ? 'এই সপ্তাহে' : 'This week'} /></div><div className={styles.reportGrid}><div className={styles.panel}><PanelHeading title={language === 'bn' ? 'উপস্থিতির প্রবণতা' : 'Attendance trend'} detail={language === 'bn' ? 'সাপ্তাহিক সারাংশ · ২০২৬' : 'Weekly overview · 2026'} /><div className={styles.chart}><div className={styles.chartAxis}><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div><svg viewBox="0 0 528 120" preserveAspectRatio="none" role="img" aria-label={language === 'bn' ? 'সাপ্তাহিক উপস্থিতির চার্ট' : 'Weekly attendance chart'}><defs><linearGradient id="report-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3678e8" stopOpacity=".22" /><stop offset="1" stopColor="#3678e8" stopOpacity="0" /></linearGradient></defs><path d={`M0,120 L${points.replaceAll(' ', ' L')} L528,120 Z`} fill="url(#report-fill)" /><polyline points={points} fill="none" stroke="#3678e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{values.map((value, index) => <circle key={index} cx={index * 48} cy={108 - value} r="3" fill="#fff" stroke="#3678e8" strokeWidth="2" />)}</svg></div><div className={styles.chartLabels}><span>May 12</span><span>May 19</span><span>May 26</span><span>Jun 02</span></div></div><div className={styles.panel}><PanelHeading title={language === 'bn' ? 'শ্রেণিভিত্তিক উপস্থিতি' : 'Attendance by class'} detail={language === 'bn' ? 'আজকের উপস্থিতির হার' : 'Today’s attendance rate'} />{[['Class 10', 96], ['Class 9', 92], ['Class 8', 89], ['Class 7', 95]].map(([label, value]) => <div className={styles.classReport} key={label}><span>{label}</span><div className={styles.progress}><span style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>)}</div></div></>;
};

const KnowledgeBaseWorkspace: React.FC<{ language: 'en' | 'bn' }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const articles = language === 'bn' ? [
    { category: 'অ্যাকাউন্ট ও নিরাপত্তা', title: 'কীভাবে দুই ধাপ যাচাইকরণ চালু করবেন', detail: 'সেটিংস থেকে নিরাপত্তা নির্বাচন করুন। চালু করুন বাটন চাপার পর আপনার ফোনে পাঠানো কোড দিয়ে যাচাই সম্পন্ন করুন।' },
    { category: 'শিক্ষার্থী ব্যবস্থাপনা', title: 'একসঙ্গে একাধিক শিক্ষার্থী কীভাবে যুক্ত করবেন', detail: 'শিক্ষার্থী তালিকায় আমদানি নির্বাচন করে নমুনা ফাইল নিন। তথ্য যাচাই করে ত্রুটি ঠিক করার পর নিশ্চিত করুন।' },
    { category: 'ফি ও পেমেন্ট', title: 'বিকাশ পেমেন্টের রসিদ কোথায় পাবেন', detail: 'ফি পেমেন্টের ইতিহাস থেকে লেনদেন নির্বাচন করে রসিদ ডাউনলোড করুন।' },
    { category: 'পরীক্ষা ও ফলাফল', title: 'ফলাফল প্রকাশের আগে কী যাচাই করবেন', detail: 'মার্কস যাচাই, অনুপস্থিত শিক্ষার্থী ও বোর্ড-যোগ্যতা পরীক্ষা শেষে ফলাফল লক করুন।' },
    { category: 'কর্মী ও অনুমতি', title: 'কর্মীদের ভূমিকা ও প্রবেশাধিকার পরিচালনা', detail: 'কর্মী তালিকায় প্রতিটি সদস্যের ভূমিকা নির্ধারণ করুন এবং প্রয়োজন অনুযায়ী অনুমতি দিন।' },
    { category: 'নোটিশ ও উপকরণ', title: 'অভিভাবকদের কাছে নোটিশ পাঠানো', detail: 'নোটিশ তৈরি করে প্রাপক হিসেবে অভিভাবক নির্বাচন করুন। জরুরি বার্তায় সময়সীমা ও যোগাযোগের তথ্য যোগ করুন।' }
  ] : [
    { category: 'Account & security', title: 'Set up two-step verification', detail: 'Open Settings and choose Security. Turn on protection, then confirm the code sent to your registered device.' },
    { category: 'Student management', title: 'Import a class list in bulk', detail: 'Choose Import from the student directory and download the template. Validate the completed sheet, fix flagged rows, and confirm the import.' },
    { category: 'Fees & payments', title: 'Find a bKash payment receipt', detail: 'Open payment history, select the transaction, then download or print the receipt for your records.' },
    { category: 'Exams & results', title: 'Checklist before publishing results', detail: 'Review entered marks, absent students, and board eligibility. Lock the results only after the verification queue is clear.' },
    { category: 'Staff & permissions', title: 'Manage a staff member’s role', detail: 'Open the staff directory, choose the member, and assign only the access required for their role.' },
    { category: 'Notices & resources', title: 'Send a notice to guardians', detail: 'Create an announcement and choose Guardians as the audience. Include the date, time, and a contact for follow-up.' }
  ];
  const visible = articles.filter((article) => `${article.title} ${article.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={styles.helpLayout}><div className={styles.panel}><PanelHeading title={language === 'bn' ? 'আপনার প্রশ্নের উত্তর খুঁজুন' : 'What can we help you with?'} detail={language === 'bn' ? 'জনপ্রিয় নির্দেশনা ও ধাপে ধাপে সহায়তা' : 'Popular guides and step-by-step help'} /><SearchToolbar query={query} setQuery={setQuery} placeholder={language === 'bn' ? 'কী খুঁজছেন লিখুন…' : 'Search help articles…'} /><div className={styles.helpTopics}>{['Account & security', 'Students', 'Attendance', 'Exams', 'Fees', 'Notices'].map((topic, index) => <button type="button" key={topic} onClick={() => setQuery(language === 'bn' ? ['অ্যাকাউন্ট', 'শিক্ষার্থী', 'উপস্থিতি', 'পরীক্ষা', 'ফি', 'নোটিশ'][index] : topic.split(' ')[0])}><span>{[<LockKeyhole key="account" size={16} />, <Users key="students" size={16} />, <Activity key="attendance" size={16} />, <BookOpen key="exams" size={16} />, <CreditCard key="fees" size={16} />, <Megaphone key="notices" size={16} />][index]}</span>{language === 'bn' ? ['অ্যাকাউন্ট', 'শিক্ষার্থী', 'উপস্থিতি', 'পরীক্ষা', 'ফি', 'নোটিশ'][index] : topic}<ArrowRight size={14} /></button>)}</div><div className={styles.helpArticles}>{visible.map((article) => <article className={styles.helpArticle} key={article.title}><button type="button" onClick={() => setSelected(selected === article.title ? null : article.title)}><span><small>{article.category}</small><strong>{article.title}</strong></span><ChevronDown className={selected === article.title ? styles.chevronOpen : ''} size={17} /></button>{selected === article.title && <p>{article.detail}</p>}</article>)}{visible.length === 0 && <p className={styles.emptyState}>{language === 'bn' ? 'কোনো প্রবন্ধ মেলেনি। অন্য শব্দ দিয়ে চেষ্টা করুন।' : 'No articles found. Try a different search.'}</p>}</div></div><aside className={styles.sideCard}><span className={styles.helpAsideIcon}><CircleHelp size={20} /></span><h3>{language === 'bn' ? 'তবুও সাহায্য দরকার?' : 'Still need help?'}</h3><p>{language === 'bn' ? 'সাপোর্ট টিমের কাছে টিকিট পাঠান। আমরা সাধারণত কয়েক ঘণ্টার মধ্যে উত্তর দিই।' : 'Send a ticket to our support team. We usually reply within a few hours.'}</p><div className={styles.helpHours}><span>{language === 'bn' ? 'সহায়তার সময়' : 'Support hours'}</span><strong>{language === 'bn' ? 'রবি–বৃহস্পতি · ৯টা–৬টা' : 'Sun–Thu · 9 AM–6 PM'}</strong></div></aside></div>;
};

type FeeHead = { id: string; name: string; className: string; frequency: 'monthly' | 'term' | 'annual'; amount: number };

const FeeStructureWorkspace: React.FC<{ language: 'en' | 'bn' }> = ({ language }) => {
  const { showToast } = useApp();
  const [heads, setHeads] = useState<FeeHead[]>([
    { id: 'fee-1', name: 'Monthly tuition', className: 'All classes', frequency: 'monthly', amount: 2500 },
    { id: 'fee-2', name: 'Laboratory & practical', className: 'Class 9–12', frequency: 'monthly', amount: 500 },
    { id: 'fee-3', name: 'ICT & digital lab', className: 'Class 6–12', frequency: 'monthly', amount: 300 },
    { id: 'fee-4', name: 'Examination fee', className: 'All classes', frequency: 'term', amount: 1800 }
  ]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<FeeHead['frequency']>('monthly');
  const [className, setClassName] = useState('All classes');
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHeads((previous) => [{ id: `fee-${Date.now()}`, name: name.trim(), className, frequency, amount: Number(amount) }, ...previous]);
    setName('');
    setAmount('');
    showToast(language === 'bn' ? 'নতুন ফি খাত যোগ হয়েছে।' : 'Fee head added to the institute structure.', 'success');
  };
  return <div className={styles.mainColumn}>
    <div className={styles.usageGrid}><Metric icon={<CreditCard size={18} />} label={language === 'bn' ? 'ফি খাত' : 'Fee heads'} value={heads.length.toString()} note={language === 'bn' ? 'সক্রিয় কাঠামোতে' : 'Across active structures'} /><Metric icon={<Users size={18} />} label={language === 'bn' ? 'আবৃত শ্রেণি' : 'Classes covered'} value="12" note={language === 'bn' ? 'সব শ্রেণি ও শাখা' : 'Across all class groups'} /><Metric icon={<Activity size={18} />} label={language === 'bn' ? 'বিলিং চক্র' : 'Billing cycles'} value="3" note={language === 'bn' ? 'মাসিক, টার্ম, বার্ষিক' : 'Monthly, term, annual'} /></div>
    <div className={styles.panel}><PanelHeading title={language === 'bn' ? 'নতুন ফি খাত' : 'Add a fee head'} detail={language === 'bn' ? 'অর্থের পরিমাণ এবং কোন শ্রেণিতে প্রযোজ্য তা নির্ধারণ করুন' : 'Set the amount, frequency, and classes this fee applies to'} /><form className={styles.feeComposer} onSubmit={submit}><label className={styles.field}><span>{language === 'bn' ? 'ফি খাতের নাম' : 'Fee head name'}</span><input className="form-input" value={name} onChange={(event) => setName(event.target.value)} placeholder={language === 'bn' ? 'যেমন: বিজ্ঞানাগার ফি' : 'e.g. Science laboratory fee'} required /></label><label className={styles.field}><span>{language === 'bn' ? 'শ্রেণি' : 'Class'}</span><select className="form-select" value={className} onChange={(event) => setClassName(event.target.value)}><option>All classes</option><option>Class 6–8</option><option>Class 9–10</option><option>Class 11–12</option></select></label><label className={styles.field}><span>{language === 'bn' ? 'পরিশোধের সময়' : 'Frequency'}</span><select className="form-select" value={frequency} onChange={(event) => setFrequency(event.target.value as FeeHead['frequency'])}><option value="monthly">Monthly</option><option value="term">Per term</option><option value="annual">Annual</option></select></label><label className={styles.field}><span>{language === 'bn' ? 'পরিমাণ (৳)' : 'Amount (BDT)'}</span><input className="form-input" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" required /></label><button className="btn btn-primary" type="submit"><Plus size={15} />{language === 'bn' ? 'ফি যোগ করুন' : 'Add fee'}</button></form></div>
    <div className={styles.panel}><PanelHeading title={language === 'bn' ? 'সক্রিয় ফি কাঠামো' : 'Active fee structure'} detail={language === 'bn' ? 'শ্রেণিভিত্তিক ফি ও সংগ্রহের সময়সূচি' : 'Class-based fee heads and collection schedule'} /><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{language === 'bn' ? 'ফি খাত' : 'FEE HEAD'}</th><th>{language === 'bn' ? 'শ্রেণি' : 'CLASS'}</th><th>{language === 'bn' ? 'চক্র' : 'FREQUENCY'}</th><th>{language === 'bn' ? 'পরিমাণ' : 'AMOUNT'}</th><th>{language === 'bn' ? 'অবস্থা' : 'STATUS'}</th><th /></tr></thead><tbody>{heads.map((head) => <tr key={head.id}><td><strong>{head.name}</strong></td><td>{head.className}</td><td><span className={styles.rolePill}>{head.frequency}</span></td><td><strong>৳{head.amount.toLocaleString()}</strong></td><td><span className={`${styles.status} ${styles.statusGreen}`}><span />{language === 'bn' ? 'সক্রিয়' : 'Active'}</span></td><td><button className={styles.moreButton} type="button" onClick={() => { setHeads((previous) => previous.filter((item) => item.id !== head.id)); showToast(language === 'bn' ? 'ফি খাত সরানো হয়েছে।' : 'Fee head removed from the active structure.', 'info'); }} aria-label={language === 'bn' ? 'ফি খাত সরান' : 'Remove fee head'}>×</button></td></tr>)}</tbody></table></div></div>
  </div>;
};

const DuesWorkspace: React.FC<{ language: 'en' | 'bn' }> = ({ language }) => {
  const { invoices, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'partial' | 'overdue'>('all');
  const dueInvoices = invoices.filter((invoice) => invoice.status !== 'paid' && invoice.status !== 'waived');
  const visible = dueInvoices.filter((invoice) => (filter === 'all' || invoice.status === filter) && `${invoice.student_name} ${invoice.invoice_number} ${invoice.class_name}`.toLowerCase().includes(query.toLowerCase()));
  const totalDue = dueInvoices.reduce((sum, invoice) => sum + Math.max(invoice.total_amount - invoice.paid_amount - invoice.waiver_amount, 0), 0);
  return <div className={styles.mainColumn}><div className={styles.reportStats}><Metric icon={<CreditCard size={18} />} label={language === 'bn' ? 'মোট বকেয়া' : 'Outstanding balance'} value={`৳${totalDue.toLocaleString()}`} note={language === 'bn' ? 'সব বকেয়া চালান মিলিয়ে' : 'Across unpaid invoices'} accent="amber" /><Metric icon={<Users size={18} />} label={language === 'bn' ? 'পরিবার' : 'Families to follow up'} value={new Set(dueInvoices.map((item) => item.student_id)).size.toString()} note={language === 'bn' ? 'পেমেন্ট অনুস্মারক প্রয়োজন' : 'Have a balance to settle'} /><Metric icon={<Activity size={18} />} label={language === 'bn' ? 'আংশিক পরিশোধ' : 'Partial payments'} value={invoices.filter((invoice) => invoice.status === 'partial').length.toString()} note={language === 'bn' ? 'নতুন অনুস্মারক পাঠানো যাবে' : 'Can receive a balance reminder'} /></div><div className={styles.panel}><div className={styles.panelHeading}><div><h2>{language === 'bn' ? 'বকেয়া চালান' : 'Outstanding invoices'}</h2><p>{language === 'bn' ? 'শ্রেণি ও পরিশোধের অবস্থা অনুযায়ী' : 'Review by class and payment status'}</p></div><button className={styles.secondaryButton} type="button" onClick={() => showToast(language === 'bn' ? 'বকেয়া তালিকা ডাউনলোড হয়েছে।' : 'Dues report exported.', 'success')}><ArrowDownToLine size={14} />{language === 'bn' ? 'রপ্তানি' : 'Export report'}</button></div><SearchToolbar query={query} setQuery={setQuery} placeholder={language === 'bn' ? 'শিক্ষার্থী বা চালান খুঁজুন' : 'Search student or invoice'} /><div className={styles.filterChips}>{(['all', 'unpaid', 'partial', 'overdue'] as const).map((item) => <button type="button" key={item} className={filter === item ? styles.filterChipActive : ''} onClick={() => setFilter(item)}>{item === 'all' ? (language === 'bn' ? 'সব' : 'All') : item[0].toUpperCase() + item.slice(1)}</button>)}</div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{language === 'bn' ? 'শিক্ষার্থী' : 'STUDENT'}</th><th>{language === 'bn' ? 'চালান' : 'INVOICE'}</th><th>{language === 'bn' ? 'পরিশোধের শেষ তারিখ' : 'DUE DATE'}</th><th>{language === 'bn' ? 'বকেয়া' : 'BALANCE DUE'}</th><th>{language === 'bn' ? 'অবস্থা' : 'STATUS'}</th><th /></tr></thead><tbody>{visible.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.student_name}</strong><small>{invoice.class_name} · {invoice.section_name}</small></td><td>{invoice.invoice_number}</td><td>{invoice.due_date}</td><td><strong>৳{Math.max(invoice.total_amount - invoice.paid_amount - invoice.waiver_amount, 0).toLocaleString()}</strong></td><td><span className={`${styles.status} ${invoice.status === 'overdue' ? styles.statusOverdue : styles.statusPending}`}><span />{invoice.status}</span></td><td><button className={styles.remindButton} type="button" onClick={() => showToast(language === 'bn' ? `${invoice.student_name}-এর অভিভাবককে অনুস্মারক পাঠানো হয়েছে।` : `Payment reminder sent to ${invoice.student_name}'s guardian.`, 'success')}><Bell size={13} />{language === 'bn' ? 'অনুস্মারক' : 'Remind'}</button></td></tr>)}{visible.length === 0 && <EmptyRow message={language === 'bn' ? 'কোনো বকেয়া চালান মেলেনি।' : 'No outstanding invoices found.'} columns={6} />}</tbody></table></div></div></div>;
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string; note: string; accent?: 'amber' | 'green' }> = ({ icon, label, value, note, accent }) => <article className={styles.metricCard}><span className={`${styles.metricIcon} ${accent === 'amber' ? styles.metricAmber : accent === 'green' ? styles.metricGreen : ''}`}>{icon}</span><span className={styles.metricLabel}>{label}</span><strong className={styles.metricValue}>{value}</strong><span className={styles.metricNote}>{note}</span></article>;
const PanelHeading: React.FC<{ title: string; detail: string }> = ({ title, detail }) => <div className={styles.panelHeading}><div><h2>{title}</h2><p>{detail}</p></div></div>;
const SearchToolbar: React.FC<{ query: string; setQuery: (value: string) => void; placeholder: string }> = ({ query, setQuery, placeholder }) => <label className={styles.search}><Search size={16} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></label>;
const Person: React.FC<{ name: string; meta: string; initials: string }> = ({ name, meta, initials }) => <span className={styles.person}><span className={styles.avatar}>{initials}</span><span><strong>{name}</strong><small>{meta}</small></span></span>;
const Field: React.FC<{ label: string; value: string; wide?: boolean }> = ({ label, value, wide }) => <label className={`${styles.field} ${wide ? styles.fieldWide : ''}`}><span>{label}</span><input className="form-input" defaultValue={value} /></label>;
const EmptyRow: React.FC<{ message: string; columns: number }> = ({ message, columns }) => <tr><td colSpan={columns} className={styles.emptyCell}>{message}</td></tr>;
const roleLabel = (role: string) => role.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
