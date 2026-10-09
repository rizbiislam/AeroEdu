import type { Student } from '../types';

export class StudentEntity {
  public readonly id: string;
  public readonly admissionNo: string;
  public readonly fullName: string;
  public readonly fullNameBn: string;
  public readonly rollNumber: number;
  public readonly classId: string;
  public readonly className: string;
  public readonly sectionId: string;
  public readonly sectionName: string;
  public readonly gender: 'male' | 'female' | 'other';
  public readonly dateOfBirth: string;
  public readonly guardianName: string;
  public readonly guardianPhone: string;
  public readonly guardianRelation: string;
  public readonly address: string;
  public attendancePercentage: number;
  public status: 'active' | 'transferred' | 'graduated' | 'suspended';
  public bloodGroup?: string;

  constructor(data: Student) {
    this.id = data.id;
    this.admissionNo = data.admission_no;
    this.fullName = data.full_name;
    this.fullNameBn = data.full_name_bn;
    this.rollNumber = data.roll_number;
    this.classId = data.class_id;
    this.className = data.class_name;
    this.sectionId = data.section_id;
    this.sectionName = data.section_name;
    this.gender = data.gender;
    this.dateOfBirth = data.date_of_birth;
    this.guardianName = data.guardian_name;
    this.guardianPhone = data.guardian_phone;
    this.guardianRelation = data.guardian_relation;
    this.address = data.address;
    this.attendancePercentage = data.attendance_percentage;
    this.status = data.status;
    this.bloodGroup = data.blood_group;
  }

  public static fromJSON(json: Student): StudentEntity {
    return new StudentEntity(json);
  }

  /**
   * Statutory rule: Candidate must maintain at least 75% attendance for Board Examination eligibility.
   */
  public isBoardAttendanceEligible(): boolean {
    return this.attendancePercentage >= 75;
  }

  public getFormattedRoll(): string {
    return this.rollNumber < 10 ? `Roll #0${this.rollNumber}` : `Roll #${this.rollNumber}`;
  }

  public getAttendanceBadge(): { label: string; color: 'green' | 'amber' | 'red' } {
    if (this.attendancePercentage >= 85) {
      return { label: `${this.attendancePercentage}% (Regular)`, color: 'green' };
    }
    if (this.attendancePercentage >= 75) {
      return { label: `${this.attendancePercentage}% (Eligible)`, color: 'amber' };
    }
    return { label: `${this.attendancePercentage}% (Non-Collegiate / Risk)`, color: 'red' };
  }

  public getDisplayName(language: 'en' | 'bn' = 'en'): string {
    return language === 'bn' && this.fullNameBn ? this.fullNameBn : this.fullName;
  }

  public toJSON(): Student {
    return {
      id: this.id,
      admission_no: this.admissionNo,
      full_name: this.fullName,
      full_name_bn: this.fullNameBn,
      roll_number: this.rollNumber,
      class_id: this.classId,
      class_name: this.className,
      section_id: this.sectionId,
      section_name: this.sectionName,
      gender: this.gender,
      date_of_birth: this.dateOfBirth,
      guardian_name: this.guardianName,
      guardian_phone: this.guardianPhone,
      guardian_relation: this.guardianRelation,
      attendance_percentage: this.attendancePercentage,
      status: this.status,
      address: this.address,
      blood_group: this.bloodGroup
    };
  }
}
