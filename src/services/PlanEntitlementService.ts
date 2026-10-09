import type { PlanTier } from '../types';

// Local preview of subscription_plans + plan_entitlements. Production access is always
// returned by the API; this fixture only drives the demo navigation.
const demoEntitlements: Record<PlanTier, Readonly<Record<string, boolean>>> = {
  starter: { 'module.timetable': false, 'module.library': false, 'module.transport': false, 'module.hostel': false, 'module.api_access': false },
  growth: { 'module.timetable': true, 'module.library': true, 'module.transport': true, 'module.hostel': false, 'module.api_access': false },
  enterprise: { 'module.timetable': true, 'module.library': true, 'module.transport': true, 'module.hostel': true, 'module.api_access': true }
};

const pageEntitlements: Record<string, string> = {
  routine: 'module.timetable',
  library: 'module.library',
  transport: 'module.transport',
  hostel: 'module.hostel',
  api_access: 'module.api_access'
};

export class PlanEntitlementService {
  hasPageEntitlement(plan: PlanTier, pageId: string): boolean {
    const featureKey = pageEntitlements[pageId];
    return !featureKey || demoEntitlements[plan][featureKey] === true;
  }
}
