import type { 
  Institute, User, Student, StaffMember, AcademicClass, Section, Subject, ClassSubjectAssignment, Exam, 
  ExamScheduleItem, AdmitCard, MarkEntry, FeeStructure, Invoice, 
  FeeWaiverRequest, PaymentTransaction, RoutineItem, Announcement, 
  StudyMaterial, AuditLog, SupportTicket, KnowledgeArticle, LoginHistoryItem,
  StudentAcademicResult, AdmissionApplication, TeacherLeaveRequest, BoardComplianceRecord
} from '../types';

export const mockInstitutes: Institute[] = [
  {
    id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    name: "Dhaka National Model Academy",
    name_bn: "ঢাকা ন্যাশনাল মডেল একাডেমি",
    slug: "dhaka-model",
    eiin: "108456",
    exam_board_id: "board-dhaka",
    exam_board_name: "Board of Intermediate and Secondary Education, Dhaka",
    institute_type: "school",
    status: "active",
    current_plan: "enterprise",
    primary_color: "#2563eb",
    address: "Plot 14, Road 4, Sector 7, Uttara, Dhaka-1230",
    contact_email: "principal@dhakamodel.edu.bd",
    contact_phone: "+880 1711-234567",
    student_count: 482,
    student_cap: 2000,
    staff_count: 34,
    staff_cap: 100,
    sms_sent_this_month: 8450,
    sms_cap: 10000,
    white_label_enabled: true,
    api_access_enabled: true,
    academic_year: "2026-2027",
    payment_accounts: [
      { id: 'acct-1', bank_name: 'Dutch-Bangla Bank PLC', account_name: 'Dhaka National Model Academy', account_number: '105.123.45678', branch_name: 'Uttara Branch', routing_number: '090264634', payment_method: 'bank_transfer', instructions: 'Use student ID as payment reference.', is_active: true },
      { id: 'acct-2', bank_name: 'bKash', account_name: 'Dhaka National Model Academy', account_number: '01700000000', payment_method: 'bkash', instructions: 'Send money and include student ID in reference.', is_active: true }
    ],
    seal_url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&auto=format&fit=crop&q=80",
    signature_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "c7a8b9c0-1234-5678-9abc-def012345678",
    name: "Chittagong Grammar School & College",
    name_bn: "চট্টগ্রাম গ্রামার স্কুল ও কলেজ",
    slug: "cgs-ctg",
    eiin: "104321",
    exam_board_id: "board-ctg",
    exam_board_name: "Board of Intermediate and Secondary Education, Chattogram",
    institute_type: "college",
    status: "active",
    current_plan: "growth",
    primary_color: "#059669",
    address: "Nasirabad Housing Society, Chattogram",
    contact_email: "info@cgs.edu.bd",
    contact_phone: "+880 1819-876543",
    student_count: 850,
    student_cap: 2000,
    staff_count: 52,
    staff_cap: 100,
    sms_sent_this_month: 4200,
    sms_cap: 5000,
    white_label_enabled: false,
    api_access_enabled: false,
    academic_year: "2026-2027",
    payment_accounts: [
      { id: 'acct-3', bank_name: 'Sonali Bank PLC', account_name: 'Chittagong Grammar School & College', account_number: '220.987.654321', branch_name: 'Nasirabad Branch', payment_method: 'bank_transfer', instructions: 'Include student ID in the transfer note.', is_active: true }
    ]
  },
  {
    id: "d1e2f3a4-5678-90ab-cdef-1234567890ab",
    name: "Sylhet Scholars Academy",
    name_bn: "সিলেট স্কলার্স একাডেমি",
    slug: "sylhet-scholars",
    eiin: "109876",
    exam_board_id: "board-sylhet",
    exam_board_name: "Board of Intermediate and Secondary Education, Sylhet",
    institute_type: "school",
    status: "trial",
    current_plan: "starter",
    primary_color: "#7c3aed",
    address: "Subidbazar, Sylhet",
    contact_email: "admin@scholars.edu.bd",
    contact_phone: "+880 1912-345678",
    student_count: 240,
    student_cap: 300,
    staff_count: 14,
    staff_cap: 15,
    sms_sent_this_month: 200,
    sms_cap: 500,
    white_label_enabled: false,
    api_access_enabled: false,
    academic_year: "2026-2027",
    payment_accounts: []
  }
];

export const mockUsers: Record<string, User> = {
  super_admin: {
    id: "usr-super-001",
    institute_id: "",
    full_name: "AeroEdu System Lead",
    email: "ops@aeroedu.app",
    role: "super_admin",
    hierarchy_level: 100,
    status: "active",
    created_at: "2025-01-15T00:00:00Z",
    mfa_enabled: true
  },
  institute_admin: {
    id: "usr-admin-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Dr. Rafiqul Islam (Principal)",
    email: "admin@dhakamodel.edu.bd",
    phone: "+880 1711-234567",
    role: "institute_admin",
    hierarchy_level: 90,
    status: "active",
    created_at: "2025-02-01T00:00:00Z",
    mfa_enabled: true
  },
  institute_admin_growth: {
    id: "usr-admin-growth-001",
    institute_id: "c7a8b9c0-1234-5678-9abc-def012345678",
    full_name: "Dr. Farhana Rahman (Institute Admin)",
    email: "admin@cgs.edu.bd",
    role: "institute_admin",
    hierarchy_level: 90,
    status: "active",
    created_at: "2025-02-01T00:00:00Z",
    mfa_enabled: true
  },
  institute_admin_starter: {
    id: "usr-admin-starter-001",
    institute_id: "d1e2f3a4-5678-90ab-cdef-1234567890ab",
    full_name: "Ms. Ayesha Karim (Institute Admin)",
    email: "admin@scholars.edu.bd",
    role: "institute_admin",
    hierarchy_level: 90,
    status: "active",
    created_at: "2025-02-01T00:00:00Z",
    mfa_enabled: true
  },
  academic_director: {
    id: "usr-director-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Prof. Nusrat Jahan (Academic Director)",
    email: "director@dhakamodel.edu.bd",
    phone: "+880 1713-222333",
    role: "academic_director",
    hierarchy_level: 80,
    status: "active",
    created_at: "2025-02-03T00:00:00Z",
    mfa_enabled: false
  },
  exam_controller: {
    id: "usr-exam-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Mahbubur Rahman (Exam Controller)",
    email: "exams@dhakamodel.edu.bd",
    phone: "+880 1819-345678",
    role: "exam_controller",
    hierarchy_level: 70,
    status: "active",
    created_at: "2025-02-05T00:00:00Z",
    mfa_enabled: true
  },
  accountant: {
    id: "usr-acc-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Kamrul Hasan CPA (Accountant)",
    email: "accountant@dhakamodel.edu.bd",
    phone: "+880 1712-987654",
    role: "accountant",
    hierarchy_level: 70,
    status: "active",
    created_at: "2025-02-10T00:00:00Z",
    mfa_enabled: false
  },
  class_teacher: {
    id: "usr-ct-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Fatema Begum (Class Teacher 10-A)",
    email: "classteacher@dhakamodel.edu.bd",
    phone: "+880 1913-456789",
    role: "class_teacher",
    hierarchy_level: 50,
    status: "active",
    created_at: "2025-02-15T00:00:00Z",
    mfa_enabled: false
  },
  teacher: {
    id: "usr-t-002",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Tanvir Ahmed (Senior Math Teacher)",
    email: "teacher@dhakamodel.edu.bd",
    phone: "+880 1614-567890",
    role: "teacher",
    hierarchy_level: 40,
    status: "active",
    created_at: "2025-02-18T00:00:00Z",
    mfa_enabled: false
  },
  receptionist: {
    id: "usr-reception-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Sadia Akhter (Receptionist)",
    email: "reception@dhakamodel.edu.bd",
    phone: "+880 1714-111222",
    role: "receptionist",
    hierarchy_level: 30,
    status: "active",
    created_at: "2025-02-20T00:00:00Z",
    mfa_enabled: false
  },
  student: {
    id: "usr-stu-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Ahmed Sifat (Student)",
    email: "student@dhakamodel.edu.bd",
    phone: "+880 1515-678901",
    role: "student",
    hierarchy_level: 10,
    status: "active",
    created_at: "2025-03-01T00:00:00Z",
    mfa_enabled: false
  },
  guardian: {
    id: "usr-gdn-001",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    full_name: "Mohammad Faruk (Guardian)",
    email: "guardian@dhakamodel.edu.bd",
    phone: "+880 1711-998877",
    role: "guardian",
    hierarchy_level: 10,
    status: "active",
    created_at: "2025-03-01T00:00:00Z",
    mfa_enabled: false
  }
};

