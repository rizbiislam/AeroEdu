import type { StudentAcademicResult, SubjectScore } from '../types';
import { GradeCalculatorService } from '../services/GradeCalculatorService';

export class AcademicResultEntity {
  public readonly studentId: string;
  public readonly studentName: string;
  public readonly rollNumber: number;
  public readonly className: string;
  public readonly sectionName: string;
  public scores: SubjectScore[];
  public totalMarksObtained: number;
  public readonly totalMaxMarks: number;
  public gpaWithoutOptional: number;
  public gpaWithOptional: number;
  public finalGrade: string;
  public isPassed: boolean;
  public meritPosition: number;
  public attendancePercentage: number;
  public conductRating: string;
  public teacherRemarks: string;

  constructor(data: StudentAcademicResult) {
    this.studentId = data.student_id;
    this.studentName = data.student_name;
    this.rollNumber = data.roll_number;
    this.className = data.class_name;
    this.sectionName = data.section_name;
    this.scores = [...data.scores];
    this.totalMarksObtained = data.total_marks_obtained;
    this.totalMaxMarks = data.total_max_marks;
    this.gpaWithoutOptional = data.gpa_without_optional;
    this.gpaWithOptional = data.gpa_with_optional;
    this.finalGrade = data.final_grade;
    this.isPassed = data.is_passed;
    this.meritPosition = data.merit_position;
    this.attendancePercentage = data.attendance_percentage;
    this.conductRating = data.conduct_rating;
    this.teacherRemarks = data.teacher_remarks;
  }

  public static fromJSON(json: StudentAcademicResult): AcademicResultEntity {
    return new AcademicResultEntity(json);
  }

  /**
   * Updates component score and recalculates whole result using Board algorithms.
   */
  public updateScore(
    subjectCode: string,
    field: 'cq' | 'mcq' | 'pr',
    value: number
  ): void {
    this.scores = this.scores.map(sc => {
      if (sc.subject_code !== subjectCode) return sc;
      const cq = field === 'cq' ? value : sc.cq_marks;
      const mcq = field === 'mcq' ? value : sc.mcq_marks;
      const pr = field === 'pr' ? value : (sc.pr_marks || 0);

      const calculated = GradeCalculatorService.calculateSubjectGrade(cq, mcq, pr, {
        cq_pass: sc.cq_pass,
        mcq_pass: sc.mcq_pass,
        pr_pass: sc.pr_pass
      });

      return {
        ...sc,
        cq_marks: cq,
        mcq_marks: mcq,
        pr_marks: pr,
        total_marks: calculated.total,
        letter_grade: calculated.letterGrade,
        grade_point: calculated.gradePoint,
        is_passed: calculated.isPassed
      };
    });

    const overall = GradeCalculatorService.calculateOverallResult(this.scores);
    this.totalMarksObtained = overall.totalMarks;
    this.gpaWithOptional = overall.gpaWithOptional;
    this.finalGrade = overall.finalGrade;
    this.isPassed = overall.isPassed;
  }

  public isGoldenAPlus(): boolean {
    if (this.gpaWithOptional !== 5.00) return false;
    const compulsory = this.scores.filter(s => !s.is_optional);
    return compulsory.every(s => s.grade_point === 5.00);
  }

  public getFailedSubjects(): SubjectScore[] {
    return this.scores.filter(s => !s.is_passed);
  }

  public getCompulsoryScores(): SubjectScore[] {
    return this.scores.filter(s => !s.is_optional);
  }

  public getOptionalScore(): SubjectScore | undefined {
    return this.scores.find(s => s.is_optional);
  }

  public toJSON(): StudentAcademicResult {
    return {
      student_id: this.studentId,
      student_name: this.studentName,
      roll_number: this.rollNumber,
      class_name: this.className,
      section_name: this.sectionName,
      scores: this.scores,
      total_marks_obtained: this.totalMarksObtained,
      total_max_marks: this.totalMaxMarks,
      gpa_without_optional: this.gpaWithoutOptional,
      gpa_with_optional: this.gpaWithOptional,
      final_grade: this.finalGrade,
      is_passed: this.isPassed,
      merit_position: this.meritPosition,
      attendance_percentage: this.attendancePercentage,
      conduct_rating: this.conductRating,
      teacher_remarks: this.teacherRemarks
    };
  }
}
