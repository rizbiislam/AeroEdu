import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import {
  LifeBuoy,
  Send,
  Star,
  Plus
} from 'lucide-react';

export const SupportTicketsView: React.FC = () => {
  const { supportTickets, createSupportTicket, submitCSAT, showToast } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(supportTickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'billing' | 'academic' | 'technical' | 'admit_card' | 'account'>('billing');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newDescription, setNewDescription] = useState('');

  const activeTicket = supportTickets.find(t => t.id === selectedTicketId) || supportTickets[0];

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    showToast('Reply dispatched to ticket thread!', 'success');
    setReplyText('');
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createSupportTicket({
      subject: newTitle,
      category: newCategory,
      priority: newPriority,
      messages: [{
        id: `msg-${Date.now()}`,
        sender_name: 'You',
        sender_role: 'user',
        message: newDescription,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
    });
    setShowNewModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LifeBuoy size={24} style={{ color: '#c084fc' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Help Desk & Support Tickets
            </h1>
            <span className="badge badge-purple">SLA Guaranteed</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Multi-Tenant Platform Support with Automated Severity Routing & CSAT Feedback
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowNewModal(true)}
        >
          <Plus size={16} /> Open New Ticket
        </button>
      </div>

      {/* Grid: Ticket List + Conversation Thread */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Ticket List */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '14px' }}>
            Your Active Tickets ({supportTickets.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {supportTickets.map((t) => {
              const isSelected = activeTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className={`badge badge-${t.priority === 'urgent' ? 'red' : t.priority === 'high' ? 'amber' : 'blue'}`} style={{ fontSize: '0.65rem' }}>
                      {t.priority}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      #{t.id}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, color: isSelected ? '#c084fc' : '#f1f5f9', fontSize: '0.875rem', marginBottom: '4px' }}>
                    {t.subject}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span>Category: {t.category}</span>
                    <span style={{ color: t.status === 'open' ? '#34d399' : 'var(--text-muted)' }}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Details & Messages */}
        {activeTicket ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                    {activeTicket.subject}
                  </h2>
                  <span className={`badge badge-${activeTicket.status === 'open' ? 'green' : 'amber'}`}>
                    {activeTicket.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Created by <strong>{activeTicket.user_name}</strong> • Category: <strong>{activeTicket.category}</strong> • SLA Target: <strong>2 Hours</strong>
                </div>
              </div>

              {/* CSAT Stars */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '4px' }}>CSAT Satisfaction</div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      onClick={() => submitCSAT(activeTicket.id, star)}
                      style={{
                        cursor: 'pointer',
                        color: (activeTicket.csat_rating || 0) >= star ? '#fbbf24' : 'var(--text-dim)',
                        fill: (activeTicket.csat_rating || 0) >= star ? '#fbbf24' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '220px' }}>
              {activeTicket.messages?.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: msg.sender_name === 'Support Staff' || msg.sender_name === 'Platform Support' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                    <strong style={{ color: msg.sender_name === 'Support Staff' ? '#60a5fa' : '#34d399' }}>
                      {msg.sender_name}
                    </strong>
                    <span style={{ color: 'var(--text-dim)' }}>{msg.created_at}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Composer */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to platform support..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-surface)',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendReply();
                }}
              />
              <button 
                className="btn btn-primary"
                onClick={handleSendReply}
              >
                <Send size={16} /> Send Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-dim)' }}>No active ticket selected.</p>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Open Support Ticket</h2>
            <form onSubmit={handleCreateNew} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. bKash webhook IP whitelist issue"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: '#f1f5f9'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as 'billing' | 'academic' | 'technical' | 'admit_card' | 'account')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-medium)',
                      background: 'var(--bg-surface)',
                      color: '#f1f5f9'
                    }}
                  >
                    <option value="billing">Billing & Finance</option>
                    <option value="academic">Academic & Exams</option>
                    <option value="system">System & Network</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-medium)',
                      background: 'var(--bg-surface)',
                      color: '#f1f5f9'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your issue with error codes or student roll..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: '#f1f5f9',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
