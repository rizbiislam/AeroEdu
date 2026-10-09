import React, { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Building2, Clock3, Headphones, LifeBuoy, Search, ShieldAlert, Star } from 'lucide-react';
import { useApp } from '../../context/useApp';
import styles from './PlatformSupportView.module.css';

const statuses = ['all', 'open', 'in_progress', 'waiting', 'resolved'] as const;

export const PlatformSupportView: React.FC = () => {
  const { supportTickets, showToast } = useApp();
  const [status, setStatus] = useState<(typeof statuses)[number]>('all');
  const [query, setQuery] = useState('');
  const tickets = useMemo(() => supportTickets.filter((ticket) => (status === 'all' || ticket.status === status) && `${ticket.ticket_number} ${ticket.subject} ${ticket.institute_name} ${ticket.user_name}`.toLowerCase().includes(query.toLowerCase())), [supportTickets, status, query]);
  const active = supportTickets.filter((ticket) => !['resolved', 'closed'].includes(ticket.status));
  const breached = active.filter((ticket) => ticket.sla_breached).length;
  const ratings = supportTickets.map((ticket) => ticket.csat_rating).filter((rating): rating is number => Boolean(rating));
  const satisfaction = ratings.length ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : '4.8';

  return <section className={styles.page} aria-labelledby="support-dashboard-title">
    <header className={styles.header}><div><span className={styles.eyebrow}>PLATFORM OPERATIONS / SUPPORT</span><h1 id="support-dashboard-title">Support command center</h1><p>Monitor institute requests, response targets, and customer satisfaction.</p></div><button className={styles.exportButton} type="button" onClick={() => showToast('Support report prepared for export.', 'success')}><ArrowDownToLine size={15} />Export report</button></header>
    <div className={styles.metrics}>
      <Metric icon={<LifeBuoy size={18} />} label="Open tickets" value={active.length.toString()} note="Across all institutes" tone="blue" />
      <Metric icon={<Clock3 size={18} />} label="SLA at risk" value={breached.toString()} note="Needs immediate attention" tone="amber" />
      <Metric icon={<ShieldAlert size={18} />} label="SLA compliance" value="96.4%" note="+1.8% this month" tone="green" />
      <Metric icon={<Star size={18} />} label="CSAT score" value={`${satisfaction} / 5`} note={`${ratings.length || 28} recent responses`} tone="purple" />
    </div>
    <div className={styles.insightGrid}>
      <div className={styles.panel}><div className={styles.panelHead}><div><h2>Response health</h2><p>First response within target, rolling 30 days</p></div><span className={styles.live}><i />Live</span></div><div className={styles.healthBody}><div className={styles.donut}><div><strong>96%</strong><small>within SLA</small></div></div><div className={styles.healthLegend}><span><i className={styles.legendGreen} />Within target <b>96.4%</b></span><span><i className={styles.legendAmber} />At risk <b>2.1%</b></span><span><i className={styles.legendRed} />Breached <b>1.5%</b></span></div></div><div className={styles.chartFooter}><span><ArrowUpRight size={14} /> 1.8% from last month</span><span>Last 30 days</span></div></div>
      <div className={styles.panel}><div className={styles.panelHead}><div><h2>Queue by category</h2><p>What institutes need help with</p></div><Headphones size={18} /></div>{[['Technical', 36, '#3977d8'], ['Billing', 24, '#8057cb'], ['Academic', 19, '#1e9c76'], ['Account access', 13, '#dc9a26']].map(([label, percent, color]) => <div className={styles.category} key={label as string}><div><span>{label}</span><strong>{percent}%</strong></div><div className={styles.bar}><span style={{ width: `${percent}%`, background: color as string }} /></div></div>)}<div className={styles.categoryFoot}><Building2 size={14} /> Requests from 18 active institutes</div></div>
    </div>
    <div className={styles.panel}>
      <div className={styles.queueHead}><div><h2>Ticket queue</h2><p>Prioritize institute requests and SLA deadlines</p></div><div className={styles.queueActions}><label className={styles.search}><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets or institutes" /></label><button className={styles.exportButton} type="button" onClick={() => showToast('Filtered ticket queue exported.', 'success')}><ArrowDownToLine size={14} />Export</button></div></div>
      <div className={styles.tabs} role="tablist" aria-label="Filter tickets">{statuses.map((item) => <button className={status === item ? styles.tabActive : ''} type="button" role="tab" aria-selected={status === item} key={item} onClick={() => setStatus(item)}>{item === 'all' ? 'All tickets' : item.replace('_', ' ')}{item === 'all' && <span>{supportTickets.length}</span>}</button>)}</div>
      <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Ticket</th><th>Institute</th><th>Requester</th><th>Priority</th><th>Status</th><th>SLA due</th><th>CSAT</th></tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id}><td><strong>{ticket.subject}</strong><small>{ticket.ticket_number} · {ticket.category}</small></td><td>{ticket.institute_name}</td><td>{ticket.user_name}</td><td><span className={`${styles.priority} ${styles[`priority_${ticket.priority}`]}`}>{ticket.priority}</span></td><td><span className={`${styles.status} ${styles[`status_${ticket.status}`]}`}>{ticket.status.replace('_', ' ')}</span></td><td className={ticket.sla_breached ? styles.breached : ''}>{ticket.sla_breached ? 'Breached' : `${ticket.sla_target_response_hours}h response`}</td><td>{ticket.csat_rating ? <span className={styles.rating}><Star size={13} fill="currentColor" />{ticket.csat_rating}</span> : <span className={styles.muted}>—</span>}</td></tr>)}{tickets.length === 0 && <tr><td colSpan={7} className={styles.empty}>No tickets match these filters.</td></tr>}</tbody></table></div>
      <footer className={styles.tableFooter}><span>Showing {tickets.length} of {supportTickets.length} tickets</span><button type="button" onClick={() => { setStatus('all'); setQuery(''); }}>Clear filters</button></footer>
    </div>
  </section>;
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string; note: string; tone: 'blue' | 'amber' | 'green' | 'purple' }> = ({ icon, label, value, note, tone }) => <article className={styles.metric}><span className={`${styles.metricIcon} ${styles[tone]}`}>{icon}</span><span className={styles.metricLabel}>{label}</span><strong>{value}</strong><small>{note}</small></article>;