export const mockStaff: StaffMember[] = [
  {
    id: "stf-001",
    employee_id: "EMP-001",
    full_name: "Dr. Rafiqul Islam",
    full_name_bn: "ড. রফিকুল ইসলাম",
    designation: "Principal & Head of Institution",
    department: "Executive Management",
    role: "institute_admin",
    phone: "+880 1711-234567",
    email: "principal@dhakamodel.edu.bd",
    blood_group: "O+",
    joining_date: "2018-01-01",
    emergency_contact: "+880 1711-998800",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stf-002",
    employee_id: "EMP-014",
    full_name: "Fatema Begum",
    full_name_bn: "ফাতেমা বেগম",
    designation: "Senior Class Teacher & Physics Lead",
    department: "Department of Science",
    role: "class_teacher",
    phone: "+880 1713-123456",
    email: "fatema.physics@dhakamodel.edu.bd",
    blood_group: "A+",
    joining_date: "2019-03-15",
    emergency_contact: "+880 1712-445566",
    is_class_teacher: true,
    assigned_class: "Class 10 — Section A",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stf-003",
    employee_id: "EMP-005",
    full_name: "Mahbubur Rahman",
    full_name_bn: "মাহবুবুর রহমান",
    designation: "Controller of Examinations & Math Faculty",
    department: "Examination & Assessment Council",
    role: "exam_controller",
    phone: "+880 1819-345678",
    email: "exams@dhakamodel.edu.bd",
    blood_group: "B+",
    joining_date: "2017-08-01",
    emergency_contact: "+880 1819-001122",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stf-004",
    employee_id: "EMP-008",
    full_name: "Kamrul Hasan CPA",
    full_name_bn: "কামরুল হাসান সি.পি.এ",
    designation: "Chief Accountant & Bursar",
    department: "Finance & Accounts",
    role: "accountant",
    phone: "+880 1712-987654",
    email: "bursar@dhakamodel.edu.bd",
    blood_group: "AB+",
    joining_date: "2020-01-10",
    emergency_contact: "+880 1712-778899",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stf-005",
    employee_id: "EMP-021",
    full_name: "Tanvir Ahmed",
    full_name_bn: "তানভীর আহমেদ",
    designation: "Senior Mathematics Lecturer",
    department: "Department of Science",
    role: "teacher",
    phone: "+880 1714-556677",
    email: "tanvir.math@dhakamodel.edu.bd",
    blood_group: "O-",
    joining_date: "2021-02-01",
    emergency_contact: "+880 1714-332211",
    is_class_teacher: true,
    assigned_class: "Class 10 — Section B",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stf-006",
    employee_id: "EMP-018",
    full_name: "Sadia Akhter",
    full_name_bn: "সাদিয়া আক্তার",
    designation: "Senior Lecturer in Bangla Language",
    department: "Department of Humanities",
    role: "teacher",
    phone: "+880 1716-112233",
    email: "sadia.bangla@dhakamodel.edu.bd",
    blood_group: "A+",
    joining_date: "2019-09-01",
    emergency_contact: "+880 1716-445566",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "stf-007",
    employee_id: "EMP-030",
    full_name: "Kazi Nurul Islam",
    full_name_bn: "কাজী নুরুল ইসলাম",
    designation: "Chemistry Laboratory Coordinator & Lecturer",
    department: "Department of Science",
    role: "teacher",
    phone: "+880 1717-990011",
    email: "nurul.chem@dhakamodel.edu.bd",
    blood_group: "B+",
    joining_date: "2022-04-15",
    emergency_contact: "+880 1717-223344",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80"
  }
];

export const mockClasses: AcademicClass[] = [
  { id: "cls-09", name: "Class 9", name_bn: "৯ম শ্রেণি", code: "CLS-09", sections_count: 2, students_count: 92 },
  { id: "cls-10", name: "Class 10", name_bn: "১০ম শ্রেণি", code: "CLS-10", sections_count: 2, students_count: 98 },
  { id: "cls-11", name: "Class 11 (Science)", name_bn: "১১শ শ্রেণি (বিজ্ঞান)", code: "CLS-11-SCI", sections_count: 1, students_count: 45 },
  { id: "cls-12", name: "Class 12 (Science)", name_bn: "১২শ শ্রেণি (বিজ্ঞান)", code: "CLS-12-SCI", sections_count: 1, students_count: 42 }
];

export const mockSections: Section[] = [
  {
    id: "sec-10a",
    class_id: "cls-10",
    class_name: "Class 10",
    name: "Section A (Padma)",
    room_number: "Room 302",
    capacity: 50,
    enrolled: 48,
    class_teacher_id: "usr-ct-001",
    class_teacher_name: "Fatema Begum"
  },
  {
    id: "sec-10b",
    class_id: "cls-10",
    class_name: "Class 10",
    name: "Section B (Meghna)",
    room_number: "Room 304",
    capacity: 50,
    enrolled: 50,
    class_teacher_id: "usr-t-002",
    class_teacher_name: "Tanvir Ahmed"
  }
];

export const mockSubjects: Subject[] = [
  { id: "sub-101", code: "101", name: "Bangla 1st Paper", name_bn: "বাংলা ১ম পত্র", is_optional: false, total_marks: 100, pass_marks: 33 },
  { id: "sub-107", code: "107", name: "English 1st Paper", name_bn: "ইংরেজি ১ম পত্র", is_optional: false, total_marks: 100, pass_marks: 33 },
  { id: "sub-109", code: "109", name: "General Mathematics", name_bn: "সাধারণ গণিত", is_optional: false, total_marks: 100, pass_marks: 33 },
  { id: "sub-136", code: "136", name: "Physics", name_bn: "পদার্থবিজ্ঞান", is_optional: false, total_marks: 100, pass_marks: 33 },
  { id: "sub-137", code: "137", name: "Chemistry", name_bn: "রসায়ন", is_optional: false, total_marks: 100, pass_marks: 33 },
  { id: "sub-138", code: "138", name: "Biology", name_bn: "জীববিজ্ঞান", is_optional: false, total_marks: 100, pass_marks: 33 },
  { id: "sub-154", code: "154", name: "Information & Communication Tech", name_bn: "তথ্য ও যোগাযোগ প্রযুক্তি", is_optional: false, total_marks: 50, pass_marks: 17 }
];

// Preview fixture for class-subject enrollment. Production will load these mappings from the academic API.
export const mockClassSubjects: ClassSubjectAssignment[] = [
  ...['sub-101', 'sub-107', 'sub-109'].map((subject_id) => ({ id: `cs-cls09-${subject_id}`, class_id: 'cls-09', subject_id })),
  ...['sub-101', 'sub-107', 'sub-109', 'sub-136', 'sub-137', 'sub-138', 'sub-154'].map((subject_id) => ({ id: `cs-cls10-${subject_id}`, class_id: 'cls-10', subject_id })),
  ...['sub-101', 'sub-107', 'sub-109', 'sub-136', 'sub-137', 'sub-138', 'sub-154'].map((subject_id) => ({ id: `cs-cls11-${subject_id}`, class_id: 'cls-11', subject_id })),
  ...['sub-101', 'sub-107', 'sub-109', 'sub-136', 'sub-137', 'sub-138', 'sub-154'].map((subject_id) => ({ id: `cs-cls12-${subject_id}`, class_id: 'cls-12', subject_id }))
];

