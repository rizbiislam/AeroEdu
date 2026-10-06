import { mockInstitutes, mockUsers } from '../constants/mockData';
import type { Institute, User } from '../types';

const DEMO_PASSWORD = 'aeroedu-demo';

export type DemoAuthenticationResult =
  | { ok: true; user: User; institutes: Institute[] }
  | { ok: false; reason: 'invalid_credentials' | 'inactive_account' | 'no_institutes' };

export class DemoAuthenticationService {
  authenticate(email: string, password: string): DemoAuthenticationResult {
    const normalizedEmail = email.trim().toLocaleLowerCase();
    const user = Object.values(mockUsers).find(
      (candidate) => candidate.email.toLocaleLowerCase() === normalizedEmail
    );

    if (!user || password !== DEMO_PASSWORD) {
      return { ok: false, reason: 'invalid_credentials' };
    }

    if (user.status !== 'active') {
      return { ok: false, reason: 'inactive_account' };
    }

    const institutes = user.role === 'super_admin'
      ? mockInstitutes.filter((institute) => institute.status !== 'suspended')
      : mockInstitutes.filter((institute) => institute.id === user.institute_id);

    if (institutes.length === 0) {
      return { ok: false, reason: 'no_institutes' };
    }

    return { ok: true, user, institutes };
  }
}
