import type { ApiAcademicClass, ApiAcademicSection, ApiAcademicSubject, ApiAcademicYear, ApiClassSubject } from './ApiClient';

export interface ApiAcademicCatalog {
  years: ApiAcademicYear[];
  classes: ApiAcademicClass[];
  sections: ApiAcademicSection[];
  subjects: ApiAcademicSubject[];
  classSubjects: ApiClassSubject[];
}
