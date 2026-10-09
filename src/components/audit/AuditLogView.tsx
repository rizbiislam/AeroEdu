import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  History,
  ShieldCheck,
  AlertTriangle,
  Search
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.entity_label || log.entity_type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} style={{ color: '#60a5fa' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Immutable Audit Log & Security Timeline
            </h1>
            <span className="badge badge-blue">Append-Only</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Every state-mutating action is recorded with Actor ID, Role, IP Address, Payload Diff, and Anomaly Heuristics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Filter by action or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: '#f1f5f9',
                fontSize: '0.8125rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actor</th>
                <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Action</th>
                <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Entity Target</th>
                <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Payload / Diff</th>
                <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>IP & Client</th>
                <th style={{ padding: '12px 18px', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Flag</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {log.created_at}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{log.actor_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{log.actor_role}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge badge-blue" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#c084fc', fontWeight: 500 }}>
                    {log.entity_label}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <code style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      background: 'var(--bg-surface)',
                      padding: '3px 6px',
                      borderRadius: '4px',
                      color: '#34d399'
                    }}>
                      {JSON.stringify(log.new_values)}
                    </code>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <div>{log.ip_address}</div>
                    <div style={{ fontSize: '0.68rem' }}>{log.user_agent}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {log.anomaly_flag ? (
                      <span className="badge badge-amber" title={log.anomaly_reason} style={{ fontSize: '0.65rem' }}>
                        <AlertTriangle size={12} /> Anomaly
                      </span>
                    ) : (
                      <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                        <ShieldCheck size={12} /> Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
