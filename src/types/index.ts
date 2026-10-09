// AeroEdu v2.0 — Comprehensive Type Definitions
// Corresponds directly with PostgreSQL Schema in Docs/01-DATABASE-SCHEMA-DDL.md

export type RoleType =
  | 'super_admin'
  | 'institute_admin'
  | 'academic_director'
  | 'exam_controller'
  | 'accountant'
  | 'class_teacher'
  | 'teacher'
  | 'receptionist'
  | 'student'
  | 'guardian';

export type PlanTier = 'starter' | 'growth' | 'enterprise';

export type Language = 'en' | 'bn';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type ExamType = 'term' | 'quiz' | 'assignment' | 'board';

export type ExamStatus = 'draft' | 'scheduled' | 'marking' | 'locked' | 'published';

export type InvoiceStatus = 'draft' | 'unpaid' | 'partial' | 'paid' | 'waived' | 'overdue';

export type WaiverType = 'standard' | 'special';

export type WaiverBasis = 'merit' | 'sibling' | 'staff_child' | 'financial_hardship' | 'board_scholarship';

export type WaiverStatus = 'pending' | 'approved' | 'rejected';

export type PaymentMethod = 'bkash' | 'nagad' | 'sslcommerz' | 'bank_transfer' | 'cash';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export interface User {
  id: string;
  institute_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: RoleType;
  hierarchy_level: number;
  avatar_url?: string;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  mfa_enabled?: boolean;
  /** Page IDs returned by the authorization API for this user and institute. */
  accessible_pages?: string[];
  /** Action permissions returned by the API; UI checks only, server remains authoritative. */
  permissions?: string[];
}

export interface InstitutePaymentAccount {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch_name?: string;
  routing_number?: string;
  payment_method: 'bank_transfer' | 'bkash' | 'nagad';
  instructions?: string;
  is_active: boolean;
}

export interface Institute {
  id: string;
  name: string;
  name_bn?: string;
  slug: string;
  eiin: string;
  exam_board_id: string;
  exam_board_name: string;
  institute_type: 'school' | 'college' | 'madrasha' | 'coaching';
  status: 'trial' | 'active' | 'suspended';
  current_plan: PlanTier;
  logo_url?: string;
  seal_url?: string;
  signature_url?: string;
  primary_color: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  student_count: number;
  student_cap: number;
  staff_count: number;
  staff_cap: number;
  sms_sent_this_month: number;
  sms_cap: number;
  white_label_enabled: boolean;
  api_access_enabled: boolean;
  academic_year: string;
  payment_accounts?: InstitutePaymentAccount[];
  metadata?: Record<string, unknown>;
  entitlements?: Record<string, boolean | number | string>;
}

export interface AcademicClass {
  id: string;
  name: string;
  name_bn: string;
  code: string;
  sections_count: number;
  students_count: number;
}

export interface Section {
  id: string;
  class_id: string;
  class_name: string;
  name: string;
  room_number: string;
  capacity: number;
  enrolled: number;
  class_teacher_id: string;
  class_teacher_name: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  name_bn: string;
  is_optional: boolean;
  total_marks: number;
  pass_marks: number;
}

export interface ClassSubjectAssignment {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id?: string;
}

export interface Student {
  id: string;
  admission_no: string;
  full_name: string;
  full_name_bn: string;
  roll_number: number;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_relation: string;
  attendance_percentage: number;
  status: 'active' | 'transferred' | 'graduated' | 'suspended';
  avatar_url?: string;
  address: string;
  blood_group?: string;
}

export interface StaffMember {
  id: string;
  employee_id: string;
  full_name: string;
  full_name_bn: string;
  designation: string;
  department: string;
  role: RoleType;
  phone: string;
  email: string;
  blood_group: string;
  joining_date: string;
  emergency_contact: string;
  avatar_url?: string;
  is_class_teacher?: boolean;
  assigned_class?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  roll_number: number;
  section_id: string;
  record_date: string;
  status: AttendanceStatus;
  remarks?: string;
  marked_by: string;
  marked_at: string;
}

export interface Exam {
  id: string;
  name: string;
  name_bn: string;
  exam_type: ExamType;
  is_board_exam: boolean;
  board_name?: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  status: ExamStatus;
  classes: string[];
}

export interface ExamScheduleItem {
  id: string;
  exam_id: string;
  class_id: string;
  class_name: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_number: string;
  max_marks: number;
  invigilator_name: string;
}

export interface MarkEntry {
  id: string;
  student_id: string;
  student_name: string;
  roll_number: number;
  subject_id: string;
  subject_name: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  gpa: number;
  remarks?: string;
  entered_by: string;
  updated_at: string;
}

export interface SubjectScore {
  subject_code: string;
  subject_name: string;
  subject_name_bn: string;
  is_optional: boolean; // 4th subject
  full_marks: number;
  cq_marks: number; // Creative Questions / Written (Max 70, Pass 23)
  cq_pass: number;
  mcq_marks: number; // Multiple Choice (Max 30, Pass 10)
  mcq_pass: number;
  pr_marks?: number; // Practical Lab (Max 25, Pass 8)
  pr_pass?: number;
  ca_marks?: number; // Continuous Assessment
  total_marks: number;
  highest_marks: number;
  letter_grade: string;
  grade_point: number;
  is_passed: boolean;
}

