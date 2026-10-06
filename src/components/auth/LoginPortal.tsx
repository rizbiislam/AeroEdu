import React, { useState } from 'react';
import { ArrowRight, Building2, GraduationCap, Languages, LockKeyhole, LogOut, Mail } from 'lucide-react';
import type { Institute, User } from '../../types';
import { useApp } from '../../context/AppContext';
import styles from './LoginPortal.module.css';

interface LoginPortalProps {
  institutes?: Institute[];
  user?: User;
  onSelectInstitute?: (instituteId: string) => boolean;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ institutes, user, onSelectInstitute }) => {
  const { language, setLanguage, signIn, logout, t } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isBangla = language === 'bn';
  const isChoosingInstitute = Boolean(user && institutes);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const result = signIn(email, password);
    if (result === 'invalid_credentials') setError(t.portal_login_invalid);
    else if (result === 'inactive_account') setError(t.portal_login_inactive);
    else if (result === 'no_institutes') setError(t.portal_login_no_institutes);
  };

  return (
    <main className={styles.shell}>
      <section className={styles.brandPanel} aria-labelledby="brand-heading">
        <header className={styles.brandPanelTop}>
          <div className={styles.brand}>
            <span className={styles.brandMark}><GraduationCap size={23} /></span>
            <span className={styles.brandText}>
              <strong>{t.appName}</strong>
              <small>{t.appTagline}</small>
            </span>
          </div>
          <button
            className={styles.languageButton}
            type="button"
            onClick={() => setLanguage(isBangla ? 'en' : 'bn')}
            aria-label={isBangla ? t.portal_switch_to_english : t.portal_switch_to_bengali}
          >
            <Languages size={16} />
            {isBangla ? 'English' : 'বাংলা'}
          </button>
        </header>

        <div className={styles.brandContent}>
          <span className={styles.eyebrow}>{t.portal_eyebrow}</span>
          <h1 id="brand-heading">
            {t.portal_hero_line_one}<br />
            <span>{t.portal_hero_line_two}</span>
          </h1>
          <p className={styles.brandDescription}>{t.portal_hero_description}</p>
          <div className={styles.campusSummary}>
            <span className={styles.summaryIcon}><LockKeyhole size={18} /></span>
            <span>
              <strong>{t.portal_access_summary}</strong>
              <small>{t.portal_access_summary_detail}</small>
            </span>
          </div>
        </div>

        <footer className={styles.brandPanelFooter}>
          <span>{t.portal_secure_by_design}</span>
          <span>{t.portal_people_first}</span>
        </footer>
      </section>

      <section className={styles.workspacePanel} aria-labelledby="workspace-heading">
        <header className={styles.workspaceHeader}>
          <div className={styles.instituteMark}><GraduationCap size={18} /></div>
          <div className={styles.instituteDetails}>
            <strong>{t.appName}</strong>
            <span>{t.portal_header_subtitle}</span>
          </div>
          {user && (
            <span className={styles.userSummary}>
              <span>{t.portal_signed_in_as}</span>
              <strong>{user.full_name}</strong>
              <button className={styles.signOutButton} type="button" onClick={logout}>
                <LogOut size={13} />
                {t.portal_sign_out}
              </button>
            </span>
          )}
        </header>

        <div className={styles.workspaceContent}>
          {isChoosingInstitute ? (
            <>
              <div className={styles.workspaceIntro}>
                <span className={styles.sectionEyebrow}>{t.portal_your_institutes}</span>
                <h2 id="workspace-heading">{t.portal_choose_institute}</h2>
                <p>{t.portal_choose_institute_description}</p>
              </div>
              <div className={styles.instituteList}>
                {(institutes ?? []).map((institute) => (
                  <button
                    className={styles.instituteCard}
                    key={institute.id}
                    type="button"
                    onClick={() => onSelectInstitute?.(institute.id)}
                  >
                    <span className={styles.workspaceIcon}>
                      {institute.logo_url
                        ? <img src={institute.logo_url} alt="" />
                        : <Building2 size={19} />}
                    </span>
                    <span className={styles.instituteCardText}>
                      <strong>{isBangla && institute.name_bn ? institute.name_bn : institute.name}</strong>
                      <small>{t.portal_eiin} {institute.eiin} · {institute.exam_board_name}</small>
                    </span>
                    <ArrowRight className={styles.workspaceArrow} size={17} />
                  </button>
                ))}
              </div>
              <div className={styles.workspaceFootnote}>{t.portal_demo_access_note}</div>
            </>
          ) : (
            <>
              <div className={styles.workspaceIntro}>
                <span className={styles.sectionEyebrow}>{t.portal_welcome}</span>
                <h2 id="workspace-heading">{t.portal_sign_in_title}</h2>
                <p>{t.portal_sign_in_description}</p>
              </div>
              <form className={styles.loginForm} onSubmit={handleSubmit}>
                <label className={styles.formLabel} htmlFor="portal-email">{t.portal_email_label}</label>
                <div className={styles.formInput}>
                  <Mail size={17} aria-hidden="true" />
                  <input
                    id="portal-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t.portal_email_placeholder}
                    required
                  />
                </div>

                <label className={styles.formLabel} htmlFor="portal-password">{t.portal_password_label}</label>
                <div className={styles.formInput}>
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="portal-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={t.portal_password_placeholder}
                    required
                  />
                </div>
                {error && <p className={styles.formError} role="alert">{error}</p>}
                <button className={styles.submitButton} type="submit">
                  {t.portal_sign_in_button}
                  <ArrowRight size={17} />
                </button>
              </form>
              <div className={styles.demoNotice}>
                <strong>{t.portal_demo_label}</strong>
                <span>{t.portal_demo_credentials}</span>
                <small>{t.portal_demo_disclaimer}</small>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};
