import { mockInstitutes, mockUsers } from '../constants/mockData';
import type { Institute, User } from '../types';
import { getDemoNavigationForRole } from '../config/roleNavigation';

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

    const demoUser: User = {
      ...user,
      accessible_pages: [...getDemoNavigationForRole(user.role)],
      permissions: user.hierarchy_level >= 90
        ? ['institute.settings.edit', 'billing.settings.edit']
        : []
    };
    return { ok: true, user: demoUser, institutes };
  }
}
