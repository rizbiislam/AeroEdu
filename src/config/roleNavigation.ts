import type { ComponentType } from 'react';
import {
  Award, BedDouble, Building, Bus, Calendar, CalendarCheck,
  Contact, CreditCard, DollarSign, FileText, GraduationCap, History,
  KeyRound, LayoutDashboard, Library, LifeBuoy, Megaphone, Settings, Shield, UserCog,
  Sparkles, Users
} from 'lucide-react';
import type { RoleType } from '../types';
import { translations } from '../constants/translations';

type TranslationDictionary = typeof translations['en'];
type PageDefinition = { id: string; label: (t: TranslationDictionary) => string; icon: ComponentType<{ size?: number; className?: string }> };

export interface NavItem {
  id: string;
  pageId: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

// UI metadata is separate from access. In production the API returns accessible page IDs;
// these role maps only simulate that response in the local preview.
const pageCatalog: PageDefinition[] = [
  { id: 'overview', label: (t) => t.nav_overview, icon: LayoutDashboard },
  { id: 'institutes', label: (t) => t.nav_institutes, icon: Building },
  { id: 'onboarding', label: (t) => t.nav_onboarding, icon: Building },
  { id: 'plans', label: (t) => t.nav_plans, icon: Shield },
  { id: 'admin_hub', label: (t) => t.nav_admin_hub, icon: Shield },
  { id: 'students', label: (t) => t.nav_students_ids, icon: Contact },
  { id: 'admissions', label: (t) => t.nav_admissions, icon: Users },
  { id: 'staff', label: (t) => t.nav_staff, icon: Users },
  { id: 'classes', label: (t) => t.nav_classes, icon: Building },
  { id: 'institute_setup', label: (t) => t.nav_institute_setup, icon: Settings },
  { id: 'role_access', label: (t) => t.nav_role_access, icon: UserCog },
  { id: 'routine', label: (t) => t.nav_routine_manager, icon: Calendar },
  { id: 'exam_builder', label: (t) => t.nav_exam_builder, icon: Award },
  { id: 'admit_cards', label: (t) => t.nav_admit_cards, icon: FileText },
  { id: 'results_publish', label: (t) => t.nav_results_publish, icon: Sparkles },
  { id: 'billing', label: (t) => t.nav_billing_waivers, icon: CreditCard },
  { id: 'fee_structures', label: (t) => t.nav_fee_structure, icon: CreditCard },
  { id: 'waiver_queue', label: (t) => t.nav_waiver_queue, icon: FileText },
  { id: 'payment_recon', label: (t) => t.nav_payment_recon, icon: DollarSign },
  { id: 'dues_report', label: (t) => t.nav_dues_report, icon: DollarSign },
  { id: 'grades', label: (t) => t.nav_academic_gradebook, icon: GraduationCap },
  { id: 'communications', label: (t) => t.nav_materials, icon: Megaphone },
  { id: 'library', label: (t) => t.nav_library, icon: Library },
  { id: 'transport', label: (t) => t.nav_transport, icon: Bus },
  { id: 'hostel', label: (t) => t.nav_hostel, icon: BedDouble },
  { id: 'subscription', label: (t) => t.nav_subscription, icon: CreditCard },
  { id: 'reports', label: (t) => t.nav_reports, icon: Sparkles },
  { id: 'api_access', label: (t) => t.nav_api_access, icon: KeyRound },
  { id: 'support', label: (t) => t.nav_support, icon: LifeBuoy },
  { id: 'audit_logs', label: (t) => t.nav_audit_logs, icon: History },
  { id: 'settings', label: (t) => t.accountSettings, icon: Settings },
  { id: 'homeroom', label: (t) => t.nav_homeroom, icon: LayoutDashboard },
  { id: 'my_classes', label: (t) => t.nav_my_classes, icon: Building },
  { id: 'attendance_entry', label: (t) => t.nav_attendance_entry, icon: CalendarCheck },
  { id: 'student_home', label: (t) => t.nav_student_home, icon: LayoutDashboard },
  { id: 'id_cards', label: (t) => t.nav_my_id_card, icon: Contact },
  { id: 'guardian_home', label: (t) => t.nav_guardian_home, icon: LayoutDashboard },
  { id: 'knowledge_base', label: (t) => t.nav_kb, icon: LifeBuoy }
];

// Stable authorization identifiers are independent from frontend route names.
const pageIdByRoute: Readonly<Record<string, string>> = {
  overview: 'dashboard.overview', institutes: 'institutes.list', onboarding: 'institutes.onboard', plans: 'subscriptions.plans', role_access: 'users.roles',
  admin_hub: 'governance.dashboard', students: 'students.list', admissions: 'admissions.list', staff: 'staff.list',
  classes: 'academic.classes', institute_setup: 'institute.settings', routine: 'timetable.manage', exam_builder: 'exams.assessments',
  admit_cards: 'exams.admit_cards', results_publish: 'exams.results.publish', billing: 'billing.invoices', fee_structures: 'billing.fee_structures',
  waiver_queue: 'billing.waivers', payment_recon: 'billing.reconciliation', dues_report: 'billing.dues_report', grades: 'exams.grades',
  communications: 'communications.announcements', library: 'library.dashboard', transport: 'transport.dashboard', hostel: 'hostel.dashboard',
  subscription: 'subscriptions.current', reports: 'reports.dashboard', api_access: 'platform.api_access', support: 'support.tickets',
  audit_logs: 'audit.logs', settings: 'users.settings', homeroom: 'classes.homeroom', my_classes: 'classes.assigned',
  attendance_entry: 'attendance.records', student_home: 'portal.student_home', id_cards: 'students.id_card', guardian_home: 'portal.guardian_home',
  knowledge_base: 'support.knowledge_base'
};

const rolePageLabels: Partial<Record<RoleType, Record<string, keyof TranslationDictionary>>> = {
  student: { admit_cards: 'nav_student_admit', grades: 'nav_student_grades', attendance_entry: 'nav_student_attendance', billing: 'nav_student_fees', routine: 'nav_student_routine' },
  guardian: { billing: 'nav_guardian_pay', attendance_entry: 'nav_guardian_attendance', grades: 'nav_guardian_grades', admit_cards: 'nav_child_admit_card', communications: 'nav_guardian_notifs' },
  accountant: { billing: 'nav_invoicing', waiver_queue: 'nav_waiver_request' },
  class_teacher: { students: 'nav_student_id_cards', grades: 'nav_mark_entry', routine: 'nav_my_schedule' },
  teacher: { grades: 'nav_mark_entry', routine: 'nav_my_schedule' },
  exam_controller: { grades: 'nav_marks_verification', results_publish: 'nav_results_publish', admit_cards: 'nav_admit_cards' }
};

const demoAccessiblePages: Record<RoleType, readonly string[]> = {
  super_admin: ['overview', 'institutes', 'onboarding', 'plans', 'billing', 'support', 'audit_logs', 'api_access', 'settings'],
  institute_admin: ['overview', 'admin_hub', 'students', 'staff', 'classes', 'institute_setup', 'role_access', 'routine', 'exam_builder', 'admit_cards', 'results_publish', 'billing', 'fee_structures', 'grades', 'communications', 'library', 'transport', 'hostel', 'subscription', 'support', 'audit_logs', 'settings'],
  academic_director: ['overview', 'classes', 'staff', 'grades', 'routine', 'reports', 'communications', 'settings'],
  exam_controller: ['exam_builder', 'admit_cards', 'grades', 'results_publish', 'support', 'settings'],
  accountant: ['billing', 'fee_structures', 'dues_report', 'waiver_queue', 'payment_recon', 'audit_logs', 'support', 'settings'],
  class_teacher: ['homeroom', 'my_classes', 'attendance_entry', 'grades', 'routine', 'communications', 'students', 'support', 'settings'],
  teacher: ['my_classes', 'attendance_entry', 'grades', 'routine', 'communications', 'support', 'settings'],
  receptionist: ['overview', 'students', 'admissions', 'support', 'settings'],
  student: ['student_home', 'admit_cards', 'grades', 'attendance_entry', 'billing', 'routine', 'communications', 'id_cards', 'support', 'settings'],
  guardian: ['guardian_home', 'billing', 'attendance_entry', 'grades', 'admit_cards', 'communications', 'support', 'settings']
};

export const getNavigationForPages = (pageIds: readonly string[], t: TranslationDictionary, role?: RoleType): NavItem[] => {
  const allowed = new Set(pageIds);
  return pageCatalog.filter((page) => allowed.has(pageIdByRoute[page.id] ?? page.id)).sort((left, right) => pageIds.indexOf(pageIdByRoute[left.id] ?? left.id) - pageIds.indexOf(pageIdByRoute[right.id] ?? right.id)).map((page) => ({
    id: page.id,
    pageId: pageIdByRoute[page.id] ?? page.id,
    label: role && rolePageLabels[role]?.[page.id] ? t[rolePageLabels[role][page.id]!] : page.label(t),
    icon: page.icon
  }));
};

export const getDemoNavigationForRole = (role: RoleType): readonly string[] =>
  [...demoAccessiblePages[role].map((routeId) => pageIdByRoute[routeId] ?? routeId), pageIdByRoute.knowledge_base];

export const getNavItemsForRole = (role: RoleType, t: TranslationDictionary): NavItem[] =>
  getNavigationForPages(getDemoNavigationForRole(role), t, role);
