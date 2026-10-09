export type AssessmentKind = 'quiz' | 'assignment' | 'exam' | 'board_exam';
export type EvaluationMode = 'points' | 'components' | 'rubric';
export type AssessmentStatus = 'draft' | 'scheduled' | 'marking' | 'completed';
export interface EvaluationCriterion { name: string; weight: number }

export interface AssessmentDefinition {
  id: string;
  instituteId: string;
  academicYear: string;
  title: string;
  kind: AssessmentKind;
  classId: string;
  sectionId: string;
  subjectId: string;
  evaluationMode: EvaluationMode;
  evaluationCriteria: EvaluationCriterion[];
  maxScore: number;
  passScore: number;
  dueAt: string;
  evaluatorId: string;
  status: AssessmentStatus;
  evaluatedCount: number;
  cohortCount: number;
}

export interface AssessmentDraft {
  title: string;
  kind: AssessmentKind;
  classId: string;
  sectionId: string;
  subjectId: string;
  evaluationMode: EvaluationMode;
  evaluationCriteria: EvaluationCriterion[];
  maxScore: number;
  passScore: number;
  dueAt: string;
  evaluatorId: string;
}
