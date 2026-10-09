import type { AssessmentDefinition, AssessmentDraft } from './assessment.types';
import { AssessmentScopeService } from './AssessmentScopeService';
import type { ClassSubjectAssignment, Section } from '../../types';

export interface AssessmentFilters {
  query: string;
  kind: string;
  classId: string;
  subjectId: string;
}

export class AssessmentCatalog {
  static filter(items: readonly AssessmentDefinition[], filters: AssessmentFilters): AssessmentDefinition[] {
    const query = filters.query.trim().toLocaleLowerCase();
    return items.filter((item) => {
      const matchesQuery = !query || item.title.toLocaleLowerCase().includes(query);
      return matchesQuery
        && (filters.kind === 'all' || item.kind === filters.kind)
        && (filters.classId === 'all' || item.classId === filters.classId)
        && (filters.subjectId === 'all' || item.subjectId === filters.subjectId);
    });
  }

  static create(instituteId: string, academicYear: string, draft: AssessmentDraft, classSubjects: readonly ClassSubjectAssignment[], sections: readonly Section[]): AssessmentDefinition {
    if (!draft.title.trim()) throw new Error('Add an assessment title.');
    if (!draft.classId || !draft.sectionId || !draft.subjectId) throw new Error('Choose a class, section, and subject.');
    if (!AssessmentScopeService.isSectionAssigned(sections, draft.classId, draft.sectionId)) {
      throw new Error('Choose a section that belongs to this class.');
    }
    if (!AssessmentScopeService.isSubjectAssigned(classSubjects, draft.classId, draft.subjectId)) {
      throw new Error('Choose a subject assigned to this class.');
    }
    if (!Number.isFinite(draft.maxScore) || draft.maxScore <= 0) throw new Error('Maximum score must be greater than zero.');
    if (!Number.isFinite(draft.passScore) || draft.passScore < 0 || draft.passScore > draft.maxScore) {
      throw new Error('Pass score must be between zero and the maximum score.');
    }
    if (!draft.dueAt) throw new Error('Choose a due date.');
    if (draft.evaluationMode !== 'points') {
      const hasInvalidCriterion = draft.evaluationCriteria.some((item) => !item.name.trim() || !Number.isFinite(item.weight) || item.weight < 0);
      const totalWeight = draft.evaluationCriteria.reduce((sum, item) => sum + item.weight, 0);
      if (hasInvalidCriterion || Math.abs(totalWeight - 100) > 0.001) {
        throw new Error('Add named evaluation components with weights totaling 100%.');
      }
    }

    return {
      ...draft,
      id: `assessment-${Date.now()}`,
      instituteId,
      academicYear,
      title: draft.title.trim(),
      status: 'draft',
      evaluatedCount: 0,
      cohortCount: 0
    };
  }
}
