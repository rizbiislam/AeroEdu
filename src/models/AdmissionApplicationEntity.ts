import type { AdmissionApplication } from '../types';

export class AdmissionApplicationEntity {
  public readonly id: string;
  public readonly applicantName: string;
  public readonly applicantNameBn?: string;
  public readonly guardianName: string;
  public readonly phone: string;
  public readonly targetClass: string;
  public readonly targetGroup: string;
  public readonly previousSchool: string;
  public readonly previousGpa: number;
  public readonly submissionDate: string;
  public status: 'pending' | 'interview_scheduled' | 'approved' | 'rejected' | 'enrolled';
  public applicationFeePaid: boolean;

  constructor(data: AdmissionApplication) {
    this.id = data.id;
    this.applicantName = data.applicant_name;
    this.applicantNameBn = data.applicant_name_bn;
    this.guardianName = data.guardian_name;
    this.phone = data.phone;
    this.targetClass = data.target_class;
    this.targetGroup = data.target_group;
    this.previousSchool = data.previous_school;
    this.previousGpa = data.previous_gpa;
    this.submissionDate = data.submission_date;
    this.status = data.status;
    this.applicationFeePaid = data.application_fee_paid;
  }

  public static fromJSON(json: AdmissionApplication): AdmissionApplicationEntity {
    return new AdmissionApplicationEntity(json);
  }

  public isHighMerit(): boolean {
    return this.previousGpa >= 4.80;
  }

  public canAutoEnroll(): boolean {
    return this.isHighMerit() && this.applicationFeePaid && this.status === 'approved';
  }

  public getStatusBadge(): { label: string; badgeClass: string } {
    switch (this.status) {
      case 'approved':
        return { label: 'Approved & Cleared', badgeClass: 'badge-green' };
      case 'enrolled':
        return { label: 'Enrolled (ID Assigned)', badgeClass: 'badge-purple' };
      case 'interview_scheduled':
        return { label: 'Interview Scheduled', badgeClass: 'badge-blue' };
      case 'rejected':
        return { label: 'Application Rejected', badgeClass: 'badge-red' };
      case 'pending':
      default:
        return { label: 'Pending Scrutiny', badgeClass: 'badge-amber' };
    }
  }

  public toJSON(): AdmissionApplication {
    return {
      id: this.id,
      applicant_name: this.applicantName,
      applicant_name_bn: this.applicantNameBn,
      guardian_name: this.guardianName,
      phone: this.phone,
      target_class: this.targetClass,
      target_group: this.targetGroup,
      previous_school: this.previousSchool,
      previous_gpa: this.previousGpa,
      submission_date: this.submissionDate,
      status: this.status,
      application_fee_paid: this.applicationFeePaid
    };
  }
}