export interface StudentAcademicResult {
  student_id: string;
  student_name: string;
  student_name_bn: string;
  roll_number: number;
  registration_number: string;
  class_name: string;
  section_name: string;
  exam_id: string;
  exam_name: string;
  scores: SubjectScore[];
  total_marks_obtained: number;
  total_max_marks: number;
  gpa_without_optional: number;
  gpa_with_optional: number;
  final_grade: string;
  merit_position: number;
  attendance_percentage: number;
  is_passed: boolean;
  teacher_remarks: string;
  conduct_rating: 'Exemplary' | 'Very Good' | 'Satisfactory' | 'Needs Improvement';
}

export interface AdmissionApplication {
  id: string;
  applicant_name: string;
  applicant_name_bn?: string;
  guardian_name: string;
  phone: string;
  target_class: string;
  target_group: string;
  previous_school: string;
  previous_gpa: number;
  submission_date: string;
  status: 'pending' | 'interview_scheduled' | 'approved' | 'rejected' | 'enrolled';
  application_fee_paid: boolean;
}

export interface TeacherLeaveRequest {
  id: string;
  teacher_id: string;
  teacher_name: string;
  department: string;
  leave_type: 'Casual' | 'Medical' | 'Maternity' | 'Official';
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  substitute_teacher_name: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BoardComplianceRecord {
  student_id: string;
  student_name: string;
  roll_number: number;
  reg_number: string;
  class_name: string;
  attendance_rate: number;
  pretest_gpa: number;
  is_eligible_for_board: boolean;
  ineligibility_reason?: string;
  fees_cleared: boolean;
}

export interface AdmitCard {
  id: string;
  exam_id: string;
  exam_name: string;
  student_id: string;
  student_name: string;
  student_name_bn: string;
  roll_number: number;
  registration_number?: string;
  class_name: string;
  section_name: string;
  exam_center: string;
  institute_name: string;
  eiin: string;
  schedules: {
    subject_code: string;
    subject_name: string;
    exam_date: string;
    exam_time: string;
    room_number: string;
  }[];
  generated_date: string;
  signatory_title: string;
}

export interface FeeStructure {
  id: string;
  class_id?: string;
  class_name: string;
  fee_head: string;
  frequency: 'monthly' | 'term' | 'annual' | 'one_time';
  amount: number;
  due_day_of_month: number;
}

export interface InvoiceItem {
  id: string;
  fee_head: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  student_id: string;
  student_name: string;
  roll_number: number;
  class_name: string;
  section_name: string;
  period_label: string;
  total_amount: number;
  paid_amount: number;
  waiver_amount: number;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
  items: InvoiceItem[];
}

export interface FeeWaiverRequest {
  id: string;
  invoice_id: string;
  invoice_number: string;
  student_id: string;
  student_name: string;
  class_name: string;
  original_amount: number;
  waiver_type: WaiverType;
  waiver_basis: WaiverBasis;
  percentage?: number;
  fixed_amount?: number;
  reason: string;
  status: WaiverStatus;
  requested_by: string;
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

export interface PaymentTransaction {
  id: string;
  invoice_id: string;
  invoice_number: string;
  student_name: string;
  amount: number;
  method: PaymentMethod;
  transaction_id: string;
  status: 'successful' | 'pending' | 'failed';
  reconciled: boolean;
  reconciled_at?: string;
  created_at: string;
}

export interface RoutineItem {
  id: string;
  day_of_week: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period_number: number;
  start_time: string;
  end_time: string;
  class_name: string;
  section_name: string;
  subject_name: string;
  teacher_name: string;
  room_number: string;
}

export interface Announcement {
  id: string;
  title: string;
  title_bn?: string;
  content: string;
  content_bn?: string;
  target_audience: 'all' | 'teachers' | 'students' | 'guardians' | 'section';
  section_id?: string;
  author_name: string;
  author_role: string;
  created_at: string;
  is_pinned?: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject_name: string;
  class_name: string;
  section_name: string;
  description: string;
  file_name: string;
  file_size: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
  download_url: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_label?: string;
  ip_address: string;
  user_agent: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  anomaly_flag: boolean;
  anomaly_reason?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: 'insert' | 'update' | 'delete';
  actor_name: string;
  actor_role: string;
  diff: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  user_role: string;
  institute_id: string;
  institute_name: string;
  category: 'billing' | 'academic' | 'technical' | 'admit_card' | 'account';
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  sla_target_response_hours: number;
  sla_breached: boolean;
  created_at: string;
  updated_at: string;
  csat_rating?: number;
  messages: {
    id: string;
    sender_name: string;
    sender_role: 'user' | 'support_agent' | 'system';
    message: string;
    created_at: string;
    attachments?: string[];
  }[];
}

export interface KnowledgeArticle {
  id: string;
  category: string;
  title_en: string;
  title_bn: string;
  content_en: string;
  content_bn: string;
  helpful_count: number;
  tags: string[];
}

export interface LoginHistoryItem {
  id: string;
  user_id: string;
  login_time: string;
  ip_address: string;
  device: string;
  browser: string;
  location: string;
  is_new_device: boolean;
  success: boolean;
}