export const mockStudents: Student[] = [
  {
    id: "stu-001",
    admission_no: "ADM-2025-0101",
    full_name: "Ahmed Sifat",
    full_name_bn: "আহমেদ সিফাত",
    roll_number: 1,
    class_id: "cls-10",
    class_name: "Class 10",
    section_id: "sec-10a",
    section_name: "Section A (Padma)",
    gender: "male",
    date_of_birth: "2010-04-14",
    guardian_name: "Mohammad Faruk",
    guardian_phone: "+880 1711-998877",
    guardian_relation: "Father",
    attendance_percentage: 96.5,
    status: "active",
    blood_group: "B+",
    address: "House 24, Road 7, Sector 4, Uttara, Dhaka",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "stu-002",
    admission_no: "ADM-2025-0102",
    full_name: "Tahsina Akter Nabila",
    full_name_bn: "তাহসিনা আক্তার নাবিলা",
    roll_number: 2,
    class_id: "cls-10",
    class_name: "Class 10",
    section_id: "sec-10a",
    section_name: "Section A (Padma)",
    gender: "female",
    date_of_birth: "2010-08-21",
    guardian_name: "Md. Nazrul Islam",
    guardian_phone: "+880 1819-445566",
    guardian_relation: "Father",
    attendance_percentage: 98.2,
    status: "active",
    blood_group: "O+",
    address: "Sector 9, Uttara, Dhaka",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "stu-003",
    admission_no: "ADM-2025-0103",
    full_name: "Sadman Sakib",
    full_name_bn: "সাদমান সাকিব",
    roll_number: 3,
    class_id: "cls-10",
    class_name: "Class 10",
    section_id: "sec-10a",
    section_name: "Section A (Padma)",
    gender: "male",
    date_of_birth: "2010-01-19",
    guardian_name: "Anwar Hossain",
    guardian_phone: "+880 1912-778899",
    guardian_relation: "Father",
    attendance_percentage: 92.0,
    status: "active",
    blood_group: "A+",
    address: "Abdullahpur, Dhaka",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "stu-004",
    admission_no: "ADM-2025-0104",
    full_name: "Farhana Yasmin",
    full_name_bn: "ফারহানা ইয়াসমিন",
    roll_number: 4,
    class_id: "cls-10",
    class_name: "Class 10",
    section_id: "sec-10a",
    section_name: "Section A (Padma)",
    gender: "female",
    date_of_birth: "2010-11-05",
    guardian_name: "Begum Rokeya",
    guardian_phone: "+880 1714-332211",
    guardian_relation: "Mother",
    attendance_percentage: 89.4,
    status: "active",
    blood_group: "AB+",
    address: "Sector 11, Uttara, Dhaka"
  },
  {
    id: "stu-005",
    admission_no: "ADM-2025-0105",
    full_name: "Zubair Al Mahmud",
    full_name_bn: "জুবায়ের আল মাহমুদ",
    roll_number: 5,
    class_id: "cls-10",
    class_name: "Class 10",
    section_id: "sec-10a",
    section_name: "Section A (Padma)",
    gender: "male",
    date_of_birth: "2010-06-30",
    guardian_name: "Mahmudur Rahman",
    guardian_phone: "+880 1618-223344",
    guardian_relation: "Father",
    attendance_percentage: 94.1,
    status: "active",
    blood_group: "O-",
    address: "Mirpur DOHS, Dhaka"
  }
];

export const mockExams: Exam[] = [
  {
    id: "ex-ssc-2027",
    name: "SSC Pre-Test / Board Model Test 2027",
    name_bn: "এসএসসি প্রি-টেস্ট ও বোর্ড মডেল টেস্ট ২০২৭",
    exam_type: "board",
    is_board_exam: true,
    board_name: "BISE Dhaka (ঢাকা শিক্ষা বোর্ড)",
    academic_year: "2026-2027",
    start_date: "2026-11-15",
    end_date: "2026-11-30",
    status: "marking",
    classes: ["Class 10"]
  },
  {
    id: "ex-midterm-2026",
    name: "Half-Yearly Examination 2026",
    name_bn: "অর্ধবার্ষিক মূল্যায়ন পরীক্ষা ২০২৬",
    exam_type: "term",
    is_board_exam: false,
    academic_year: "2026-2027",
    start_date: "2026-06-10",
    end_date: "2026-06-25",
    status: "published",
    classes: ["Class 9", "Class 10", "Class 11", "Class 12"]
  },
  {
    id: "ex-quiz-phys",
    name: "Physics Chapter 4 Assessment Quiz",
    name_bn: "পদার্থবিজ্ঞান অধ্যায় ৪ ক্লাস কুইজ",
    exam_type: "quiz",
    is_board_exam: false,
    academic_year: "2026-2027",
    start_date: "2026-10-10",
    end_date: "2026-10-10",
    status: "scheduled",
    classes: ["Class 10"]
  }
];

export const mockExamSchedules: ExamScheduleItem[] = [
  {
    id: "sch-01",
    exam_id: "ex-ssc-2027",
    class_id: "cls-10",
    class_name: "Class 10",
    subject_id: "sub-101",
    subject_name: "Bangla 1st Paper",
    subject_code: "101",
    exam_date: "2026-11-15",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
    room_number: "Halls 301, 302",
    max_marks: 100,
    invigilator_name: "Fatema Begum"
  },
  {
    id: "sch-02",
    exam_id: "ex-ssc-2027",
    class_id: "cls-10",
    class_name: "Class 10",
    subject_id: "sub-107",
    subject_name: "English 1st Paper",
    subject_code: "107",
    exam_date: "2026-11-17",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
    room_number: "Halls 301, 302",
    max_marks: 100,
    invigilator_name: "Tanvir Ahmed"
  },
  {
    id: "sch-03",
    exam_id: "ex-ssc-2027",
    class_id: "cls-10",
    class_name: "Class 10",
    subject_id: "sub-109",
    subject_name: "General Mathematics",
    subject_code: "109",
    exam_date: "2026-11-20",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
    room_number: "Halls 301, 302",
    max_marks: 100,
    invigilator_name: "Tanvir Ahmed"
  },
  {
    id: "sch-04",
    exam_id: "ex-ssc-2027",
    class_id: "cls-10",
    class_name: "Class 10",
    subject_id: "sub-136",
    subject_name: "Physics",
    subject_code: "136",
    exam_date: "2026-11-23",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
    room_number: "Physics Lab & Hall 301",
    max_marks: 100,
    invigilator_name: "Sadia Akhter"
  }
];

export const mockAdmitCards: AdmitCard[] = [
  {
    id: "adm-card-001",
    exam_id: "ex-ssc-2027",
    exam_name: "SSC Pre-Test / Board Model Test 2027",
    student_id: "stu-001",
    student_name: "Ahmed Sifat",
    student_name_bn: "আহমেদ সিফাত",
    roll_number: 104521,
    registration_number: "1910845620",
    class_name: "Class 10",
    section_name: "Section A (Padma)",
    exam_center: "Dhaka National Model Academy (Center Code: 114)",
    institute_name: "Dhaka National Model Academy",
    eiin: "108456",
    generated_date: "2026-10-02",
    signatory_title: "Controller of Examinations",
    schedules: [
      { subject_code: "101", subject_name: "Bangla 1st Paper", exam_date: "15-Nov-2026", exam_time: "10:00 AM - 01:00 PM", room_number: "Hall 301 (Desk 12)" },
      { subject_code: "107", subject_name: "English 1st Paper", exam_date: "17-Nov-2026", exam_time: "10:00 AM - 01:00 PM", room_number: "Hall 301 (Desk 12)" },
      { subject_code: "109", subject_name: "General Mathematics", exam_date: "20-Nov-2026", exam_time: "10:00 AM - 01:00 PM", room_number: "Hall 301 (Desk 12)" },
      { subject_code: "136", subject_name: "Physics", exam_date: "23-Nov-2026", exam_time: "10:00 AM - 01:00 PM", room_number: "Hall 301 (Desk 12)" }
    ]
  }
];

export const mockMarks: MarkEntry[] = [
  { id: "mk-01", student_id: "stu-001", student_name: "Ahmed Sifat", roll_number: 1, subject_id: "sub-109", subject_name: "General Mathematics", marks_obtained: 94, max_marks: 100, grade: "A+", gpa: 5.0, entered_by: "Tanvir Ahmed", updated_at: "2026-10-01" },
  { id: "mk-02", student_id: "stu-002", student_name: "Tahsina Akter Nabila", roll_number: 2, subject_id: "sub-109", subject_name: "General Mathematics", marks_obtained: 88, max_marks: 100, grade: "A+", gpa: 5.0, entered_by: "Tanvir Ahmed", updated_at: "2026-10-01" },
  { id: "mk-03", student_id: "stu-003", student_name: "Sadman Sakib", roll_number: 3, subject_id: "sub-109", subject_name: "General Mathematics", marks_obtained: 76, max_marks: 100, grade: "A", gpa: 4.0, entered_by: "Tanvir Ahmed", updated_at: "2026-10-01" },
  { id: "mk-04", student_id: "stu-004", student_name: "Farhana Yasmin", roll_number: 4, subject_id: "sub-109", subject_name: "General Mathematics", marks_obtained: 82, max_marks: 100, grade: "A+", gpa: 5.0, entered_by: "Tanvir Ahmed", updated_at: "2026-10-01" },
  { id: "mk-05", student_id: "stu-005", student_name: "Zubair Al Mahmud", roll_number: 5, subject_id: "sub-109", subject_name: "General Mathematics", marks_obtained: 68, max_marks: 100, grade: "A-", gpa: 3.5, entered_by: "Tanvir Ahmed", updated_at: "2026-10-01" }
];

