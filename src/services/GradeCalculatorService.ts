import type { SubjectScore } from '../types';

export interface ComponentPassRule {
  cq_pass: number;
  mcq_pass: number;
  pr_pass?: number;
}

export class GradeCalculatorService {
  /**
   * Calculate letter grade and grade point for a single subject based on BISE Bangladesh rules.
   * Compulsory rule: Candidate MUST pass CQ, MCQ, and PR individually.
   */
  public static calculateSubjectGrade(
    cq: number,
    mcq: number,
    pr: number = 0,
    rules: ComponentPassRule = { cq_pass: 17, mcq_pass: 8, pr_pass: 8 }
  ): { total: number; letterGrade: string; gradePoint: number; isPassed: boolean } {
    const total = cq + mcq + pr;
    const cqPassed = cq >= rules.cq_pass;
    const mcqPassed = mcq >= rules.mcq_pass;
    const prPassed = rules.pr_pass ? pr >= rules.pr_pass : true;

    const isPassed = cqPassed && mcqPassed && prPassed;

    if (!isPassed) {
      return { total, letterGrade: 'F', gradePoint: 0.00, isPassed: false };
    }

    if (total >= 80) return { total, letterGrade: 'A+', gradePoint: 5.00, isPassed: true };
    if (total >= 70) return { total, letterGrade: 'A', gradePoint: 4.00, isPassed: true };
    if (total >= 60) return { total, letterGrade: 'A-', gradePoint: 3.50, isPassed: true };
    if (total >= 50) return { total, letterGrade: 'B', gradePoint: 3.00, isPassed: true };
    if (total >= 40) return { total, letterGrade: 'C', gradePoint: 2.00, isPassed: true };
    if (total >= 33) return { total, letterGrade: 'D', gradePoint: 1.00, isPassed: true };

    return { total, letterGrade: 'F', gradePoint: 0.00, isPassed: false };
  }

  /**
   * Recalculates full student result including 4th subject formula:
   * GPA = [Sum of Compulsory GPs + Max(0, 4th Subject GP - 2.00)] / Compulsory Subjects Count
   */
  public static calculateOverallResult(scores: SubjectScore[]): {
    totalMarks: number;
    gpaWithOptional: number;
    finalGrade: string;
    isPassed: boolean;
  } {
    const compulsoryScores = scores.filter(s => !s.is_optional);
    const optionalScore = scores.find(s => s.is_optional);
    const totalMarks = scores.reduce((sum, s) => sum + s.total_marks, 0);

    const allCompulsoryPassed = compulsoryScores.every(s => s.is_passed);

    if (!allCompulsoryPassed) {
      return {
        totalMarks,
        gpaWithOptional: 0.00,
        finalGrade: 'F (Failed)',
        isPassed: false
      };
    }

    const sumCompulsoryGp = compulsoryScores.reduce((sum, s) => sum + s.grade_point, 0);
    const optionalBonus = optionalScore && optionalScore.is_passed
      ? Math.max(0, optionalScore.grade_point - 2.00)
      : 0;

    const rawGpa = (sumCompulsoryGp + optionalBonus) / (compulsoryScores.length || 1);
    const gpaWithOptional = Math.min(5.00, Number(rawGpa.toFixed(2)));

    let finalGrade = 'D';
    if (gpaWithOptional === 5.00) {
      // Golden A+ check: all compulsory subjects must have GP 5.00
      const isGolden = compulsoryScores.every(s => s.grade_point === 5.00);
      finalGrade = isGolden ? 'A+ (Golden)' : 'A+';
    } else if (gpaWithOptional >= 4.00) {
      finalGrade = 'A';
    } else if (gpaWithOptional >= 3.50) {
      finalGrade = 'A-';
    } else if (gpaWithOptional >= 3.00) {
      finalGrade = 'B';
    } else if (gpaWithOptional >= 2.00) {
      finalGrade = 'C';
    } else if (gpaWithOptional >= 1.00) {
      finalGrade = 'D';
    } else {
      finalGrade = 'F';
    }

    return {
      totalMarks,
      gpaWithOptional,
      finalGrade,
      isPassed: true
    };
  }
}
