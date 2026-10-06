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
  Sparkles
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
        { id: 'billing', label: t.nav_cross_billing, icon: DollarSign },
        { id: 'support', label: t.nav_super_support, icon: LifeBuoy, ...(openTickets > 0 ? { badge: openTickets, badgeColor: 'amber' as const } : {}) },
        { id: 'audit_logs', label: t.nav_audit_logs, icon: History }
      ];

    case 'institute_admin':
      return [
        { id: 'overview', label: t.nav_overview, icon: LayoutDashboard },
        { id: 'admin_hub', label: t.nav_admin_hub, icon: Shield, ...(pendingAdminActions > 0 ? { badge: pendingAdminActions, badgeColor: 'red' as const } : {}) },
        { id: 'students', label: t.nav_students_ids, icon: Contact, badge: '482', badgeColor: 'blue' },
        { id: 'routine', label: t.nav_routine_manager, icon: Calendar },
        { id: 'exam_builder', label: t.nav_exams_admit_cards, icon: Award },
        { id: 'results_publish', label: t.nav_results_verify_publish, icon: Sparkles },
        { id: 'billing', label: t.nav_billing_waivers, icon: CreditCard, ...(pendingWaivers > 0 ? { badge: pendingWaivers, badgeColor: 'red' as const } : {}) },
        { id: 'grades', label: t.nav_academic_gradebook, icon: GraduationCap },
        { id: 'support', label: t.nav_support, icon: LifeBuoy, ...(openTickets > 0 ? { badge: openTickets, badgeColor: 'purple' as const } : {}) },
        { id: 'audit_logs', label: t.nav_audit_logs, icon: History }
      ];

    case 'exam_controller':
      return [
        { id: 'exam_builder', label: t.nav_exam_builder, icon: Award },
        { id: 'admit_cards', label: t.nav_admit_cards, icon: FileText },
        { id: 'grades', label: t.nav_marks_verification, icon: GraduationCap },
        { id: 'results_publish', label: t.nav_results_publish, icon: Sparkles },
        { id: 'support', label: t.nav_support, icon: LifeBuoy }
      ];

    case 'accountant':
      return [
        { id: 'billing', label: t.nav_invoicing, icon: CreditCard },
        { id: 'waiver_queue', label: t.nav_waiver_queue, icon: FileText, ...(pendingWaivers > 0 ? { badge: pendingWaivers, badgeColor: 'red' as const } : {}) },
        { id: 'payment_recon', label: t.nav_payment_recon, icon: DollarSign },
        { id: 'audit_logs', label: t.nav_audit_logs, icon: History },
        { id: 'support', label: t.nav_support, icon: LifeBuoy }
      ];

    case 'class_teacher':
      return [
        { id: 'attendance_entry', label: t.nav_attendance_entry, icon: CalendarCheck },
        { id: 'grades', label: t.nav_mark_entry, icon: GraduationCap },
        { id: 'routine', label: t.nav_my_schedule, icon: Clock },
        { id: 'students', label: t.nav_student_id_cards, icon: Contact },
        { id: 'support', label: t.nav_support, icon: LifeBuoy }
      ];

    case 'teacher':
      return [
        { id: 'attendance_entry', label: t.nav_attendance_entry, icon: CalendarCheck },
        { id: 'grades', label: t.nav_mark_entry, icon: GraduationCap },
        { id: 'routine', label: t.nav_my_schedule, icon: Clock },
        { id: 'support', label: t.nav_support, icon: LifeBuoy }
      ];

    case 'student':
      return [
        { id: 'student_home', label: t.nav_student_home, icon: LayoutDashboard },
        { id: 'admit_cards', label: t.nav_student_admit, icon: Award },
        { id: 'grades', label: t.nav_student_grades, icon: GraduationCap },
        { id: 'attendance_entry', label: t.nav_student_attendance, icon: CalendarCheck },
        { id: 'billing', label: t.nav_student_fees, icon: CreditCard },
        { id: 'routine', label: t.nav_student_routine, icon: Clock },
        { id: 'id_cards', label: t.nav_my_id_card, icon: Contact },
        { id: 'support', label: t.nav_support, icon: LifeBuoy }
      ];

    case 'guardian':
      return [
        { id: 'guardian_home', label: t.nav_guardian_home, icon: LayoutDashboard },
        { id: 'billing', label: t.nav_guardian_pay, icon: CreditCard },
        { id: 'attendance_entry', label: t.nav_guardian_attendance, icon: CalendarCheck },
        { id: 'grades', label: t.nav_guardian_grades, icon: GraduationCap },
        { id: 'admit_cards', label: t.nav_child_admit_card, icon: Award },
        { id: 'support', label: t.nav_support, icon: LifeBuoy }
      ];

    default:
      return [];
  }
};
