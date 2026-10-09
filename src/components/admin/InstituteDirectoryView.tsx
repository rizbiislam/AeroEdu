import React, { useMemo, useState } from 'react';
import { ArrowRight, Building2, Search, Users } from 'lucide-react';
import { useApp } from '../../context/useApp';
import styles from './InstituteDirectoryView.module.css';

const statusStyles = {
  active: styles.active,
  trial: styles.trial,
  suspended: styles.suspended
};

export const InstituteDirectoryView: React.FC = () => {
  const { availableInstitutes, currentInstitute, language, selectInstitute, setActiveTab, t } = useApp();
  const [query, setQuery] = useState('');
  const visibleInstitutes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language);
    return availableInstitutes.filter((institute) =>
      `${institute.name} ${institute.name_bn ?? ''} ${institute.eiin}`
        .toLocaleLowerCase(language)
        .includes(normalizedQuery)
    );
  }, [availableInstitutes, language, query]);

  const openInstitute = (instituteId: string) => {
    if (selectInstitute(instituteId)) setActiveTab('overview');
  };

  return (
    <section className={styles.page} aria-labelledby="institute-directory-title">
      <header className={styles.heading}>
        <span className={styles.headingIcon}><Building2 size={20} /></span>
        <div>
          <p>{t.nav_institutes}</p>
          <h1 id="institute-directory-title">{t.directory_title}</h1>
          <span>{t.directory_description}</span>
        </div>
      </header>

      <label className={styles.search}>
        <Search size={17} aria-hidden="true" />
        <input
          className="form-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.directory_search}
          aria-label={t.directory_search}
        />
        <span>{visibleInstitutes.length}</span>
      </label>

      {visibleInstitutes.length ? (
        <div className={styles.grid}>
          {visibleInstitutes.map((institute) => {
            const isCurrent = currentInstitute.id === institute.id;
            const instituteName = language === 'bn' && institute.name_bn
              ? institute.name_bn
              : institute.name;
            return (
              <article className={styles.card} key={institute.id}>
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon}>
                    {institute.logo_url
                      ? <img src={institute.logo_url} alt="" />
                      : <Building2 size={19} />}
                  </span>
                  <span className={`${styles.status} ${statusStyles[institute.status]}`}>
                    {t[institute.status]}
                  </span>
                </div>
                <h2>{instituteName}</h2>
                <p className={styles.eiin}>{t.portal_eiin} {institute.eiin} · {institute.exam_board_name}</p>
                <div className={styles.details}>
                  <span><Users size={15} /> {institute.student_count.toLocaleString()} {t.total_students}</span>
                  <span>{institute.current_plan}</span>
                </div>
                <button
                  className={styles.openButton}
                  type="button"
                  onClick={() => openInstitute(institute.id)}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  {isCurrent ? t.directory_current_institute : t.directory_open}
                  {!isCurrent && <ArrowRight size={16} />}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <p className={styles.emptyState}>{t.directory_empty}</p>
      )}
    </section>
  );
};
