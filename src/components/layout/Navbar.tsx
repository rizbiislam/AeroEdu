import React from 'react';
import { Bell, Building2, CheckCheck, Languages, LogOut, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useMemo, useState } from 'react';
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
    logout,
    availableWorkspaces,
    announcements,
    feeWaivers,
    setActiveTab
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const matchingWorkspaces = useMemo(() => availableWorkspaces.filter((item) => item.label.toLocaleLowerCase(language).includes(searchQuery.trim().toLocaleLowerCase(language))).slice(0, 5), [availableWorkspaces, language, searchQuery]);
  const pendingItems = feeWaivers.filter((item) => item.status === 'pending').length;
  const unreadCount = Math.min(announcements.length + pendingItems, 9);
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
          <div className={styles.searchShell}>
            {searchOpen && <input autoFocus className={styles.searchInput} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } if (event.key === 'Enter' && matchingWorkspaces[0]) { setActiveTab(matchingWorkspaces[0].id); setSearchOpen(false); setSearchQuery(''); } }} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />}
            <button className={styles.iconButton} type="button" aria-label={t.searchPlaceholder} aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); setNotificationsOpen(false); }}><Search size={17} /></button>
            {searchOpen && searchQuery && <div className={styles.searchResults} role="listbox">{matchingWorkspaces.length ? matchingWorkspaces.map((item) => { const Icon = item.icon; return <button type="button" role="option" aria-selected="false" key={item.id} onClick={() => { setActiveTab(item.id); setSearchOpen(false); setSearchQuery(''); }}><Icon size={15} /><span>{item.label}</span></button>; }) : <span className={styles.noSearchResults}>{language === 'bn' ? 'কোনো কর্মক্ষেত্র মেলেনি' : 'No workspace found'}</span>}</div>}
          </div>
          <div className={styles.notificationShell}>
            <button className={styles.iconButton} type="button" aria-label={t.notifications} aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((open) => !open); setSearchOpen(false); }}><Bell size={17} />{unreadCount > 0 && <span className={styles.notificationDot}>{unreadCount}</span>}</button>
            {notificationsOpen && <div className={styles.notificationPanel}><div className={styles.notificationHeading}><div><strong>{t.notifications}</strong><small>{language === 'bn' ? `${unreadCount}টি নতুন আপডেট` : `${unreadCount} recent updates`}</small></div><CheckCheck size={16} /></div>{announcements.slice(0, 3).map((item, index) => <button className={styles.notificationItem} key={item.id} type="button" onClick={() => { setActiveTab('communications'); setNotificationsOpen(false); }}><span className={`${styles.notificationIcon} ${index === 0 ? styles.notificationBlue : ''}`}><Bell size={14} /></span><span><strong>{item.title}</strong><small>{item.created_at} · {item.author_name}</small></span>{index === 0 && <i />}</button>)}{pendingItems > 0 && <button className={styles.notificationItem} type="button" onClick={() => { setActiveTab('billing'); setNotificationsOpen(false); }}><span className={styles.notificationIcon}><span className={styles.waiverIcon}>৳</span></span><span><strong>{language === 'bn' ? `${pendingItems}টি মওকুফ অপেক্ষমাণ` : `${pendingItems} waiver requests pending`}</strong><small>{language === 'bn' ? 'পর্যালোচনার জন্য প্রস্তুত' : 'Ready for review'}</small></span><i /></button>}<button className={styles.viewNotifications} type="button" onClick={() => { setActiveTab('communications'); setNotificationsOpen(false); }}>{language === 'bn' ? 'সব আপডেট দেখুন' : 'View all updates'}</button></div>}
          </div>
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

      {(searchOpen || notificationsOpen) && <button type="button" className={styles.popoverDismiss} aria-label={language === 'bn' ? 'পপওভার বন্ধ করুন' : 'Close popover'} onClick={() => { setSearchOpen(false); setNotificationsOpen(false); }} />}

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