export const mockFeeStructures: FeeStructure[] = [
  { id: "fs-01", class_name: "Class 10", fee_head: "Monthly Tuition Fee", frequency: "monthly", amount: 2500, due_day_of_month: 10 },
  { id: "fs-02", class_name: "Class 10", fee_head: "Laboratory & Practical Fee", frequency: "monthly", amount: 500, due_day_of_month: 10 },
  { id: "fs-03", class_name: "Class 10", fee_head: "SSC Model Test Fee", frequency: "term", amount: 1200, due_day_of_month: 15 },
  { id: "fs-04", class_name: "Class 10", fee_head: "ICT & Digital Lab Fee", frequency: "monthly", amount: 300, due_day_of_month: 10 },
  { id: "fs-05", class_name: "All Classes", fee_head: "Annual Sports & Cultural Fee", frequency: "annual", amount: 1500, due_day_of_month: 30 }
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv-2026-1001",
    invoice_number: "INV-2026-10-00142",
    student_id: "stu-001",
    student_name: "Ahmed Sifat",
    roll_number: 1,
    class_name: "Class 10",
    section_name: "Section A",
    period_label: "October 2026",
    total_amount: 3300,
    paid_amount: 0,
    waiver_amount: 0,
    due_date: "2026-10-15",
    status: "unpaid",
    created_at: "2026-10-01",
    items: [
      { id: "item-1", fee_head: "Monthly Tuition Fee", amount: 2500 },
      { id: "item-2", fee_head: "Laboratory & Practical Fee", amount: 500 },
      { id: "item-3", fee_head: "ICT & Digital Lab Fee", amount: 300 }
    ]
  },
  {
    id: "inv-2026-1002",
    invoice_number: "INV-2026-10-00143",
    student_id: "stu-002",
    student_name: "Tahsina Akter Nabila",
    roll_number: 2,
    class_name: "Class 10",
    section_name: "Section A",
    period_label: "October 2026",
    total_amount: 3300,
    paid_amount: 3300,
    waiver_amount: 0,
    due_date: "2026-10-15",
    status: "paid",
    created_at: "2026-10-01",
    items: [
      { id: "item-1", fee_head: "Monthly Tuition Fee", amount: 2500 },
      { id: "item-2", fee_head: "Laboratory & Practical Fee", amount: 500 },
      { id: "item-3", fee_head: "ICT & Digital Lab Fee", amount: 300 }
    ]
  },
  {
    id: "inv-2026-1003",
    invoice_number: "INV-2026-10-00144",
    student_id: "stu-003",
    student_name: "Sadman Sakib",
    roll_number: 3,
    class_name: "Class 10",
    section_name: "Section A",
    period_label: "October 2026",
    total_amount: 1650,
    paid_amount: 1650,
    waiver_amount: 1650,
    due_date: "2026-10-15",
    status: "paid",
    created_at: "2026-10-01",
    items: [
      { id: "item-1", fee_head: "Monthly Tuition Fee (50% Hardship Waiver Applied)", amount: 1250 },
      { id: "item-2", fee_head: "Laboratory Fee", amount: 250 },
      { id: "item-3", fee_head: "ICT Fee", amount: 150 }
    ]
  }
];

export const mockFeeWaivers: FeeWaiverRequest[] = [
  {
    id: "waiver-001",
    invoice_id: "inv-2026-1001",
    invoice_number: "INV-2026-10-00142",
    student_id: "stu-001",
    student_name: "Ahmed Sifat",
    class_name: "Class 10",
    original_amount: 3300,
    waiver_type: "standard",
    waiver_basis: "merit",
    percentage: 50,
    reason: "Awarded 50% merit waiver for securing 1st position in academic term evaluation",
    status: "pending",
    requested_by: "Kamrul Hasan CPA",
    requested_at: "2026-10-02 11:30 AM"
  },
  {
    id: "waiver-002",
    invoice_id: "inv-2026-1003",
    invoice_number: "INV-2026-10-00144",
    student_id: "stu-003",
    student_name: "Sadman Sakib",
    class_name: "Class 10",
    original_amount: 3300,
    waiver_type: "special",
    waiver_basis: "financial_hardship",
    percentage: 50,
    reason: "Guardian medical emergency. Approved per policy document PRD §5.1",
    status: "approved",
    requested_by: "Kamrul Hasan CPA",
    requested_at: "2026-09-28 02:15 PM",
    approved_by: "Dr. Rafiqul Islam (Principal)",
    approved_at: "2026-09-29 10:00 AM"
  }
];

export const mockPayments: PaymentTransaction[] = [
  {
    id: "pay-bkash-01",
    invoice_id: "inv-2026-1002",
    invoice_number: "INV-2026-10-00143",
    student_name: "Tahsina Akter Nabila",
    amount: 3300,
    method: "bkash",
    transaction_id: "9J32X84K2P",
    status: "successful",
    reconciled: true,
    reconciled_at: "2026-10-02 04:10 PM",
    created_at: "2026-10-02 03:45 PM"
  },
  {
    id: "pay-nagad-02",
    invoice_id: "inv-2026-1003",
    invoice_number: "INV-2026-10-00144",
    student_name: "Sadman Sakib",
    amount: 1650,
    method: "nagad",
    transaction_id: "7M21B90L19",
    status: "successful",
    reconciled: true,
    reconciled_at: "2026-10-01 06:00 PM",
    created_at: "2026-10-01 05:22 PM"
  },
  {
    id: "pay-ssl-03",
    invoice_id: "inv-2026-0998",
    invoice_number: "INV-2026-09-00088",
    student_name: "Farhana Yasmin",
    amount: 3300,
    method: "sslcommerz",
    transaction_id: "SSL-9482910-BD",
    status: "successful",
    reconciled: false,
    created_at: "2026-10-03 09:12 AM"
  }
];

