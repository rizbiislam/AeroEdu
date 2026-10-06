import React from 'react';
import { Building2, Languages, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Navbar.module.css';

interface NavbarProps {
  isMenuOpen: boolean;
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, onMenuClick }) => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    currentUser,
    currentInstitute,
    t,
    toasts,
    dismissToast,
    logout
  } = useApp();
  const instituteName = language === 'bn' && currentInstitute.name_bn
    ? currentInstitute.name_bn
    : currentInstitute.name;

  return (
    <>
      <header className="top-navbar">
        <button
          className={`${styles.iconButton} ${styles.mobileMenu}`}
          type="button"
          onClick={onMenuClick}
          aria-label={isMenuOpen ? t.portal_close_menu : t.portal_open_menu}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <div className={styles.institute}>
          <span className={styles.instituteIcon}><Building2 size={18} /></span>
          <span className={styles.instituteInfo}>
            <strong>{instituteName}</strong>
            <small>
              EIIN {currentInstitute.eiin}
              <span aria-hidden="true"> · </span>
              {currentInstitute.academic_year}
            </small>
          </span>
          <span className={styles.previewTag}>{t.portal_demo_label}</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.iconButton}
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            aria-label={language === 'en' ? t.portal_switch_to_bengali : t.portal_switch_to_english}
            title={language === 'en' ? t.portal_switch_to_bengali : t.portal_switch_to_english}
          >
            <Languages size={17} />
            <span>{language === 'en' ? 'বাং' : 'EN'}</span>
          </button>
          <button
            className={styles.iconButton}
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.portal_switch_to_light : t.portal_switch_to_dark}
            title={theme === 'dark' ? t.portal_switch_to_light : t.portal_switch_to_dark}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className={styles.profile}>
            <span className={styles.avatar} aria-hidden="true">
              {currentUser.full_name.charAt(0)}
            </span>
            <span className={styles.profileText}>
              <strong>{currentUser.full_name.split('(')[0].trim()}</strong>
              <small>{currentUser.email}</small>
            </span>
            <button
              className={`${styles.iconButton} ${styles.signOut}`}
              type="button"
              onClick={logout}
              aria-label={t.portal_sign_out}
              title={t.portal_sign_out}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className={styles.toastStack} aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div
            className={`${styles.toast} ${toastStyles[toast.type]}`}
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
          >
            <span>{toast.message}</span>
            <button
              className={styles.dismissToast}
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label={t.portal_dismiss_notification}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

const toastStyles = {
  success: styles.toast_success,
  error: styles.toast_error,
  info: styles.toast_info
};
