import React from 'react';
import type { FeeWaiverRequest } from '../../types';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

interface FeeWaiversTabProps {
  waivers: FeeWaiverRequest[];
  onApprove: (waiverId: string) => void;
  onReject: (waiverId: string, reason: string) => void;
}

export const FeeWaiversTab: React.FC<FeeWaiversTabProps> = ({
  waivers,
  onApprove,
  onReject
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            Fee Waivers, Concessions & Merit Scholarships
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Statutory Governing Body Concessions (Merit Quota, Poverty Fund, Sibling Discount)
          </div>
        </div>
        <span className="badge badge-green">
          {waivers.filter(w => w.status === 'pending').length} Sanctions Pending
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {waivers.map(w => (
          <div key={w.id} className="applicant-card">
            <div className="applicant-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="applicant-name">{w.student_name}</span>
                <span className="badge badge-blue">Roll #{w.roll_number} • {w.class_name}</span>
                <span className="badge badge-purple">{w.discount_percentage}% Concession ({w.waiver_type})</span>
              </div>
              <span className={`badge ${w.status === 'approved' ? 'badge-green' : w.status === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                {w.status.toUpperCase()}
              </span>
            </div>

            <div className="applicant-meta-grid">
              <div>Fee Head: <strong>{w.fee_head}</strong></div>
              <div>Discounted Amount: <strong style={{ color: '#10b981' }}>৳{w.discount_amount.toLocaleString()}</strong></div>
              <div>Basis of Claim: <strong>{w.basis_description}</strong></div>
              <div>Requested By: <strong>{w.requested_by_name}</strong></div>
              <div>Application Date: <strong>{w.created_at}</strong></div>
            </div>

            {w.status === 'pending' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => onReject(w.id, 'Does not meet income threshold criteria')}
                  style={{ fontSize: '0.8rem', padding: '6px 14px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <XCircle size={14} /> Decline Concession
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => onApprove(w.id)}
                  style={{ fontSize: '0.8rem', padding: '6px 16px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                >
                  <CheckCircle2 size={14} /> Sanction Fee Concession
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
