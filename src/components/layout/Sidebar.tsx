import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Sidebar.module.css';

const badgeStyles = {
  blue: styles.badge_blue,
  green: styles.badge_green,
  amber: styles.badge_amber,
  red: styles.badge_red,
  purple: styles.badge_purple
};

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate }) => {
  const { activeTab, setActiveTab, availableWorkspaces, t } = useApp();

  return (
    <aside className={`sidebar ${styles.sidebar} ${isOpen ? 'open' : ''}`}>
      <a className={styles.brand} href="#/" aria-label={t.appName}>
        <span className={styles.brandMark}><GraduationCap size={20} /></span>
        <span className={styles.brandText}>
          <strong>{t.appName}</strong>
          <small>{t.appTagline}</small>
        </span>
      </a>

      <nav className={styles.navigation} aria-label={t.portal_your_workspace}>
        <span className={styles.navigationLabel}>{t.portal_your_workspace}</span>
        {availableWorkspaces.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`${styles.navigationItem} ${isActive ? styles.active : ''}`}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                setActiveTab(item.id);
                onNavigate();
              }}
            >
              <Icon className={styles.navigationIcon} size={18} aria-hidden="true" />
              <span className={styles.navigationText}>{item.label}</span>
              {item.badge !== undefined && (
                <span className={`${styles.badge} ${badgeStyles[item.badgeColor || 'blue']}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