export const mockRoutine: RoutineItem[] = [
  // Sunday
  { id: "rt-01", day_of_week: "Sunday", period_number: 1, start_time: "08:00 AM", end_time: "08:45 AM", class_name: "Class 10", section_name: "Section A", subject_name: "General Mathematics", teacher_name: "Tanvir Ahmed", room_number: "Room 302" },
  { id: "rt-02", day_of_week: "Sunday", period_number: 2, start_time: "08:50 AM", end_time: "09:35 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Physics", teacher_name: "Fatema Begum", room_number: "Room 302" },
  { id: "rt-03", day_of_week: "Sunday", period_number: 3, start_time: "09:40 AM", end_time: "10:25 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Bangla 1st Paper", teacher_name: "Sadia Akhter", room_number: "Room 302" },
  { id: "rt-04", day_of_week: "Sunday", period_number: 4, start_time: "10:45 AM", end_time: "11:30 AM", class_name: "Class 10", section_name: "Section A", subject_name: "English 1st Paper", teacher_name: "Farhana Chowdhury", room_number: "Room 302" },
  { id: "rt-05", day_of_week: "Sunday", period_number: 5, start_time: "11:35 AM", end_time: "12:20 PM", class_name: "Class 10", section_name: "Section A", subject_name: "Chemistry", teacher_name: "Kazi Nurul Islam", room_number: "Chem Lab" },
  { id: "rt-06", day_of_week: "Sunday", period_number: 6, start_time: "12:25 PM", end_time: "01:10 PM", class_name: "Class 10", section_name: "Section A", subject_name: "Biology", teacher_name: "Nusrat Jahan", room_number: "Bio Lab" },

  // Monday
  { id: "rt-07", day_of_week: "Monday", period_number: 1, start_time: "08:00 AM", end_time: "08:45 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Chemistry", teacher_name: "Kazi Nurul Islam", room_number: "Chem Lab" },
  { id: "rt-08", day_of_week: "Monday", period_number: 2, start_time: "08:50 AM", end_time: "09:35 AM", class_name: "Class 10", section_name: "Section A", subject_name: "General Mathematics", teacher_name: "Tanvir Ahmed", room_number: "Room 302" },
  { id: "rt-09", day_of_week: "Monday", period_number: 3, start_time: "09:40 AM", end_time: "10:25 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Physics", teacher_name: "Fatema Begum", room_number: "Room 302" },
  { id: "rt-10", day_of_week: "Monday", period_number: 4, start_time: "10:45 AM", end_time: "11:30 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Information & Communication Tech", teacher_name: "Mahbubur Rahman", room_number: "Computer Lab" },
  { id: "rt-11", day_of_week: "Monday", period_number: 5, start_time: "11:35 AM", end_time: "12:20 PM", class_name: "Class 10", section_name: "Section A", subject_name: "English 1st Paper", teacher_name: "Farhana Chowdhury", room_number: "Room 302" },
  { id: "rt-12", day_of_week: "Monday", period_number: 6, start_time: "12:25 PM", end_time: "01:10 PM", class_name: "Class 10", section_name: "Section A", subject_name: "Bangla 1st Paper", teacher_name: "Sadia Akhter", room_number: "Room 302" },

  // Tuesday
  { id: "rt-13", day_of_week: "Tuesday", period_number: 1, start_time: "08:00 AM", end_time: "08:45 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Physics", teacher_name: "Fatema Begum", room_number: "Physics Lab" },
  { id: "rt-14", day_of_week: "Tuesday", period_number: 2, start_time: "08:50 AM", end_time: "09:35 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Physics", teacher_name: "Fatema Begum", room_number: "Physics Lab" },
  { id: "rt-15", day_of_week: "Tuesday", period_number: 3, start_time: "09:40 AM", end_time: "10:25 AM", class_name: "Class 10", section_name: "Section A", subject_name: "General Mathematics", teacher_name: "Tanvir Ahmed", room_number: "Room 302" },
  { id: "rt-16", day_of_week: "Tuesday", period_number: 4, start_time: "10:45 AM", end_time: "11:30 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Biology", teacher_name: "Nusrat Jahan", room_number: "Room 302" },
  { id: "rt-17", day_of_week: "Tuesday", period_number: 5, start_time: "11:35 AM", end_time: "12:20 PM", class_name: "Class 10", section_name: "Section A", subject_name: "Bangla 1st Paper", teacher_name: "Sadia Akhter", room_number: "Room 302" },
  { id: "rt-18", day_of_week: "Tuesday", period_number: 6, start_time: "12:25 PM", end_time: "01:10 PM", class_name: "Class 10", section_name: "Section A", subject_name: "Information & Communication Tech", teacher_name: "Mahbubur Rahman", room_number: "Room 302" },

  // Wednesday
  { id: "rt-19", day_of_week: "Wednesday", period_number: 1, start_time: "08:00 AM", end_time: "08:45 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Chemistry", teacher_name: "Kazi Nurul Islam", room_number: "Chem Lab" },
  { id: "rt-20", day_of_week: "Wednesday", period_number: 2, start_time: "08:50 AM", end_time: "09:35 AM", class_name: "Class 10", section_name: "Section A", subject_name: "English 1st Paper", teacher_name: "Farhana Chowdhury", room_number: "Room 302" },
  { id: "rt-21", day_of_week: "Wednesday", period_number: 3, start_time: "09:40 AM", end_time: "10:25 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Physics", teacher_name: "Fatema Begum", room_number: "Room 302" },
  { id: "rt-22", day_of_week: "Wednesday", period_number: 4, start_time: "10:45 AM", end_time: "11:30 AM", class_name: "Class 10", section_name: "Section A", subject_name: "General Mathematics", teacher_name: "Tanvir Ahmed", room_number: "Room 302" },
  { id: "rt-23", day_of_week: "Wednesday", period_number: 5, start_time: "11:35 AM", end_time: "12:20 PM", class_name: "Class 10", section_name: "Section A", subject_name: "Biology", teacher_name: "Nusrat Jahan", room_number: "Bio Lab" },
  { id: "rt-24", day_of_week: "Wednesday", period_number: 6, start_time: "12:25 PM", end_time: "01:10 PM", class_name: "Class 10", section_name: "Section A", subject_name: "Bangla 1st Paper", teacher_name: "Sadia Akhter", room_number: "Room 302" },

  // Thursday
  { id: "rt-25", day_of_week: "Thursday", period_number: 1, start_time: "08:00 AM", end_time: "08:45 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Biology", teacher_name: "Nusrat Jahan", room_number: "Bio Lab" },
  { id: "rt-26", day_of_week: "Thursday", period_number: 2, start_time: "08:50 AM", end_time: "09:35 AM", class_name: "Class 10", section_name: "Section A", subject_name: "General Mathematics", teacher_name: "Tanvir Ahmed", room_number: "Room 302" },
  { id: "rt-27", day_of_week: "Thursday", period_number: 3, start_time: "09:40 AM", end_time: "10:25 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Physics", teacher_name: "Fatema Begum", room_number: "Room 302" },
  { id: "rt-28", day_of_week: "Thursday", period_number: 4, start_time: "10:45 AM", end_time: "11:30 AM", class_name: "Class 10", section_name: "Section A", subject_name: "Bangla 1st Paper", teacher_name: "Sadia Akhter", room_number: "Room 302" },
  { id: "rt-29", day_of_week: "Thursday", period_number: 5, start_time: "11:35 AM", end_time: "12:20 PM", class_name: "Class 10", section_name: "Section A", subject_name: "English 1st Paper", teacher_name: "Farhana Chowdhury", room_number: "Room 302" },
  { id: "rt-30", day_of_week: "Thursday", period_number: 6, start_time: "12:25 PM", end_time: "01:10 PM", class_name: "Class 10", section_name: "Section A", subject_name: "General Mathematics", teacher_name: "Fatema Begum", room_number: "Room 302" },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-01",
    title: "SSC Board Pre-Test Schedule Announced",
    title_bn: "এসএসসি প্রি-টেস্ট পরীক্ষার চূড়ান্ত সময়সূচি প্রকাশিত",
    content: "The official timetable for the SSC Pre-Test 2027 has been finalized by BISE Dhaka guidelines. Students must collect their Admit Cards by November 10.",
    content_bn: "ঢাকা বোর্ডের নির্দেশনা অনুযায়ী এসএসসি প্রি-টেস্ট ২০২৭ পরীক্ষার চূড়ান্ত রুটিন প্রকাশিত হয়েছে। আগামী ১০ নভেম্বরের মধ্যে শিক্ষার্থীদের প্রবেশপত্র সংগ্রহ করতে হবে।",
    target_audience: "all",
    author_name: "Mahbubur Rahman",
    author_role: "Exam Controller",
    created_at: "2026-10-02 09:00 AM",
    is_pinned: true
  },
  {
    id: "ann-02",
    title: "Science Club Robotics Workshop This Friday",
    title_bn: "বিজ্ঞান ক্লাবের রোবোটিক্স কর্মশালা আগামী শুক্রবার",
    content: "Hands-on micro-controller coding and drone mechanics workshop for Class 9 and 10 students.",
    content_bn: "৯ম ও ১০ম শ্রেণির শিক্ষার্থীদের জন্য মাইক্রোকন্ট্রোলার কোডিং ও ড্রোন মেকানিক্সের ওপর বিশেষ কর্মশালা।",
    target_audience: "students",
    author_name: "Fatema Begum",
    author_role: "Class Teacher",
    created_at: "2026-10-01 02:30 PM",
    is_pinned: false
  }
];

