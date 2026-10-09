import type { ClassSubjectAssignment, Section, Subject } from '../../types';

export class AssessmentScopeService {
  static subjectsForClass(subjects: readonly Subject[], assignments: readonly ClassSubjectAssignment[], classId: string): Subject[] {
    const assignedIds = new Set(assignments.filter((item) => item.class_id === classId).map((item) => item.subject_id));
    return subjects.filter((subject) => assignedIds.has(subject.id));
  }

  static isSubjectAssigned(assignments: readonly ClassSubjectAssignment[], classId: string, subjectId: string): boolean {
    return assignments.some((item) => item.class_id === classId && item.subject_id === subjectId);
  }

  static isSectionAssigned(sections: readonly Section[], classId: string, sectionId: string): boolean {
    return sections.some((item) => item.class_id === classId && item.id === sectionId);
  }
}
