const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '');
export const isApiAuthEnabled = import.meta.env.VITE_AUTH_MODE !== 'demo';

let accessToken: string | null = null;
let refreshInFlight: Promise<string> | null = null;

export interface ApiUser {
  id: string;
  institute_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  hierarchy_level: number;
  status: 'active' | 'suspended' | 'inactive';
  locale?: string;
}

export interface ApiInstitute {
  id: string;
  name: string;
  slug: string;
  institute_type: string;
  eiin: string;
  logo_url?: string;
  seal_url?: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  status: string;
}

export interface ApiSession {
  access: string;
  user: ApiUser;
  accessible_pages: string[];
  permissions: string[];
}

export interface ApiPaymentAccount {
  id: string;
  provider_name: string;
  account_name: string;
  account_number: string;
  payment_method: 'bank_transfer' | 'bkash' | 'nagad';
  branch_name: string;
  routing_number: string;
  instructions: string;
  is_active: boolean;
  display_order: number;
}

export interface ApiAccessPage {
  page_id: string;
  module: string;
}

export interface ApiAccessRole {
  id: string;
  name: string;
  code: string;
  hierarchy_level: number;
  accessible_pages: string[];
}

export interface ApiRoleAccessCatalog {
  roles: ApiAccessRole[];
  pages: ApiAccessPage[];
}

export interface ApiAcademicYear { id: string; name: string; is_current: boolean }
export interface ApiAcademicClass { id: string; name: string; code: string; academic_year: string; ordering: number; is_active: boolean }
export interface ApiAcademicSection { id: string; class_id: string; class_name: string; name: string; capacity: number | null; class_teacher_id: string | null; class_teacher_name?: string | null; is_active: boolean }
export interface ApiAcademicSubject { id: string; name: string; code: string; is_optional: boolean; total_marks: string | number; pass_marks: string | number; is_active: boolean }
export interface ApiClassSubject { id: string; class_id: string; class_name: string; subject_id: string; subject_name: string; teacher_id: string | null; teacher_name?: string | null; is_active: boolean }
export interface ApiStudent {
  id: string;
  institute_id: string;
  admission_no: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string;
  section_id: string | null;
  section_name: string | null;
  class_id: string | null;
  class_name: string | null;
  photo_url: string;
  admission_date: string;
  status: 'active' | 'graduated' | 'transferred' | 'suspended';
  metadata: Record<string, unknown>;
}
export type ApiStudentDraft = Pick<ApiStudent, 'admission_no' | 'full_name' | 'date_of_birth' | 'gender' | 'section_id' | 'admission_date' | 'status'> & { photo_url?: string; metadata?: Record<string, unknown> };
export interface ApiPage<T> { count: number; next: string | null; previous: string | null; results: T[] }
export interface ApiStudentSummary { total: number; active: number; unassigned: number }

export interface ApiAssessment {
  id: string;
  institute_id: string;
  academic_year_id: string;
  academic_year_name: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_id: string;
  subject_name: string;
  title: string;
  kind: 'quiz' | 'assignment' | 'exam' | 'board_exam';
  evaluation_mode: 'points' | 'components' | 'rubric';
  evaluation_criteria: Array<{ name: string; weight: number }>;
  max_score: string | number;
  pass_score: string | number;
  due_at: string;
  evaluator_id: string | null;
  evaluator_name: string | null;
  status: 'draft' | 'scheduled' | 'marking' | 'completed';
}

export interface ApiAssessmentDraft {
  title: string;
  kind: ApiAssessment['kind'];
  class_id: string;
  section_id: string;
  subject_id: string;
  evaluation_mode: ApiAssessment['evaluation_mode'];
  evaluation_criteria: ApiAssessment['evaluation_criteria'];
  max_score: number;
  pass_score: number;
  due_at: string;
  evaluator_id: string;
}

export type ApiAcademicYearDraft = Omit<ApiAcademicYear, 'id'> & { start_date: string; end_date: string };
export interface ApiAcademicClassDraft { academic_year: string; name: string; code: string; ordering: number; is_active: boolean }
export interface ApiAcademicSectionDraft { class_id: string; name: string; capacity: number | null; class_teacher_id: string | null; is_active: boolean }
export interface ApiAcademicSubjectDraft { name: string; code: string; is_optional: boolean; total_marks: number; pass_marks: number; is_active: boolean }
export interface ApiClassSubjectDraft { class_id: string; subject_id: string; teacher_id: string | null; is_active: boolean }

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function decodeError(response: Response): Promise<ApiError> {
  let payload: { error?: { code?: string; message?: string }; detail?: string } = {};
  try {
    payload = await response.json();
  } catch {
    // Keep a useful error even when a proxy returns a non-JSON response.
  }
  return new ApiError(
    payload.error?.message ?? payload.detail ?? `Request failed (${response.status})`,
    response.status,
    payload.error?.code,
  );
}

async function getCollection<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  while (true) {
    const separator = path.includes('?') ? '&' : '?';
    const result = await request<T[] | { count?: number; next?: string | null; results: T[] }>(`${path}${separator}page=${page}`);
    if (Array.isArray(result)) return page === 1 ? result : [...items, ...result];
    items.push(...result.results);
    if (!result.next || result.results.length === 0 || (result.count !== undefined && items.length >= result.count)) return items;
    page += 1;
  }
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && retry && accessToken && path !== '/auth/refresh/') {
    await refreshAccessToken();
    return request<T>(path, init, false);
  }
  if (!response.ok) throw await decodeError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = request<{ access: string }>('/auth/refresh/', { method: 'POST' }, false)
      .then(({ access }) => {
        accessToken = access;
        return access;
      })
      .catch((error: unknown) => {
        accessToken = null;
        throw error;
      })
      .finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

