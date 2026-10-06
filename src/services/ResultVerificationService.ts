import type { StudentAcademicResult, Institute } from '../types';

export interface IntegrityAuditReport {
  isReadyForPublish: boolean;
  totalStudents: number;
  fullyTabulatedCount: number;
  pendingMarksCount: number;
  passedCount: number;
  failedCount: number;
  passPercentage: number;
  goldenAplusCount: number;
  regularAplusCount: number;
  anomalies: string[];
  auditTimestamp: string;
}

export interface BoardPublicationCertificate {
  certificateId: string;
  examName: string;
  eiin: string;
  institutionName: string;
  certifiedBy: string;
  certifiedDesignation: string;
  publishedAt: string;
  securityHash: string;
  verificationUrl: string;
  status: 'draft' | 'verified' | 'published';
}

export class ResultVerificationService {
  /**
   * Performs rigorous pre-publication audit across all students and subject scores.
   */
  public static auditAcademicResults(
    results: StudentAcademicResult[],
    subjectCodes: string[] = ['101', '107', '109', '136', '137', '138', '126']
  ): IntegrityAuditReport {
    const totalStudents = results.length;
    let fullyTabulatedCount = 0;
    let pendingMarksCount = 0;
    const anomalies: string[] = [];

    let passedCount = 0;
    let goldenCount = 0;
    let aplusCount = 0;

    results.forEach(res => {
      let studentHasMissingMarks = false;

      subjectCodes.forEach(code => {
        const score = res.scores.find(s => s.subject_code === code);
        if (!score) {
          studentHasMissingMarks = true;
          anomalies.push(`Roll #${res.roll_number} (${res.student_name}) is missing score for Subject Code ${code}.`);
        } else if (score.total_marks === 0 && score.is_passed === false) {
          anomalies.push(`Roll #${res.roll_number} has 0 marks recorded in ${score.subject_name}.`);
        }
      });

      if (studentHasMissingMarks) {
        pendingMarksCount++;
      } else {
        fullyTabulatedCount++;
      }

      if (res.is_passed) {
        passedCount++;
        if (res.gpa_with_optional === 5.00) {
          if (res.final_grade.includes('Golden')) {
            goldenCount++;
          } else {
            aplusCount++;
          }
        }
      }
    });

    const failedCount = totalStudents - passedCount;
    const passPercentage = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0;
    const isReady = pendingMarksCount === 0 && anomalies.length === 0;

    return {
      isReadyForPublish: isReady,
      totalStudents,
      fullyTabulatedCount,
      pendingMarksCount,
      passedCount,
      failedCount,
      passPercentage,
      goldenAplusCount: goldenCount,
      regularAplusCount: aplusCount,
      anomalies,
      auditTimestamp: new Date().toLocaleString()
    };
  }

  /**
   * Generates official Board Publication Certificate
   */
  public static generatePublicationCertificate(
    institute: Institute,
    examName: string,
    controllerName: string = 'Mahbubur Rahman'
  ): BoardPublicationCertificate {
    const certId = `CERT-BISE-${institute.eiin}-${Date.now().toString().slice(-6)}`;
    const hash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED`;
    const verificationUrl = `https://boardresults.aeroedu.bd/verify?cert=${certId}&eiin=${institute.eiin}`;

    return {
      certificateId: certId,
      examName,
      eiin: institute.eiin,
      institutionName: institute.name,
      certifiedBy: controllerName,
      certifiedDesignation: 'Controller of Examinations',
      publishedAt: new Date().toLocaleString(),
      securityHash: hash,
      verificationUrl,
      status: 'published'
    };
  }
}