export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: "mat-01",
    title: "Physics Ch 4: Work, Power & Energy — Formula Sheet & Practice Set",
    subject_name: "Physics",
    class_name: "Class 10",
    section_name: "Section A",
    description: "Comprehensive formula cheatsheet with 15 CQ board exam problems solved step-by-step.",
    file_name: "Physics_Ch4_Formulas_CQ.pdf",
    file_size: "3.4 MB",
    file_type: "PDF Document",
    uploaded_by: "Fatema Begum",
    created_at: "2026-10-01",
    download_url: "#"
  },
  {
    id: "mat-02",
    title: "General Math: Trigonometric Ratios Chapter 9 Summary",
    subject_name: "General Mathematics",
    class_name: "Class 10",
    section_name: "Section A",
    description: "Proof of identities and previous 5 years board question trends.",
    file_name: "Trigonometry_Ch9_BoardPrep.pdf",
    file_size: "2.1 MB",
    file_type: "PDF Document",
    uploaded_by: "Tanvir Ahmed",
    created_at: "2026-09-29",
    download_url: "#"
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "aud-001",
    actor_id: "usr-admin-001",
    actor_name: "Dr. Rafiqul Islam",
    actor_role: "Institute Admin",
    action: "fee_waiver.approved",
    entity_type: "fee_waivers",
    entity_id: "waiver-002",
    entity_label: "Waiver #waiver-002 (Sadman Sakib)",
    ip_address: "103.114.98.22",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    old_values: { status: "pending", invoice_total: 3300 },
    new_values: { status: "approved", invoice_total: 1650, discount_pct: 50 },
    anomaly_flag: false,
    created_at: "2026-09-29 10:00 AM"
  },
  {
    id: "aud-002",
    actor_id: "usr-t-002",
    actor_name: "Tanvir Ahmed",
    actor_role: "Teacher",
    action: "marks.updated",
    entity_type: "marks",
    entity_id: "mk-01",
    entity_label: "General Math Mark (Ahmed Sifat)",
    ip_address: "103.114.98.45",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    old_values: { marks_obtained: 88, grade: "A+" },
    new_values: { marks_obtained: 94, grade: "A+" },
    anomaly_flag: true,
    anomaly_reason: "Mark adjusted upwards after initial grade sheet lock",
    created_at: "2026-10-01 04:32 PM"
  },
  {
    id: "aud-003",
    actor_id: "usr-admin-001",
    actor_name: "Dr. Rafiqul Islam",
    actor_role: "Institute Admin",
    action: "role.assigned",
    entity_type: "user_roles",
    entity_id: "usr-exam-001",
    entity_label: "Mahbubur Rahman (Exam Controller)",
    ip_address: "103.114.98.22",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    old_values: { role: "teacher" },
    new_values: { role: "exam_controller", hierarchy_level: 70 },
    anomaly_flag: false,
    created_at: "2026-09-25 11:20 AM"
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "tkt-1084",
    ticket_number: "TKT-2026-1084",
    user_id: "usr-admin-001",
    user_name: "Dr. Rafiqul Islam",
    user_role: "Institute Admin",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    institute_name: "Dhaka National Model Academy",
    category: "billing",
    priority: "high",
    status: "in_progress",
    subject: "bKash MFS automated instant reconciliation webhook latency",
    description: "Between 03:00 PM and 04:00 PM, several guardian fee payments via bKash required manual reconciliation sync rather than instant notification.",
    sla_target_response_hours: 2,
    sla_breached: false,
    created_at: "2026-10-02 04:15 PM",
    updated_at: "2026-10-02 04:45 PM",
    csat_rating: 5,
    messages: [
      {
        id: "msg-1",
        sender_name: "Dr. Rafiqul Islam",
        sender_role: "user",
        message: "We noticed bKash gateway webhooks had a ~15 minute queue delay today. Could engineering verify the broker status?",
        created_at: "2026-10-02 04:15 PM"
      },
      {
        id: "msg-2",
        sender_name: "AeroEdu Support Tier 2",
        sender_role: "support_agent",
        message: "Greetings Dr. Islam. Our telemetry shows bKash IPN endpoint experienced upstream queuing between 14:45-15:30 UTC+6. All delayed events have been re-delivered through our idempotent retry worker. No payment records were dropped.",
        created_at: "2026-10-02 04:45 PM"
      }
    ]
  },
  {
    id: "tkt-1085",
    ticket_number: "TKT-2026-1085",
    user_id: "usr-gdn-001",
    user_name: "Mohammad Faruk",
    user_role: "Guardian",
    institute_id: "e2fdedee-31b8-4c93-b587-af346f419b50",
    institute_name: "Dhaka National Model Academy",
    category: "admit_card",
    priority: "medium",
    status: "resolved",
    subject: "Admit card download roll number display format",
    description: "Needed confirmation if the 6-digit board exam roll is finalized on the printed admit card.",
    sla_target_response_hours: 4,
    sla_breached: false,
    created_at: "2026-10-01 10:20 AM",
    updated_at: "2026-10-01 11:05 AM",
    csat_rating: 5,
    messages: [
      {
        id: "msg-11",
        sender_name: "Mohammad Faruk",
        sender_role: "user",
        message: "Is the roll number on Ahmed Sifat's admit card the same as the final board registration?",
        created_at: "2026-10-01 10:20 AM"
      },
      {
        id: "msg-12",
        sender_name: "AeroEdu Support",
        sender_role: "support_agent",
        message: "Yes Mr. Faruk! The 6-digit roll number (104521) and 10-digit registration number (1910845620) match Dhaka Board records directly.",
        created_at: "2026-10-01 11:05 AM"
      }
    ]
  }
];

export const mockKnowledgeBase: KnowledgeArticle[] = [
  {
    id: "kb-01",
    category: "Examinations & Admit Cards",
    title_en: "How to Generate and Print Standard A4 Admit Cards with Official Seal",
    title_bn: "কীভাবে অফিসিয়াল সিলসহ এ৪ সাইজ প্রবেশপত্র প্রিন্ট ও প্রস্তুত করবেন",
    content_en: "Navigate to Exam Controller > Admit Card Generator. Choose your Exam and Section. The system automatically populates subject dates, start times, roll numbers, and the institute seal. Click 'Print All' or 'Download PDF' for clean A4 multi-page printouts.",
    content_bn: "পরীক্ষা নিয়ন্ত্রক মেনু থেকে 'প্রবেশপত্র প্রস্তুতকারক' এ যান। নির্ধারিত পরীক্ষা এবং শ্রেণি নির্বাচন করুন। সিস্টেম স্বয়ংক্রিয়ভাবে সময়সূচি, রোল ও প্রতিষ্ঠানের সিল যুক্ত করবে। 'প্রিন্ট' বাটনে ক্লিক করলেই এ৪ ফরম্যাটে প্রিন্ট হয়ে যাবে।",
    helpful_count: 142,
    tags: ["admit card", "print", "exams", "controller"]
  },
  {
    id: "kb-02",
    category: "Billing & Fee Waivers",
    title_en: "Approval Workflow for Merit and Financial Hardship Fee Waivers",
    title_bn: "মেধা ও আর্থিক অসচ্ছলতা কোটায় ফি মওকুফের অনুমোদন প্রক্রিয়া",
    content_en: "Accountants submit waiver requests with supporting basis and discount percentage (e.g. 50% or 100%). Institute Admins receive an instant notification in the Approval Queue to verify and commit the adjustment into the invoice.",
    content_bn: "হিসাবরক্ষক ফি মওকুফের আবেদন দাখিল করবেন। প্রতিষ্ঠান প্রধানের ড্যাশবোর্ডে এটি অনুমোদনের জন্য যুক্ত হবে এবং অনুমোদিত হলে স্বয়ংক্রিয়ভাবে ইনভয়েসে সমন্বয় ঘটবে।",
    helpful_count: 98,
    tags: ["billing", "fee waiver", "approval", "accountant"]
  }
];

export const mockLoginHistory: LoginHistoryItem[] = [
  {
    id: "log-1",
    user_id: "usr-admin-001",
    login_time: "2026-10-03 08:14 AM",
    ip_address: "103.114.98.22",
    device: "Windows 11 PC",
    browser: "Chrome 128.0",
    location: "Dhaka, Bangladesh",
    is_new_device: false,
    success: true
  },
  {
    id: "log-2",
    user_id: "usr-admin-001",
    login_time: "2026-10-02 09:20 AM",
    ip_address: "103.114.98.22",
    device: "Windows 11 PC",
    browser: "Chrome 128.0",
    location: "Dhaka, Bangladesh",
    is_new_device: false,
    success: true
  },
  {
    id: "log-3",
    user_id: "usr-admin-001",
    login_time: "2026-09-30 11:45 PM",
    ip_address: "182.160.112.5",
    device: "Android Smartphone",
    browser: "Mobile Chrome",
    location: "Chittagong, Bangladesh",
    is_new_device: true,
    success: true
  }
];