export const apiClient = {
  async login(email: string, password: string, instituteSlug: string): Promise<ApiSession> {
    const headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' });
    headers.set('X-Institute-Slug', instituteSlug);
    const response = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw await decodeError(response);
    const session = await response.json() as ApiSession;
    accessToken = session.access;
    return session;
  },

  async getCurrentInstitute(): Promise<ApiInstitute> {
    return request<ApiInstitute>('/institutes/current/');
  },

  async getPaymentAccounts(): Promise<ApiPaymentAccount[]> {
    const result = await request<ApiPaymentAccount[] | { results: ApiPaymentAccount[] }>('/institutes/current/payment-accounts/');
    return Array.isArray(result) ? result : result.results;
  },

  getRoleAccessCatalog(): Promise<ApiRoleAccessCatalog> {
    return request<ApiRoleAccessCatalog>('/users/roles/access/');
  },

  updateRolePageAccess(roleId: string, accessiblePages: string[]): Promise<ApiAccessRole> {
    return request<ApiAccessRole>(`/users/roles/${encodeURIComponent(roleId)}/page-access/`, {
      method: 'PATCH',
      body: JSON.stringify({ accessible_pages: accessiblePages }),
    });
  },

  async getAcademicCatalog() {
    const [years, classes, sections, subjects, classSubjects] = await Promise.all([
      getCollection<ApiAcademicYear>('/academic-years/'),
      getCollection<ApiAcademicClass>('/classes/'),
      getCollection<ApiAcademicSection>('/sections/'),
      getCollection<ApiAcademicSubject>('/subjects/'),
      getCollection<ApiClassSubject>('/class-subjects/'),
    ]);
    return { years, classes, sections, subjects, classSubjects };
  },

  createAcademicYear(draft: ApiAcademicYearDraft): Promise<ApiAcademicYear> {
    return request<ApiAcademicYear>('/academic-years/', { method: 'POST', body: JSON.stringify(draft) });
  },

  createAcademicClass(draft: ApiAcademicClassDraft): Promise<ApiAcademicClass> {
    return request<ApiAcademicClass>('/classes/', { method: 'POST', body: JSON.stringify(draft) });
  },

  createAcademicSection(draft: ApiAcademicSectionDraft): Promise<ApiAcademicSection> {
    return request<ApiAcademicSection>('/sections/', { method: 'POST', body: JSON.stringify(draft) });
  },

  createAcademicSubject(draft: ApiAcademicSubjectDraft): Promise<ApiAcademicSubject> {
    return request<ApiAcademicSubject>('/subjects/', { method: 'POST', body: JSON.stringify(draft) });
  },

  createClassSubject(draft: ApiClassSubjectDraft): Promise<ApiClassSubject> {
    return request<ApiClassSubject>('/class-subjects/', { method: 'POST', body: JSON.stringify(draft) });
  },

  getAssessments(): Promise<ApiAssessment[]> {
    return getCollection<ApiAssessment>('/exams/assessments/');
  },

  createAssessment(draft: ApiAssessmentDraft): Promise<ApiAssessment> {
    return request<ApiAssessment>('/exams/assessments/', {
      method: 'POST',
      body: JSON.stringify(draft),
    });
  },

  createPaymentAccount(account: Omit<ApiPaymentAccount, 'id'>): Promise<ApiPaymentAccount> {
    return request<ApiPaymentAccount>('/institutes/current/payment-accounts/', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  },

  updatePaymentAccount(id: string, account: Omit<ApiPaymentAccount, 'id'>): Promise<ApiPaymentAccount> {
    return request<ApiPaymentAccount>(`/institutes/current/payment-accounts/${encodeURIComponent(id)}/`, {
      method: 'PATCH',
      body: JSON.stringify(account),
    });
  },

  deletePaymentAccount(id: string): Promise<void> {
    return request<void>(`/institutes/current/payment-accounts/${encodeURIComponent(id)}/`, { method: 'DELETE' });
  },

  async getSession(): Promise<Omit<ApiSession, 'access'>> {
    return request<Omit<ApiSession, 'access'>>('/auth/session/');
  },

  async restoreSession(): Promise<Omit<ApiSession, 'access'>> {
    await refreshAccessToken();
    return this.getSession();
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout/', { method: 'POST' }, false);
    } finally {
      accessToken = null;
    }
  },

  getStudentPage(filters: { search?: string; status?: string; page?: number }): Promise<ApiPage<ApiStudent>> {
    const query = new URLSearchParams();
    if (filters.search) query.set('search', filters.search);
    if (filters.status && filters.status !== 'all') query.set('status', filters.status);
    query.set('page', String(filters.page ?? 1));
    return request<ApiPage<ApiStudent>>(`/students/?${query.toString()}`);
  },

  getStudentSummary(): Promise<ApiStudentSummary> {
    return request<ApiStudentSummary>('/students/summary/');
  },

  createStudent(draft: ApiStudentDraft): Promise<ApiStudent> {
    return request<ApiStudent>('/students/', { method: 'POST', body: JSON.stringify(draft) });
  },

  updateStudent(id: string, draft: ApiStudentDraft): Promise<ApiStudent> {
    return request<ApiStudent>(`/students/${encodeURIComponent(id)}/`, { method: 'PATCH', body: JSON.stringify(draft) });
  },

  archiveStudent(id: string): Promise<void> {
    return request<void>(`/students/${encodeURIComponent(id)}/`, { method: 'DELETE' });
  },
};
