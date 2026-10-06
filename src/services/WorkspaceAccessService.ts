import type { NavItem } from '../config/roleNavigation';

export class WorkspaceAccessService {
  private readonly accessiblePageIds: ReadonlySet<string>;

  constructor(accessiblePageIds: Iterable<string>) {
    this.accessiblePageIds = new Set(accessiblePageIds);
  }

  getAvailableWorkspaces(navigation: readonly NavItem[]): NavItem[] {
    return navigation.filter((item) => this.canAccess(item.id));
  }

  canAccess(pageId: string): boolean {
    return this.accessiblePageIds.has(pageId);
  }
}
