// AeroEdu App State & Reactive Store
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  RoleType, Language, Institute, User, Student, StaffMember, Exam, 
  ExamScheduleItem, AdmitCard, MarkEntry, Invoice, FeeWaiverRequest, 
  PaymentTransaction, AuditLog, SupportTicket, RoutineItem, Announcement,
  StudentAcademicResult, AdmissionApplication, TeacherLeaveRequest, BoardComplianceRecord
} from '../types';
import { 
  mockInstitutes, mockUsers, mockStudents, mockStaff, mockExams, mockExamSchedules, 
  mockAdmitCards, mockMarks, mockInvoices, mockFeeWaivers, mockPayments, 
  mockAuditLogs, mockSupportTickets, mockRoutine, mockAnnouncements,
  mockAcademicResults, mockAdmissions, mockTeacherLeaves, mockBoardCompliance
} from '../constants/mockData';
import { translations } from '../constants/translations';
import { getNavItemsForRole, type NavItem } from '../config/roleNavigation';
import { WorkspaceAccessService } from '../services/WorkspaceAccessService';
import { DemoAuthenticationService } from '../services/DemoAuthenticationService';
import confetti from 'canvas-confetti';
import { AcademicResultEntity } from '../models/AcademicResultEntity';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  role: RoleType;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUser: User;
  currentInstitute: Institute;
  availableInstitutes: Institute[];
  needsInstituteSelection: boolean;
  selectInstitute: (instituteId: string) => boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  availableWorkspaces: NavItem[];
  openWorkspace: (pageId: string) => void;
  t: typeof translations['en'];

  // Data states
  students: Student[];
  staff: StaffMember[];
  exams: Exam[];
  examSchedules: ExamScheduleItem[];
  admitCards: AdmitCard[];
  marks: MarkEntry[];
  invoices: Invoice[];
  feeWaivers: FeeWaiverRequest[];
  payments: PaymentTransaction[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
  routine: RoutineItem[];
  announcements: Announcement[];
  attendanceRecords: Record<string, 'present' | 'absent' | 'late' | 'excused'>;
  academicResults: StudentAcademicResult[];
  admissions: AdmissionApplication[];
  teacherLeaves: TeacherLeaveRequest[];
  boardCompliance: BoardComplianceRecord[];

  // Auth lifecycle
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => 'invalid_credentials' | 'inactive_account' | 'no_institutes' | null;
  logout: () => void;

  // Actions
  updateAttendance: (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => void;
  markAllPresent: () => void;
  updateMark: (studentId: string, marks: number) => void;
  updateSubjectScore: (studentId: string, subjectCode: string, field: 'cq' | 'mcq' | 'pr', val: number) => void;
  approveAdmission: (appId: string) => void;
  approveLeave: (leaveId: string) => void;
  rejectLeave: (leaveId: string) => void;
  approveWaiver: (waiverId: string) => void;
  rejectWaiver: (waiverId: string, reason: string) => void;
  requestWaiver: (request: Partial<FeeWaiverRequest>) => void;
  reconcilePayment: (paymentId: string) => void;
  publishExamResults: (examId: string) => void;
  createSupportTicket: (ticket: Partial<SupportTicket>) => void;
  submitCSAT: (ticketId: string, rating: number) => void;
  selectedAdmitCard: AdmitCard | null;
  setSelectedAdmitCard: (card: AdmitCard | null) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<RoleType>('institute_admin');
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Data Collections
  const [currentInstitute, setCurrentInstitute] = useState<Institute>(mockInstitutes[0]);
  const [availableInstitutes, setAvailableInstitutes] = useState<Institute[]>([]);
  const [hasSelectedInstitute, setHasSelectedInstitute] = useState(false);
  const [students] = useState<Student[]>(mockStudents);
  const [staff] = useState<StaffMember[]>(mockStaff);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [examSchedules] = useState<ExamScheduleItem[]>(mockExamSchedules);
  const [admitCards] = useState<AdmitCard[]>(mockAdmitCards);
  const [marks, setMarks] = useState<MarkEntry[]>(mockMarks);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [feeWaivers, setFeeWaivers] = useState<FeeWaiverRequest[]>(mockFeeWaivers);
  const [payments, setPayments] = useState<PaymentTransaction[]>(mockPayments);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [routine] = useState<RoutineItem[]>(mockRoutine);
  const [announcements] = useState<Announcement[]>(mockAnnouncements);
  const [selectedAdmitCard, setSelectedAdmitCard] = useState<AdmitCard | null>(mockAdmitCards[0]);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Administrative and Grading datasets
  const [academicResults, setAcademicResults] = useState<StudentAcademicResult[]>(mockAcademicResults);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(mockAdmissions);
  const [teacherLeaves, setTeacherLeaves] = useState<TeacherLeaveRequest[]>(mockTeacherLeaves);
  const [boardCompliance] = useState<BoardComplianceRecord[]>(mockBoardCompliance);

  // Attendance live map (studentId -> status)
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({
    'stu-001': 'present',
    'stu-002': 'present',
    'stu-003': 'present',
    'stu-004': 'present',
    'stu-005': 'present'
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply theme to html document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentUser = authenticatedUser || mockUsers[role] || mockUsers['institute_admin'];
  const t = translations[language];
  // The local demo derives page access from role navigation; production auth should supply API page IDs.
  const roleNavigation = getNavItemsForRole(role, t, {
    pendingWaivers: feeWaivers.filter(waiver => waiver.status === 'pending').length,
    openTickets: supportTickets.filter(ticket => ticket.status === 'open').length,
    pendingAdminActions:
      admissions.filter(application => application.status === 'pending' || application.status === 'interview_scheduled').length +
      teacherLeaves.filter(leave => leave.status === 'pending').length
  });
  const workspaceAccess = new WorkspaceAccessService(roleNavigation.map(item => item.id));
  const availableWorkspaces = workspaceAccess.getAvailableWorkspaces(roleNavigation);

  const openWorkspace = (pageId: string) => {
    if (!workspaceAccess.canAccess(pageId)) {
      showToast(t.portal_access_denied, 'error');
      return;
    }

    setActiveTab(pageId);
    setIsAuthenticated(true);
  };

  // Actions implementation
  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const next: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    students.forEach(s => {
      next[s.id] = 'present';
    });
    setAttendanceRecords(next);
    showToast('All students marked Present for today! (Attendance batch synced)', 'success');
  };

  const updateMark = (studentId: string, marksObtained: number) => {
    let grade = 'F';
    let gpa = 0.0;
    if (marksObtained >= 80) { grade = 'A+'; gpa = 5.0; }
    else if (marksObtained >= 70) { grade = 'A'; gpa = 4.0; }
    else if (marksObtained >= 60) { grade = 'A-'; gpa = 3.5; }
    else if (marksObtained >= 50) { grade = 'B'; gpa = 3.0; }
    else if (marksObtained >= 40) { grade = 'C'; gpa = 2.0; }
    else if (marksObtained >= 33) { grade = 'D'; gpa = 1.0; }

    setMarks(prev => prev.map(m => m.student_id === studentId ? {
      ...m,
      marks_obtained: marksObtained,
      grade,
      gpa,
      updated_at: new Date().toISOString().split('T')[0]
    } : m));

    // Append to audit log
    const stu = students.find(s => s.id === studentId);
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        actor_id: currentUser.id,
        actor_name: currentUser.full_name,
        actor_role: currentUser.role,
        action: 'marks.updated',
        entity_type: 'marks',
        entity_id: studentId,
        entity_label: `${stu?.full_name || 'Student'} Math Mark`,
        ip_address: '103.114.98.45',
        user_agent: 'AeroEdu React Client',
        new_values: { marks: marksObtained, grade, gpa },
        anomaly_flag: marksObtained > 95,
        anomaly_reason: marksObtained > 95 ? 'High mark threshold review' : undefined,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    showToast(`Saved marks for ${stu?.full_name}: ${marksObtained}/100 (Grade: ${grade})`, 'success');
  };

  const approveWaiver = (waiverId: string) => {
    const waiver = feeWaivers.find(w => w.id === waiverId);
    if (!waiver) return;

    setFeeWaivers(prev => prev.map(w => w.id === waiverId ? {
      ...w,
      status: 'approved',
      approved_by: currentUser.full_name,
      approved_at: new Date().toLocaleString()
    } : w));

    // Update corresponding invoice
    setInvoices(prev => prev.map(inv => {
      if (inv.id === waiver.invoice_id) {
        const discount = (inv.total_amount * (waiver.percentage || 50)) / 100;
        return {
          ...inv,
          waiver_amount: discount,
          total_amount: inv.total_amount - discount,
          status: 'paid'
        };
      }
      return inv;
    }));

    // Add to audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        actor_id: currentUser.id,
        actor_name: currentUser.full_name,
        actor_role: currentUser.role,
        action: 'fee_waiver.approved',
        entity_type: 'fee_waivers',
        entity_id: waiverId,
        entity_label: `Waiver #${waiverId} (${waiver.student_name})`,
        ip_address: '103.114.98.22',
        user_agent: 'AeroEdu Web',
        new_values: { status: 'approved', percentage: waiver.percentage },
        anomaly_flag: false,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    showToast(`Fee waiver approved! Invoice ${waiver.invoice_number} adjusted.`, 'success');
  };

  const rejectWaiver = (waiverId: string, reason: string) => {
    setFeeWaivers(prev => prev.map(w => w.id === waiverId ? {
      ...w,
      status: 'rejected',
      rejection_reason: reason
    } : w));
    showToast(`Fee waiver request #${waiverId} rejected.`, 'info');
  };

  const requestWaiver = (req: Partial<FeeWaiverRequest>) => {
    const newWaiver: FeeWaiverRequest = {
      id: `waiver-${Date.now().toString().slice(-4)}`,
      invoice_id: req.invoice_id || 'inv-2026-1001',
      invoice_number: req.invoice_number || 'INV-2026-10-00142',
      student_id: req.student_id || 'stu-001',
      student_name: req.student_name || 'Ahmed Sifat',
      class_name: req.class_name || 'Class 10',
      original_amount: req.original_amount || 3300,
      waiver_type: req.waiver_type || 'standard',
      waiver_basis: req.waiver_basis || 'merit',
      percentage: req.percentage || 50,
      reason: req.reason || 'Academic excellence recommendation',
      status: 'pending',
      requested_by: currentUser.full_name,
      requested_at: new Date().toLocaleString()
    };
    setFeeWaivers(prev => [newWaiver, ...prev]);
    showToast('Waiver request submitted! Sent to Institute Admin approval queue.', 'success');
  };

  const reconcilePayment = (paymentId: string) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? {
      ...p,
      reconciled: true,
      reconciled_at: new Date().toLocaleString()
    } : p));
    showToast('Payment reconciled successfully with digital gateway report!', 'success');
  };

  const publishExamResults = (examId: string) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, status: 'published' } : e));
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    showToast('Exam results LOCKED & PUBLISHED! SMS & in-app alerts dispatched to guardians.', 'success');
  };

  const createSupportTicket = (ticket: Partial<SupportTicket>) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Math.floor(1000 + Math.random() * 9000)}`,
      ticket_number: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      institute_id: currentInstitute.id,
      institute_name: currentInstitute.name,
      category: ticket.category || 'technical',
      priority: ticket.priority || 'medium',
      status: 'open',
      subject: ticket.subject || 'Support Request',
      description: ticket.description || '',
      sla_target_response_hours: ticket.priority === 'urgent' ? 1 : ticket.priority === 'high' ? 2 : 4,
      sla_breached: false,
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender_name: currentUser.full_name,
          sender_role: 'user',
          message: ticket.description || '',
          created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    showToast(`Support Ticket #${newTicket.ticket_number} created! Assigned to tier-1 queue.`, 'success');
  };

  const submitCSAT = (ticketId: string, rating: number) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, csat_rating: rating, status: 'resolved' } : t));
    confetti({ particleCount: 50, spread: 50 });
    showToast(`Thank you! CSAT rating of ${rating}/5 submitted.`, 'success');
  };

  const signIn = (email: string, password: string) => {
    const result = new DemoAuthenticationService().authenticate(email, password);
    if (!result.ok) return result.reason;

    setAuthenticatedUser(result.user);
    setRoleState(result.user.role);
    setAvailableInstitutes(result.institutes);
    setIsAuthenticated(true);

    if (result.institutes.length === 1) {
      setCurrentInstitute(result.institutes[0]);
      setHasSelectedInstitute(true);
      setLandingTab(result.user.role);
    } else {
      setHasSelectedInstitute(false);
    }

    return null;
  };

  const setLandingTab = (targetRole: RoleType) => {
    if (targetRole === 'super_admin') setActiveTab('overview');
    else if (targetRole === 'institute_admin') setActiveTab('overview');
    else if (targetRole === 'class_teacher') setActiveTab('attendance_entry');
    else if (targetRole === 'teacher') setActiveTab('grades');
    else if (targetRole === 'exam_controller') setActiveTab('grades');
    else if (targetRole === 'accountant') setActiveTab('billing');
    else if (targetRole === 'student') setActiveTab('student_home');
    else if (targetRole === 'guardian') setActiveTab('guardian_home');
    else setActiveTab('overview');
  };

  const selectInstitute = (instituteId: string) => {
    const institute = availableInstitutes.find((item) => item.id === instituteId);
    if (!institute) {
      showToast(translations[language].portal_access_denied, 'error');
      return false;
    }

    setCurrentInstitute(institute);
    setHasSelectedInstitute(true);
    setLandingTab(role);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    setAvailableInstitutes([]);
    setHasSelectedInstitute(false);
    showToast('Signed out of session.', 'info');
  };

  const updateSubjectScore = (studentId: string, subjectCode: string, field: 'cq' | 'mcq' | 'pr', val: number) => {
    setAcademicResults(prev => prev.map(res => {
      if (res.student_id !== studentId) return res;
      const entity = AcademicResultEntity.fromJSON(res);
      entity.updateScore(subjectCode, field, val);
      return entity.toJSON();
    }));
  };

  const approveAdmission = (appId: string) => {
    setAdmissions(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
    confetti({ particleCount: 40, spread: 60 });
    showToast('Admission application approved! Roll number and Section assigned.', 'success');
  };

  const approveLeave = (leaveId: string) => {
    setTeacherLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'approved' } : l));
    showToast('Teacher leave request approved. Substitute teacher notified.', 'success');
  };

  const rejectLeave = (leaveId: string) => {
    setTeacherLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'rejected' } : l));
    showToast('Teacher leave request declined.', 'info');
  };

  return (
    <AppContext.Provider value={{
      role,
      language,
      setLanguage,
      theme,
      toggleTheme,
      currentUser,
      currentInstitute,
      availableInstitutes,
      needsInstituteSelection: isAuthenticated && availableInstitutes.length > 1 && !hasSelectedInstitute,
      selectInstitute,
      activeTab,
      setActiveTab,
      availableWorkspaces,
      openWorkspace,
      t,
      students,
      staff,
      exams,
      examSchedules,
      admitCards,
      marks,
      invoices,
      feeWaivers,
      payments,
      auditLogs,
      supportTickets,
      routine,
      announcements,
      attendanceRecords,
      academicResults,
      admissions,
      teacherLeaves,
      boardCompliance,
      isAuthenticated,
      signIn,
      logout,
      updateAttendance,
      markAllPresent,
      updateMark,
      updateSubjectScore,
      approveAdmission,
      approveLeave,
      rejectLeave,
      approveWaiver,
      rejectWaiver,
      requestWaiver,
      reconcilePayment,
      publishExamResults,
      createSupportTicket,
      submitCSAT,
      selectedAdmitCard,
      setSelectedAdmitCard,
      toasts,
      showToast,
      dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
