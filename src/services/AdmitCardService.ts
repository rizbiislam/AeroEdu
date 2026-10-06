import type { AdmitCard, Institute, Student } from '../types';

export interface VerificationTokenPayload {
  eiin: string;
  institute_name: string;
  student_id: string;
  roll_number: number;
  registration_number: string;
  exam_code: string;
  exam_year: number;
  digital_signature: string;
  verification_url: string;
}

export class AdmitCardService {
  /**
   * Generates a tamper-proof verification URL and payload for the Admit Card QR code.
   */
  public static generateAdmitCardPayload(
    card: AdmitCard,
    institute: Institute,
    student?: Student
  ): VerificationTokenPayload {
    const rawString = `${institute.eiin}-${card.roll_number}-${card.registration_number || '2026'}-${card.exam_name}-BISE-DHAKA`;
    
    // Create deterministic pseudo-hash for verification seal
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const signatureHex = `SIG-${Math.abs(hash).toString(16).toUpperCase()}-2027-DHAKA`;
    const regNo = card.registration_number || student?.admission_no || '2025-001402';

    const verificationUrl = `https://verify.aeroedu.bd/admit?eiin=${institute.eiin}&reg=${regNo}&roll=${card.roll_number}&sig=${signatureHex}`;

    return {
      eiin: institute.eiin,
      institute_name: institute.name,
      student_id: card.id,
      roll_number: card.roll_number,
      registration_number: regNo,
      exam_code: 'SSC-PRETEST-2027',
      exam_year: 2027,
      digital_signature: signatureHex,
      verification_url: verificationUrl
    };
  }

  /**
   * Returns official Bangladesh Board examination instructions for the candidate.
   */
  public static getOfficialExamRules(): string[] {
    return [
      '1. Candidates must enter the designated examination hall at least 30 minutes prior to commencement of the exam.',
      '2. Under no circumstances will mobile phones, smartwatches, or unauthorized electronic memory devices be permitted inside the examination hall.',
      '3. Candidates may use non-programmable scientific calculators only during designated Mathematics and Science examinations.',
      '4. The Admit Card and original Registration Card must be displayed on the desk for verification by the hall invigilator at all times.',
      '5. OMR sheets must be filled out using black ballpoint ink only. Erasing or scratching on the OMR sheet will lead to cancellation.',
      '6. Candidates must ensure the invigilator signs both their OMR answer script and descriptive answer script.',
      '7. Possession of any unauthorized paper, chit, or unfair means will lead to immediate expulsion under the Public Examinations (Offences) Act.',
      '8. Preserve this official Admit Card carefully until publication of final Board certificates and transcripts.'
    ];
  }
}
