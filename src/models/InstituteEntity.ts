import type { Institute } from '../types';

export class InstituteEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly nameBn?: string;
  public readonly slug: string;
  public readonly eiin: string;
  public readonly examBoardId: string;
  public readonly examBoardName: string;
  public readonly instituteType: 'school' | 'college' | 'madrasha' | 'coaching';
  public readonly status: 'trial' | 'active' | 'suspended';
  public readonly currentPlan: string;
  public readonly address: string;
  public readonly contactEmail: string;
  public readonly contactPhone: string;
  public readonly studentCount: number;
  public readonly staffCount: number;
  public readonly academicYear: string;

  constructor(data: Institute) {
    this.id = data.id;
    this.name = data.name;
    this.nameBn = data.name_bn;
    this.slug = data.slug;
    this.eiin = data.eiin;
    this.examBoardId = data.exam_board_id;
    this.examBoardName = data.exam_board_name;
    this.instituteType = data.institute_type;
    this.status = data.status;
    this.currentPlan = data.current_plan;
    this.address = data.address;
    this.contactEmail = data.contact_email;
    this.contactPhone = data.contact_phone;
    this.studentCount = data.student_count;
    this.staffCount = data.staff_count;
    this.academicYear = data.academic_year;
  }

  public static fromJSON(json: Institute): InstituteEntity {
    return new InstituteEntity(json);
  }

  public getOfficialHeader(): string {
    return `${this.name} (EIIN: ${this.eiin})`;
  }

  public getBoardAffiliation(): string {
    return `Board of Intermediate and Secondary Education, ${this.examBoardName || 'Dhaka'}`;
  }

  public getDisplayName(lang: 'en' | 'bn' = 'en'): string {
    return lang === 'bn' && this.nameBn ? this.nameBn : this.name;
  }
}
