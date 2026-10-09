import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BillingFinanceView: React.FC = () => {
  const { invoices, feeWaivers, approveWaiver, rejectWaiver, payments, reconcilePayment, showToast, role, activeTab } = useApp();
  const isPortalUser = role === 'student' || role === 'guardian';
  const visibleInvoices = isPortalUser ? invoices.filter((invoice) => invoice.student_id === 'stu-001') : invoices;
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'waivers' | 'gateway'>(activeTab === 'waiver_queue' ? 'waivers' : activeTab === 'payment_recon' ? 'gateway' : 'invoices');


  const totalDues = visibleInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total_amount, 0);
  const totalCollected = visibleInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0);

  const simulateBkashPay = (_invoiceId: string) => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    showToast('Demo payment verified in preview.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} style={{ color: '#fbbf24' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {isPortalUser ? 'My fees & payments' : 'Fees, Invoicing & Gateway Reconciliation'}
            </h1>
            <span className="badge badge-amber">FinTech Ready</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Multi-Channel Collection: bKash Merchant API, Nagad Direct, Sonali Bank Webhook & Counter Cash
          </p>
        </div>

        {/* Tab Switchers */}
        {!isPortalUser && <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn ${activeSubTab === 'invoices' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
            onClick={() => setActiveSubTab('invoices')}
          >
            Invoices ({visibleInvoices.length})
          </button>
          {role !== 'accountant' && <button
            className={`btn ${activeSubTab === 'waivers' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
            onClick={() => setActiveSubTab('waivers')}
          >
            Fee Waivers ({feeWaivers.filter(w => w.status === 'pending').length} Pending)
          </button>}
          <button
            className={`btn ${activeSubTab === 'gateway' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
            onClick={() => setActiveSubTab('gateway')}
          >
            Gateway Log ({payments.length})
          </button>
        </div>}
      </div>

      {/* Stats Summary */}
      {!isPortalUser && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Total Collected
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
            ৳{totalCollected.toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Outstanding Dues
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>
            ৳{totalDues.toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Active Gateways
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#60a5fa' }}>
            bKash, Nagad, Sonali Bank
          </div>
        </div>
      </div>}

      {/* Tab 1: Invoices */}
      {activeSubTab === 'invoices' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Student Tuition & Fee Invoices</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Auto-generated by monthly cron</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Invoice #</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Student</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Class / Roll</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Month</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleInvoices.map((inv) => (
                  <tr 
                    key={inv.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                      {inv.invoice_number}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                      {inv.student_name}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                      {inv.class_name} • Roll #{inv.roll_number}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-dim)' }}>
                      {inv.period_label}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                      ৳{inv.total_amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge badge-${inv.status === 'paid' ? 'green' : inv.status === 'overdue' ? 'red' : 'amber'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {isPortalUser && inv.status !== 'paid' ? (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                          onClick={() => simulateBkashPay(inv.id)}
                        >
                          <Smartphone size={13} /> Pay via bKash
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Paid & Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Fee Waivers */}
      {activeSubTab === 'waivers' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Fee Waiver Approval Queue (Principal / Admin Layer)</h3>
            <span className="badge badge-purple">Multi-Tier RBAC Approval</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Student</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Invoice</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Requested %</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Category & Reason</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Decision</th>
                </tr>
              </thead>
              <tbody>
                {feeWaivers.map((w) => (
                  <tr key={w.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#f1f5f9' }}>
                      {w.student_name}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {w.invoice_number}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#fbbf24' }}>
                      {w.percentage}%
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#c084fc', textTransform: 'capitalize' }}>{w.waiver_basis.replace('_', ' ')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{w.reason}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge badge-${w.status === 'approved' ? 'green' : w.status === 'rejected' ? 'red' : 'amber'}`}>
                        {w.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {w.status === 'pending' ? (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="btn btn-success"
                            style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                            onClick={() => approveWaiver(w.id)}
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                            onClick={() => rejectWaiver(w.id, 'Insufficient documentation')}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Decided by {w.approved_by || 'Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Gateway Log */}
      {activeSubTab === 'gateway' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Bank & Gateway API Callback Log</h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={14} /> HMAC Signed & Idempotent
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Gateway</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Transaction ID</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Invoice</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Reconciled</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#f1f5f9' }}>
                      {p.method.toUpperCase()}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#38bdf8' }}>
                      {p.transaction_id}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                      ৳{p.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                      {p.invoice_id}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-green">{p.status}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {p.reconciled ? (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> {p.reconciled_at}
                        </span>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => reconcilePayment(p.id)}
                        >
                          Reconcile Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