export const mockAcademicResults: StudentAcademicResult[] = [
  {
    student_id: "stu-001",
    student_name: "Ahmed Sifat",
    student_name_bn: "আহমেদ সিফাত",
    roll_number: 1,
    registration_number: "202510845601",
    class_name: "Class 10",
    section_name: "Section A (Padma)",
    exam_id: "ex-ssc-2027",
    exam_name: "SSC Pre-Test Model Examination 2027",
    attendance_percentage: 97.4,
    merit_position: 1,
    is_passed: true,
    total_marks_obtained: 642,
    total_max_marks: 700,
    gpa_without_optional: 5.00,
    gpa_with_optional: 5.00,
    final_grade: "A+ (Golden)",
    conduct_rating: "Exemplary",
    teacher_remarks: "Outstanding academic brilliance and exceptional problem-solving depth in Physics and Mathematics. Highly recommended for Board Scholarship.",
    scores: [
      { subject_code: "101", subject_name: "Bangla 1st Paper", subject_name_bn: "বাংলা ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 61, cq_pass: 23, mcq_marks: 27, mcq_pass: 10, total_marks: 88, highest_marks: 92, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "107", subject_name: "English 1st Paper", subject_name_bn: "ইংরেজি ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 86, cq_pass: 33, mcq_marks: 0, mcq_pass: 0, total_marks: 86, highest_marks: 90, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "109", subject_name: "General Mathematics", subject_name_bn: "সাধারণ গণিত", is_optional: false, full_marks: 100, cq_marks: 68, cq_pass: 23, mcq_marks: 29, mcq_pass: 10, total_marks: 97, highest_marks: 97, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "136", subject_name: "Physics", subject_name_bn: "পদার্থবিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 46, cq_pass: 17, mcq_marks: 24, mcq_pass: 8, pr_marks: 25, pr_pass: 8, total_marks: 95, highest_marks: 96, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "137", subject_name: "Chemistry", subject_name_bn: "রসায়ন", is_optional: false, full_marks: 100, cq_marks: 44, cq_pass: 17, mcq_marks: 23, mcq_pass: 8, pr_marks: 24, pr_pass: 8, total_marks: 91, highest_marks: 94, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "138", subject_name: "Biology", subject_name_bn: "জীববিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 43, cq_pass: 17, mcq_marks: 22, mcq_pass: 8, pr_marks: 25, pr_pass: 8, total_marks: 90, highest_marks: 92, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "126", subject_name: "Higher Mathematics (4th)", subject_name_bn: "উচ্চতর গণিত (৪র্থ বিষয়)", is_optional: true, full_marks: 100, cq_marks: 47, cq_pass: 17, mcq_marks: 24, mcq_pass: 8, pr_marks: 24, pr_pass: 8, total_marks: 95, highest_marks: 96, letter_grade: "A+", grade_point: 5.00, is_passed: true }
    ]
  },
  {
    student_id: "stu-002",
    student_name: "Samiha Hossain",
    student_name_bn: "সামিহা হোসেন",
    roll_number: 2,
    registration_number: "202510845602",
    class_name: "Class 10",
    section_name: "Section A (Padma)",
    exam_id: "ex-ssc-2027",
    exam_name: "SSC Pre-Test Model Examination 2027",
    attendance_percentage: 95.8,
    merit_position: 2,
    is_passed: true,
    total_marks_obtained: 624,
    total_max_marks: 700,
    gpa_without_optional: 5.00,
    gpa_with_optional: 5.00,
    final_grade: "A+",
    conduct_rating: "Exemplary",
    teacher_remarks: "Consistent, dedicated, and very thorough in presentation. Strong analytical grasp in Chemistry and Biology.",
    scores: [
      { subject_code: "101", subject_name: "Bangla 1st Paper", subject_name_bn: "বাংলা ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 64, cq_pass: 23, mcq_marks: 28, mcq_pass: 10, total_marks: 92, highest_marks: 92, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "107", subject_name: "English 1st Paper", subject_name_bn: "ইংরেজি ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 84, cq_pass: 33, mcq_marks: 0, mcq_pass: 0, total_marks: 84, highest_marks: 90, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "109", subject_name: "General Mathematics", subject_name_bn: "সাধারণ গণিত", is_optional: false, full_marks: 100, cq_marks: 62, cq_pass: 23, mcq_marks: 27, mcq_pass: 10, total_marks: 89, highest_marks: 97, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "136", subject_name: "Physics", subject_name_bn: "পদার্থবিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 42, cq_pass: 17, mcq_marks: 22, mcq_pass: 8, pr_marks: 24, pr_pass: 8, total_marks: 88, highest_marks: 96, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "137", subject_name: "Chemistry", subject_name_bn: "রসায়ন", is_optional: false, full_marks: 100, cq_marks: 45, cq_pass: 17, mcq_marks: 24, mcq_pass: 8, pr_marks: 25, pr_pass: 8, total_marks: 94, highest_marks: 94, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "138", subject_name: "Biology", subject_name_bn: "জীববিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 44, cq_pass: 17, mcq_marks: 23, mcq_pass: 8, pr_marks: 25, pr_pass: 8, total_marks: 92, highest_marks: 92, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "126", subject_name: "Higher Mathematics (4th)", subject_name_bn: "উচ্চতর গণিত (৪র্থ বিষয়)", is_optional: true, full_marks: 100, cq_marks: 41, cq_pass: 17, mcq_marks: 21, mcq_pass: 8, pr_marks: 23, pr_pass: 8, total_marks: 85, highest_marks: 96, letter_grade: "A+", grade_point: 5.00, is_passed: true }
    ]
  },
  {
    student_id: "stu-003",
    student_name: "Tanvir Hasan",
    student_name_bn: "তানভীর হাসান",
    roll_number: 3,
    registration_number: "202510845603",
    class_name: "Class 10",
    section_name: "Section A (Padma)",
    exam_id: "ex-ssc-2027",
    exam_name: "SSC Pre-Test Model Examination 2027",
    attendance_percentage: 91.2,
    merit_position: 3,
    is_passed: true,
    total_marks_obtained: 548,
    total_max_marks: 700,
    gpa_without_optional: 4.33,
    gpa_with_optional: 4.67,
    final_grade: "A",
    conduct_rating: "Very Good",
    teacher_remarks: "Good potential. English vocabulary and Physics numerical problem solving need slight practice before Board exams.",
    scores: [
      { subject_code: "101", subject_name: "Bangla 1st Paper", subject_name_bn: "বাংলা ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 52, cq_pass: 23, mcq_marks: 24, mcq_pass: 10, total_marks: 76, highest_marks: 92, letter_grade: "A", grade_point: 4.00, is_passed: true },
      { subject_code: "107", subject_name: "English 1st Paper", subject_name_bn: "ইংরেজি ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 68, cq_pass: 33, mcq_marks: 0, mcq_pass: 0, total_marks: 68, highest_marks: 90, letter_grade: "A-", grade_point: 3.50, is_passed: true },
      { subject_code: "109", subject_name: "General Mathematics", subject_name_bn: "সাধারণ গণিত", is_optional: false, full_marks: 100, cq_marks: 58, cq_pass: 23, mcq_marks: 26, mcq_pass: 10, total_marks: 84, highest_marks: 97, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "136", subject_name: "Physics", subject_name_bn: "পদার্থবিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 38, cq_pass: 17, mcq_marks: 19, mcq_pass: 8, pr_marks: 22, pr_pass: 8, total_marks: 79, highest_marks: 96, letter_grade: "A", grade_point: 4.00, is_passed: true },
      { subject_code: "137", subject_name: "Chemistry", subject_name_bn: "রসায়ন", is_optional: false, full_marks: 100, cq_marks: 40, cq_pass: 17, mcq_marks: 21, mcq_pass: 8, pr_marks: 23, pr_pass: 8, total_marks: 84, highest_marks: 94, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "138", subject_name: "Biology", subject_name_bn: "জীববিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 36, cq_pass: 17, mcq_marks: 18, mcq_pass: 8, pr_marks: 23, pr_pass: 8, total_marks: 77, highest_marks: 92, letter_grade: "A", grade_point: 4.00, is_passed: true },
      { subject_code: "126", subject_name: "Higher Mathematics (4th)", subject_name_bn: "উচ্চতর গণিত (৪র্থ বিষয়)", is_optional: true, full_marks: 100, cq_marks: 39, cq_pass: 17, mcq_marks: 20, mcq_pass: 8, pr_marks: 21, pr_pass: 8, total_marks: 80, highest_marks: 96, letter_grade: "A+", grade_point: 5.00, is_passed: true }
    ]
  },
  {
    student_id: "stu-004",
    student_name: "Nusrat Jahan",
    student_name_bn: "নুসরাত জাহান",
    roll_number: 4,
    registration_number: "202510845604",
    class_name: "Class 10",
    section_name: "Section A (Padma)",
    exam_id: "ex-ssc-2027",
    exam_name: "SSC Pre-Test Model Examination 2027",
    attendance_percentage: 88.5,
    merit_position: 4,
    is_passed: true,
    total_marks_obtained: 498,
    total_max_marks: 700,
    gpa_without_optional: 3.67,
    gpa_with_optional: 4.00,
    final_grade: "A",
    conduct_rating: "Very Good",
    teacher_remarks: "Sincere student. Needs to focus on Mathematics geometry theorems and Chemistry formulas.",
    scores: [
      { subject_code: "101", subject_name: "Bangla 1st Paper", subject_name_bn: "বাংলা ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 48, cq_pass: 23, mcq_marks: 22, mcq_pass: 10, total_marks: 70, highest_marks: 92, letter_grade: "A", grade_point: 4.00, is_passed: true },
      { subject_code: "107", subject_name: "English 1st Paper", subject_name_bn: "ইংরেজি ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 64, cq_pass: 33, mcq_marks: 0, mcq_pass: 0, total_marks: 64, highest_marks: 90, letter_grade: "A-", grade_point: 3.50, is_passed: true },
      { subject_code: "109", subject_name: "General Mathematics", subject_name_bn: "সাধারণ গণিত", is_optional: false, full_marks: 100, cq_marks: 44, cq_pass: 23, mcq_marks: 21, mcq_pass: 10, total_marks: 65, highest_marks: 97, letter_grade: "A-", grade_point: 3.50, is_passed: true },
      { subject_code: "136", subject_name: "Physics", subject_name_bn: "পদার্থবিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 32, cq_pass: 17, mcq_marks: 17, mcq_pass: 8, pr_marks: 22, pr_pass: 8, total_marks: 71, highest_marks: 96, letter_grade: "A", grade_point: 4.00, is_passed: true },
      { subject_code: "137", subject_name: "Chemistry", subject_name_bn: "রসায়ন", is_optional: false, full_marks: 100, cq_marks: 31, cq_pass: 17, mcq_marks: 16, mcq_pass: 8, pr_marks: 21, pr_pass: 8, total_marks: 68, highest_marks: 94, letter_grade: "A-", grade_point: 3.50, is_passed: true },
      { subject_code: "138", subject_name: "Biology", subject_name_bn: "জীববিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 38, cq_pass: 17, mcq_marks: 19, mcq_pass: 8, pr_marks: 23, pr_pass: 8, total_marks: 80, highest_marks: 92, letter_grade: "A+", grade_point: 5.00, is_passed: true },
      { subject_code: "126", subject_name: "Higher Mathematics (4th)", subject_name_bn: "উচ্চতর গণিত (৪র্থ বিষয়)", is_optional: true, full_marks: 100, cq_marks: 34, cq_pass: 17, mcq_marks: 18, mcq_pass: 8, pr_marks: 20, pr_pass: 8, total_marks: 72, highest_marks: 96, letter_grade: "A", grade_point: 4.00, is_passed: true }
    ]
  },
  {
    student_id: "stu-005",
    student_name: "Mahir Faisal",
    student_name_bn: "মাহির ফয়সাল",
    roll_number: 5,
    registration_number: "202510845605",
    class_name: "Class 10",
    section_name: "Section A (Padma)",
    exam_id: "ex-ssc-2027",
    exam_name: "SSC Pre-Test Model Examination 2027",
    attendance_percentage: 72.4,
    merit_position: 5,
    is_passed: false, // FAILED due to MCQ failure in Chemistry
    total_marks_obtained: 412,
    total_max_marks: 700,
    gpa_without_optional: 0.00,
    gpa_with_optional: 0.00,
    final_grade: "F (Failed in Chemistry MCQ)",
    conduct_rating: "Needs Improvement",
    teacher_remarks: "Failed to achieve the minimum pass mark in Chemistry MCQ (got 6, pass is 8). Retake compulsory exam scheduled before Board registration.",
    scores: [
      { subject_code: "101", subject_name: "Bangla 1st Paper", subject_name_bn: "বাংলা ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 42, cq_pass: 23, mcq_marks: 18, mcq_pass: 10, total_marks: 60, highest_marks: 92, letter_grade: "A-", grade_point: 3.50, is_passed: true },
      { subject_code: "107", subject_name: "English 1st Paper", subject_name_bn: "ইংরেজি ১ম পত্র", is_optional: false, full_marks: 100, cq_marks: 55, cq_pass: 33, mcq_marks: 0, mcq_pass: 0, total_marks: 55, highest_marks: 90, letter_grade: "B", grade_point: 3.00, is_passed: true },
      { subject_code: "109", subject_name: "General Mathematics", subject_name_bn: "সাধারণ গণিত", is_optional: false, full_marks: 100, cq_marks: 38, cq_pass: 23, mcq_marks: 16, mcq_pass: 10, total_marks: 54, highest_marks: 97, letter_grade: "B", grade_point: 3.00, is_passed: true },
      { subject_code: "136", subject_name: "Physics", subject_name_bn: "পদার্থবিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 28, cq_pass: 17, mcq_marks: 14, mcq_pass: 8, pr_marks: 20, pr_pass: 8, total_marks: 62, highest_marks: 96, letter_grade: "A-", grade_point: 3.50, is_passed: true },
      { subject_code: "137", subject_name: "Chemistry", subject_name_bn: "রসায়ন", is_optional: false, full_marks: 100, cq_marks: 26, cq_pass: 17, mcq_marks: 6, mcq_pass: 8, pr_marks: 19, pr_pass: 8, total_marks: 51, highest_marks: 94, letter_grade: "F", grade_point: 0.00, is_passed: false }, // Component Failed!
      { subject_code: "138", subject_name: "Biology", subject_name_bn: "জীববিজ্ঞান", is_optional: false, full_marks: 100, cq_marks: 32, cq_pass: 17, mcq_marks: 15, mcq_pass: 8, pr_marks: 21, pr_pass: 8, total_marks: 68, highest_marks: 92, letter_grade: "A-", grade_point: 3.50, is_passed: true },
      { subject_code: "126", subject_name: "Higher Mathematics (4th)", subject_name_bn: "উচ্চতর গণিত (৪র্থ বিষয়)", is_optional: true, full_marks: 100, cq_marks: 27, cq_pass: 17, mcq_marks: 13, mcq_pass: 8, pr_marks: 20, pr_pass: 8, total_marks: 60, highest_marks: 96, letter_grade: "A-", grade_point: 3.50, is_passed: true }
    ]
  }
];

export const mockAdmissions: AdmissionApplication[] = [
  {
    id: "adm-app-01",
    applicant_name: "Zayan Al-Mahmud",
    applicant_name_bn: "জায়ান আল-মাহমুদ",
    guardian_name: "Engr. Mahmudur Rahman",
    phone: "+880 1718-445566",
    target_class: "Class 11 (Science)",
    target_group: "Science",
    previous_school: "Ideal School and College, Motijheel",
    previous_gpa: 5.00,
    submission_date: "2026-10-02",
    status: "interview_scheduled",
    application_fee_paid: true
  },
  {
    id: "adm-app-02",
    applicant_name: "Anika Tabassum",
    applicant_name_bn: "আনিকা তাবাসসুম",
    guardian_name: "Prof. Abul Kalam Azad",
    phone: "+880 1819-223344",
    target_class: "Class 9",
    target_group: "General",
    previous_school: "Viqarunnisa Noon School",
    previous_gpa: 4.88,
    submission_date: "2026-10-03",
    status: "approved",
    application_fee_paid: true
  },
  {
    id: "adm-app-03",
    applicant_name: "Sajid Imtiaz",
    applicant_name_bn: "সাজিদ ইমতিয়াজ",
    guardian_name: "Dr. Imtiaz Ahmed",
    phone: "+880 1911-778899",
    target_class: "Class 11 (Science)",
    target_group: "Science",
    previous_school: "St. Joseph Higher Secondary School",
    previous_gpa: 5.00,
    submission_date: "2026-10-04",
    status: "pending",
    application_fee_paid: false
  }
];

export const mockTeacherLeaves: TeacherLeaveRequest[] = [
  {
    id: "leave-01",
    teacher_id: "stf-005",
    teacher_name: "Tanvir Ahmed",
    department: "Department of Science",
    leave_type: "Casual",
    start_date: "2026-10-12",
    end_date: "2026-10-14",
    days_count: 3,
    reason: "Urgent family wedding out of Dhaka. Syllabus for Class 10 General Math is 2 weeks ahead.",
    substitute_teacher_name: "Fatema Begum",
    status: "pending"
  },
  {
    id: "leave-02",
    teacher_id: "stf-006",
    teacher_name: "Sadia Akhter",
    department: "Department of Humanities",
    leave_type: "Medical",
    start_date: "2026-10-01",
    end_date: "2026-10-03",
    days_count: 3,
    reason: "Acute viral fever with medical prescription attached.",
    substitute_teacher_name: "Farhana Chowdhury",
    status: "approved"
  }
];

export const mockBoardCompliance: BoardComplianceRecord[] = [
  {
    student_id: "stu-001",
    student_name: "Ahmed Sifat",
    roll_number: 1,
    reg_number: "202510845601",
    class_name: "Class 10",
    attendance_rate: 97.4,
    pretest_gpa: 5.00,
    is_eligible_for_board: true,
    fees_cleared: true
  },
  {
    student_id: "stu-002",
    student_name: "Samiha Hossain",
    roll_number: 2,
    reg_number: "202510845602",
    class_name: "Class 10",
    attendance_rate: 95.8,
    pretest_gpa: 5.00,
    is_eligible_for_board: true,
    fees_cleared: true
  },
  {
    student_id: "stu-003",
    student_name: "Tanvir Hasan",
    roll_number: 3,
    reg_number: "202510845603",
    class_name: "Class 10",
    attendance_rate: 91.2,
    pretest_gpa: 4.67,
    is_eligible_for_board: true,
    fees_cleared: true
  },
  {
    student_id: "stu-004",
    student_name: "Nusrat Jahan",
    roll_number: 4,
    reg_number: "202510845604",
    class_name: "Class 10",
    attendance_rate: 88.5,
    pretest_gpa: 4.00,
    is_eligible_for_board: true,
    fees_cleared: true
  },
  {
    student_id: "stu-005",
    student_name: "Mahir Faisal",
    roll_number: 5,
    reg_number: "202510845605",
    class_name: "Class 10",
    attendance_rate: 72.4, // Below 75% BISE Threshold!
    pretest_gpa: 0.00, // Failed in Chemistry MCQ!
    is_eligible_for_board: false,
    ineligibility_reason: "Attendance (72.4%) is below Board statutory minimum (75%) and failed in Pre-Test Chemistry MCQ. Retake and condonation appeal required.",
    fees_cleared: false
  }
];
