import React, { useEffect, useRef, useState } from 'react';
import { Building2, Plus, Trash2, WalletCards } from 'lucide-react';
import { useApp } from '../../context/useApp';
import type { InstitutePaymentAccount } from '../../types';
import { InstituteConfigurationService } from '../../services/InstituteConfigurationService';
import { apiClient, type ApiPaymentAccount, isApiAuthEnabled } from '../../services/ApiClient';
import styles from './InstitutePaymentAccounts.module.css';

const emptyAccount = (): InstitutePaymentAccount => ({
  id: `draft-${crypto.randomUUID()}`,
  bank_name: '', account_name: '', account_number: '', payment_method: 'bank_transfer',
  is_active: true
});

export const InstitutePaymentAccounts: React.FC = () => {
  const { currentInstitute, updateInstitute, can, showToast } = useApp();
  const [accounts, setAccounts] = useState<InstitutePaymentAccount[]>(currentInstitute.payment_accounts ?? []);
  const [loadedInstituteId, setLoadedInstituteId] = useState(isApiAuthEnabled ? '' : currentInstitute.id);
  const [isSaving, setIsSaving] = useState(false);
  const [failedInstituteId, setFailedInstituteId] = useState('');
  const isLoading = isApiAuthEnabled && loadedInstituteId !== currentInstitute.id && failedInstituteId !== currentInstitute.id;
  const loadError = failedInstituteId === currentInstitute.id;
  const originalAccounts = useRef<InstitutePaymentAccount[]>(currentInstitute.payment_accounts ?? []);
  const configurationService = new InstituteConfigurationService();
  const canEdit = can('institute.settings.edit') || can('billing.settings.edit');

  useEffect(() => {
    if (!isApiAuthEnabled) return;
    let cancelled = false;
    void apiClient.getPaymentAccounts().then((rows) => {
      if (cancelled) return;
      const mapped = rows.map(fromApiAccount);
      setAccounts(mapped);
      originalAccounts.current = mapped;
      setLoadedInstituteId(currentInstitute.id);
      setFailedInstituteId('');
    }).catch(() => {
      if (!cancelled) setFailedInstituteId(currentInstitute.id);
    });
    return () => { cancelled = true; };
  }, [currentInstitute.id]);

  const patchAccount = (id: string, patch: Partial<InstitutePaymentAccount>) =>
    setAccounts((all) => all.map((account) => account.id === id ? { ...account, ...patch } : account));

  const save = async () => {
    const validationError = configurationService.validatePaymentAccounts(accounts);
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }
    if (!isApiAuthEnabled) {
      updateInstitute({ payment_accounts: accounts });
      showToast('Institute payment settings saved in this preview.', 'success');
      return;
    }

    setIsSaving(true);
    try {
      const previous = new Map(originalAccounts.current.map((account) => [account.id, account]));
      const currentIds = new Set(accounts.filter((account) => !account.id.startsWith('draft-')).map((account) => account.id));
      for (const oldAccount of originalAccounts.current) {
        if (!currentIds.has(oldAccount.id)) await apiClient.deletePaymentAccount(oldAccount.id);
      }
      for (const [index, account] of accounts.entries()) {
        const payload = toApiAccount(account, index);
        if (account.id.startsWith('draft-')) {
          await apiClient.createPaymentAccount(payload);
        } else if (JSON.stringify(previous.get(account.id)) !== JSON.stringify(account)) {
          await apiClient.updatePaymentAccount(account.id, payload);
        }
      }
      const saved = (await apiClient.getPaymentAccounts()).map(fromApiAccount);
      setAccounts(saved);
      originalAccounts.current = saved;
      setLoadedInstituteId(currentInstitute.id);
      setFailedInstituteId('');
      showToast('Institute payment settings saved.', 'success');
    } catch {
      try {
        const latest = (await apiClient.getPaymentAccounts()).map(fromApiAccount);
        setAccounts(latest);
        originalAccounts.current = latest;
        setLoadedInstituteId(currentInstitute.id);
        setFailedInstituteId('');
        showToast('Some changes could not be saved. The list now shows the latest saved accounts.', 'error');
      } catch {
        setFailedInstituteId(currentInstitute.id);
        showToast('Some changes may have been saved. Reload the account list before trying again.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <span className={styles.icon}><Building2 size={19} /></span>
        <div><h1>Institute payment settings</h1><p>Configure the bank accounts and payment instructions for {currentInstitute.name}.</p></div>
      </header>
      <div className={styles.panel}>
        <div className={styles.panelHeader}><div><h2>Payment accounts</h2><p>Each institute keeps its own collection details and instructions.</p></div>
          {canEdit && <button className={styles.secondary} type="button" onClick={() => setAccounts((all) => [...all, emptyAccount()])}><Plus size={16} /> Add account</button>}
        </div>
        {isLoading && <div className={styles.empty} role="status">Loading institute payment accounts...</div>}
        {loadError && <div className={styles.empty} role="alert">Could not load saved accounts. Check the connection and reload this page.</div>}
        {!isLoading && !loadError && accounts.length === 0 && <div className={styles.empty}><WalletCards size={22} /><span>No payment accounts have been configured.</span></div>}
        {!isLoading && !loadError && accounts.map((account) => <article className={styles.account} key={account.id}>
          <div className={styles.accountTitle}><WalletCards size={17} /><strong>{account.bank_name || 'New payment account'}</strong>{canEdit && <button className={styles.remove} type="button" aria-label="Remove account" onClick={() => setAccounts((all) => all.filter((item) => item.id !== account.id))}><Trash2 size={16} /></button>}</div>
          <div className={styles.fields}>
            <label>Bank or provider<input disabled={!canEdit} value={account.bank_name} onChange={(event) => patchAccount(account.id, { bank_name: event.target.value })} placeholder="Bank name or bKash" /></label>
            <label>Account holder<input disabled={!canEdit} value={account.account_name} onChange={(event) => patchAccount(account.id, { account_name: event.target.value })} /></label>
            <label>Account or wallet number<input disabled={!canEdit} value={account.account_number} onChange={(event) => patchAccount(account.id, { account_number: event.target.value })} /></label>
            <label>Payment type<select disabled={!canEdit} value={account.payment_method} onChange={(event) => patchAccount(account.id, { payment_method: event.target.value as InstitutePaymentAccount['payment_method'] })}><option value="bank_transfer">Bank transfer</option><option value="bkash">bKash</option><option value="nagad">Nagad</option></select></label>
            <label>Branch<input disabled={!canEdit} value={account.branch_name ?? ''} onChange={(event) => patchAccount(account.id, { branch_name: event.target.value })} /></label>
            <label>Routing number<input disabled={!canEdit} value={account.routing_number ?? ''} onChange={(event) => patchAccount(account.id, { routing_number: event.target.value })} /></label>
            <label className={styles.wide}>Payment instructions<textarea disabled={!canEdit} value={account.instructions ?? ''} onChange={(event) => patchAccount(account.id, { instructions: event.target.value })} rows={2} /></label>
          </div>
        </article>)}
        {canEdit && accounts.length > 0 && !loadError && <div className={styles.footer}><button className={styles.primary} type="button" disabled={isSaving || isLoading} onClick={() => void save()}>{isSaving ? 'Saving...' : 'Save settings'}</button></div>}
        {!canEdit && <p className={styles.readOnly}>You can view payment settings. Your account does not have permission to edit them.</p>}
      </div>
    </section>
  );
};

function fromApiAccount(account: ApiPaymentAccount): InstitutePaymentAccount {
  return {
    id: account.id,
    bank_name: account.provider_name,
    account_name: account.account_name,
    account_number: account.account_number,
    payment_method: account.payment_method,
    branch_name: account.branch_name,
    routing_number: account.routing_number,
    instructions: account.instructions,
    is_active: account.is_active,
  };
}

function toApiAccount(account: InstitutePaymentAccount, displayOrder: number): Omit<ApiPaymentAccount, 'id'> {
  return {
    provider_name: account.bank_name,
    account_name: account.account_name,
    account_number: account.account_number,
    payment_method: account.payment_method,
    branch_name: account.branch_name ?? '',
    routing_number: account.routing_number ?? '',
    instructions: account.instructions ?? '',
    is_active: account.is_active,
    display_order: displayOrder,
  };
}
