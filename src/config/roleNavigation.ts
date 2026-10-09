import type { ComponentType } from 'react';
import {
  Award,
  Building,
  Calendar,
  CalendarCheck,
  Clock,
  Contact,
  CreditCard,
  DollarSign,
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  LifeBuoy,
  Shield,
  Sparkles,
  Settings,
  Megaphone,
  KeyRound,
  Users,
  Library,
  Bus,
  BedDouble,
  Bell
} from 'lucide-react';
import type { RoleType } from '../types';
import { translations } from '../constants/translations';

type TranslationDictionary = typeof translations['en'];

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  badgeColor?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export interface NavigationCounts {
  pendingWaivers: number;
  openTickets: number;
  pendingAdminActions: number;
}

export const getNavItemsForRole = (
  role: RoleType,
  t: TranslationDictionary,
  counts: NavigationCounts
): NavItem[] => {
  const { pendingAdminActions, pendingWaivers, openTickets } = counts;

  switch (role) {
    case 'super_admin':
      return [
        { id: 'overview', label: t.nav_overview, icon: LayoutDashboard },
        { id: 'institutes', label: t.nav_institutes, icon: Building },
        { id: 'onboarding', label: t.nav_onboarding, icon: Building },
        { id: 'plans', label: t.nav_plans, icon: Shield },
        { id: 'billing', label: t.nav_cross_billing, icon: DollarSign },
        { id: 'support', label: t.nav_super_support, icon: LifeBuoy, ...(openTickets > 0 ? { badge: openTickets, badgeColor: 'amber' as const } : {}) },
        { id: 'audit_logs', label: t.nav_audit_logs, icon: History },
        { id: 'api_access', label: t.nav_api_access, icon: KeyRound },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'institute_admin':
      return [
        { id: 'overview', label: t.nav_overview, icon: LayoutDashboard },
        { id: 'admin_hub', label: t.nav_admin_hub, icon: Shield, ...(pendingAdminActions > 0 ? { badge: pendingAdminActions, badgeColor: 'red' as const } : {}) },
        { id: 'students', label: t.nav_students_ids, icon: Contact, badge: '482', badgeColor: 'blue' },
        { id: 'staff', label: t.nav_staff, icon: Users },
        { id: 'classes', label: t.nav_classes, icon: Building },
        { id: 'institute_setup', label: t.nav_institute_setup, icon: Settings },
        { id: 'routine', label: t.nav_routine_manager, icon: Calendar },
        { id: 'exam_builder', label: t.nav_exams_admit_cards, icon: Award },
        { id: 'results_publish', label: t.nav_results_verify_publish, icon: Sparkles },
        { id: 'billing', label: t.nav_billing_waivers, icon: CreditCard, ...(pendingWaivers > 0 ? { badge: pendingWaivers, badgeColor: 'red' as const } : {}) },
        { id: 'fee_structures', label: t.nav_fee_structure, icon: CreditCard },
        { id: 'grades', label: t.nav_academic_gradebook, icon: GraduationCap },
        { id: 'communications', label: t.nav_materials, icon: Megaphone },
        { id: 'library', label: t.nav_library, icon: Library },
        { id: 'transport', label: t.nav_transport, icon: Bus },
        { id: 'hostel', label: t.nav_hostel, icon: BedDouble },
        { id: 'subscription', label: t.nav_subscription, icon: CreditCard },
        { id: 'settings', label: t.accountSettings, icon: Settings },
        { id: 'support', label: t.nav_support, icon: LifeBuoy, ...(openTickets > 0 ? { badge: openTickets, badgeColor: 'purple' as const } : {}) },
        { id: 'audit_logs', label: t.nav_audit_logs, icon: History }
      ];

    case 'exam_controller':
      return [
        { id: 'exam_builder', label: t.nav_exam_builder, icon: Award },
        { id: 'admit_cards', label: t.nav_admit_cards, icon: FileText },
        { id: 'grades', label: t.nav_marks_verification, icon: GraduationCap },
        { id: 'results_publish', label: t.nav_results_publish, icon: Sparkles },
        { id: 'support', label: t.nav_support, icon: LifeBuoy },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'accountant':
      return [
        { id: 'billing', label: t.nav_invoicing, icon: CreditCard },
        { id: 'fee_structures', label: t.nav_fee_structure, icon: CreditCard },
        { id: 'dues_report', label: t.nav_dues_report, icon: DollarSign },
        { id: 'waiver_queue', label: t.nav_waiver_queue, icon: FileText, ...(pendingWaivers > 0 ? { badge: pendingWaivers, badgeColor: 'red' as const } : {}) },
        { id: 'payment_recon', label: t.nav_payment_recon, icon: DollarSign },
        { id: 'audit_logs', label: t.nav_audit_logs, icon: History },
        { id: 'support', label: t.nav_support, icon: LifeBuoy },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'class_teacher':
      return [
        { id: 'homeroom', label: t.nav_homeroom, icon: LayoutDashboard },
        { id: 'my_classes', label: t.nav_my_classes, icon: Building },
        { id: 'attendance_entry', label: t.nav_attendance_entry, icon: CalendarCheck },
        { id: 'grades', label: t.nav_mark_entry, icon: GraduationCap },
        { id: 'routine', label: t.nav_my_schedule, icon: Clock },
        { id: 'communications', label: t.nav_materials, icon: Megaphone },
        { id: 'students', label: t.nav_student_id_cards, icon: Contact },
        { id: 'support', label: t.nav_support, icon: LifeBuoy },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'teacher':
      return [
        { id: 'my_classes', label: t.nav_my_classes, icon: Building },
        { id: 'attendance_entry', label: t.nav_attendance_entry, icon: CalendarCheck },
        { id: 'grades', label: t.nav_mark_entry, icon: GraduationCap },
        { id: 'routine', label: t.nav_my_schedule, icon: Clock },
        { id: 'communications', label: t.nav_materials, icon: Megaphone },
        { id: 'support', label: t.nav_support, icon: LifeBuoy },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'student':
      return [
        { id: 'student_home', label: t.nav_student_home, icon: LayoutDashboard },
        { id: 'admit_cards', label: t.nav_student_admit, icon: Award },
        { id: 'grades', label: t.nav_student_grades, icon: GraduationCap },
        { id: 'attendance_entry', label: t.nav_student_attendance, icon: CalendarCheck },
        { id: 'billing', label: t.nav_student_fees, icon: CreditCard },
        { id: 'routine', label: t.nav_student_routine, icon: Clock },
        { id: 'communications', label: t.nav_materials, icon: Library },
        { id: 'id_cards', label: t.nav_my_id_card, icon: Contact },
        { id: 'support', label: t.nav_support, icon: LifeBuoy },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'guardian':
      return [
        { id: 'guardian_home', label: t.nav_guardian_home, icon: LayoutDashboard },
        { id: 'billing', label: t.nav_guardian_pay, icon: CreditCard },
        { id: 'attendance_entry', label: t.nav_guardian_attendance, icon: CalendarCheck },
        { id: 'grades', label: t.nav_guardian_grades, icon: GraduationCap },
        { id: 'admit_cards', label: t.nav_child_admit_card, icon: Award },
        { id: 'communications', label: t.nav_guardian_notifs, icon: Bell },
        { id: 'support', label: t.nav_support, icon: LifeBuoy },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'academic_director':
      return [
        { id: 'overview', label: t.nav_overview, icon: LayoutDashboard },
        { id: 'classes', label: t.nav_classes, icon: Building },
        { id: 'staff', label: t.nav_staff, icon: Users },
        { id: 'grades', label: t.nav_academic_gradebook, icon: GraduationCap },
        { id: 'routine', label: t.nav_routine_manager, icon: Calendar },
        { id: 'reports', label: t.nav_reports, icon: Sparkles },
        { id: 'communications', label: t.nav_materials, icon: Megaphone },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    case 'receptionist':
      return [
        { id: 'overview', label: t.nav_overview, icon: LayoutDashboard },
        { id: 'students', label: t.nav_students_ids, icon: Contact },
        { id: 'admissions', label: t.nav_admissions, icon: Users },
        { id: 'attendance_entry', label: t.nav_attendance_entry, icon: CalendarCheck },
        { id: 'communications', label: t.nav_materials, icon: Megaphone },
        { id: 'support', label: t.nav_support, icon: LifeBuoy },
        { id: 'settings', label: t.accountSettings, icon: Settings }
      ];

    default:
      return [];
  }
};
