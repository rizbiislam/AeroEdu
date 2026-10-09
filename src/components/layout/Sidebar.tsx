import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useApp } from '../../context/useApp';
import styles from './Sidebar.module.css';

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
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
