import React, { useState } from 'react';
import { Send, Bell, Sparkles } from 'lucide-react';

interface NoticesBroadcastTabProps {
  onBroadcast: (title: string, audience: 'all' | 'teachers' | 'guardians', content: string) => void;
}

export const NoticesBroadcastTab: React.FC<NoticesBroadcastTabProps> = ({ onBroadcast }) => {
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'all' | 'teachers' | 'guardians'>('all');
  const [noticeContent, setNoticeContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    onBroadcast(noticeTitle, noticeAudience, noticeContent);
    setNoticeTitle('');
    setNoticeContent('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 450px) 1fr', gap: '22px', alignItems: 'start' }}>
      {/* Broadcast Form */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Bell size={18} style={{ color: '#38bdf8' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
            Dispatch Campus Circular / Notice
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Notice Title:
            </label>
            <input
              type="text"
              placeholder="e.g., Mandatory Preparation for SSC Pre-Test 2027"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              className="mark-input"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Audience Scope:
            </label>
            <select
              value={noticeAudience}
              onChange={(e) => setNoticeAudience(e.target.value as any)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <option value="all">All Campus (Students, Guardians & Faculty)</option>
              <option value="teachers">Academic Faculty & Staff Only</option>
              <option value="guardians">Parents & Legal Guardians Only</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Notice Content & Directives:
            </label>
            <textarea
              rows={5}
              placeholder="Enter official directives, schedules, or emergency circular text..."
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Send size={15} /> Broadcast via Push & SMS Gateway
          </button>
        </form>
      </div>

      {/* Broadcast Channels Overview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
            Integrated Broadcast Gateway Channels
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <div style={{ padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8' }}>Teletalk / GP SMS Gateway</div>
              <div>Instant alphanumeric SMS alert dispatched with Institute Sender ID "AEROEDU".</div>
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#10b981' }}>In-App Push & Portal Banner</div>
              <div>Appears on Student & Guardian Home dashboards upon immediate login.</div>
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#a855f7' }}>Official Noticeboard Archive</div>
              <div>Digitally signed and archived in the immutable institutional compliance ledger.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
