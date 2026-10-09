import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, ChevronDown, LoaderCircle, LockKeyhole, Save, ShieldCheck } from 'lucide-react';
import { apiClient, isApiAuthEnabled, type ApiAccessRole, type ApiRoleAccessCatalog } from '../../services/ApiClient';
import { useApp } from '../../context/useApp';
import styles from './RoleAccessWorkspace.module.css';

export const RoleAccessWorkspace: React.FC = () => {
  const { language, showToast } = useApp();
  const isBengali = language === 'bn';
  const [catalog, setCatalog] = useState<ApiRoleAccessCatalog | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [draftPages, setDraftPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(isApiAuthEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isApiAuthEnabled) return;
    let active = true;
    apiClient.getRoleAccessCatalog()
      .then((result) => {
        if (!active) return;
        setCatalog(result);
        setSelectedRoleId(result.roles[0]?.id ?? '');
        setDraftPages(result.roles[0]?.accessible_pages ?? []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load role access.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selectedRole = catalog?.roles.find((role) => role.id === selectedRoleId);
  const groupedPages = useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const page of catalog?.pages ?? []) {
      groups.set(page.module, [...(groups.get(page.module) ?? []), page.page_id]);
    }
    return [...groups.entries()];
  }, [catalog]);

  const selectRole = (role: ApiAccessRole) => {
    setSelectedRoleId(role.id);
    setDraftPages(role.accessible_pages);
    setError('');
  };

  const togglePage = (pageId: string) => {
    setDraftPages((previous) => previous.includes(pageId)
      ? previous.filter((item) => item !== pageId)
      : [...previous, pageId]);
  };

  const save = async () => {
    if (!selectedRole) return;
    setSaving(true);
    setError('');
    try {
      const updated = await apiClient.updateRolePageAccess(selectedRole.id, draftPages);
      setCatalog((current) => current ? {
        ...current,
        roles: current.roles.map((role) => role.id === updated.id ? updated : role),
      } : current);
      setDraftPages(updated.accessible_pages);
      showToast(isBengali ? 'ভূমিকার পেজ অ্যাক্সেস সংরক্ষণ করা হয়েছে।' : 'Role page access saved.', 'success');
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Could not save role access.');
    } finally {
      setSaving(false);
    }
  };

  const pageLabel = (pageId: string) => pageId.split('.').at(-1)?.replaceAll('_', ' ') ?? pageId;

  return (
    <section style={{ display: 'grid', gap: 22 }}>
      <header className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 12, background: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}><ShieldCheck size={21} /></span>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem' }}>{isBengali ? 'ভূমিকা ও পেজ অ্যাক্সেস' : 'Roles & page access'}</h1>
          <p style={{ margin: '5px 0 0', color: 'var(--text-muted)' }}>{isBengali ? 'প্রতিটি ভূমিকার জন্য কোন কাজের পেজ দেখা যাবে তা নির্ধারণ করুন।' : 'Choose which workspace pages each institute role can open.'}</p>
        </div>
      </header>

      {!isApiAuthEnabled && <div className="card" role="status" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <LockKeyhole size={18} style={{ flex: '0 0 auto', color: 'var(--text-muted)' }} />
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{isBengali ? 'ডেমো প্রিভিউতে পরিবর্তন সংরক্ষণ হয় না। ডাটাবেসে ভূমিকা পরিচালনার জন্য API মোডে পরিষ্কার স্থানীয় ডাটাবেস ব্যবহার করুন।' : 'Demo preview does not save role changes. Use API mode with a clean local database to manage access in the database.'}</p>
      </div>}

      {error && <div role="alert" className="card" style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--accent-danger)' }}><AlertCircle size={17} />{error}</div>}
      {loading && <div className="card" role="status" style={{ display: 'flex', gap: 10, alignItems: 'center' }}><LoaderCircle size={17} className="spin" />{isBengali ? 'অ্যাক্সেস লোড হচ্ছে…' : 'Loading role access…'}</div>}

      {!loading && isApiAuthEnabled && catalog && <div className={styles.layout}>
        <nav className="card" aria-label={isBengali ? 'ইনস্টিটিউট ভূমিকা' : 'Institute roles'} style={{ display: 'grid', gap: 5, padding: 10 }}>
          {catalog.roles.map((role) => <button key={role.id} type="button" onClick={() => selectRole(role)} aria-current={selectedRoleId === role.id ? 'true' : undefined} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, width: '100%', padding: '12px 10px', border: 0, borderRadius: 9, textAlign: 'left', background: selectedRoleId === role.id ? 'var(--accent-primary-light)' : 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>
            <span><strong style={{ display: 'block' }}>{role.name}</strong><small style={{ color: 'var(--text-muted)' }}>{role.hierarchy_level} · {role.accessible_pages.length} {isBengali ? 'পেজ' : 'pages'}</small></span><ChevronDown size={15} style={{ transform: 'rotate(-90deg)', color: 'var(--text-muted)' }} />
          </button>)}
          {catalog.roles.length === 0 && <p style={{ margin: 8, color: 'var(--text-muted)' }}>{isBengali ? 'পরিচালনা করার মতো কোনো নিম্ন স্তরের ভূমিকা নেই।' : 'There are no lower level roles to manage.'}</p>}
        </nav>

        <div className="card" style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div><h2 style={{ margin: 0, fontSize: '1.05rem' }}>{selectedRole?.name ?? (isBengali ? 'ভূমিকা নির্বাচন করুন' : 'Select a role')}</h2><p style={{ margin: '5px 0 0', color: 'var(--text-muted)', fontSize: '.875rem' }}>{isBengali ? 'নির্বাচিত পেজগুলো এই ভূমিকার সকল ব্যবহারকারীর জন্য প্রযোজ্য হবে।' : 'Selected pages apply to every user assigned this role.'}</p></div>
            <button type="button" className="btn btn-primary" onClick={save} disabled={!selectedRole || saving || !isApiAuthEnabled}>
              {saving ? <LoaderCircle size={15} className="spin" /> : <Save size={15} />}{isBengali ? 'সংরক্ষণ' : 'Save access'}
            </button>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {groupedPages.map(([module, pageIds]) => <fieldset key={module} style={{ margin: 0, border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 14 }}>
              <legend style={{ padding: '0 6px', fontWeight: 700, textTransform: 'capitalize' }}>{module.replaceAll('_', ' ')}</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
                {pageIds.map((pageId) => <label key={pageId} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 8, background: draftPages.includes(pageId) ? 'var(--accent-primary-light)' : 'var(--bg-surface)' }}>
                  <input type="checkbox" checked={draftPages.includes(pageId)} disabled={!selectedRole || !isApiAuthEnabled || saving} onChange={() => togglePage(pageId)} />
                  <span style={{ flex: 1, textTransform: 'capitalize' }}>{pageLabel(pageId)}</span>{draftPages.includes(pageId) && <Check size={14} aria-hidden="true" />}
                </label>)}
              </div>
            </fieldset>)}
          </div>
        </div>
      </div>}
    </section>
  );
};
