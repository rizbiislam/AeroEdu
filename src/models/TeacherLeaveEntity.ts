import type { TeacherLeaveRequest } from '../types';

export class TeacherLeaveEntity {
  public readonly id: string;
  public readonly teacherId: string;
  public readonly teacherName: string;
  public readonly department: string;
  public readonly leaveType: 'Casual' | 'Medical' | 'Maternity' | 'Official';
  public readonly startDate: string;
  public readonly endDate: string;
  public readonly daysCount: number;
  public readonly reason: string;
  public substituteTeacherName: string;
  public status: 'pending' | 'approved' | 'rejected';

  constructor(data: TeacherLeaveRequest) {
    this.id = data.id;
    this.teacherId = data.teacher_id;
    this.teacherName = data.teacher_name;
    this.department = data.department;
    this.leaveType = data.leave_type;
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.daysCount = data.days_count;
    this.reason = data.reason;
    this.substituteTeacherName = data.substitute_teacher_name;
    this.status = data.status;
  }

  public static fromJSON(json: TeacherLeaveRequest): TeacherLeaveEntity {
    return new TeacherLeaveEntity(json);
  }

  public requiresSubstitute(): boolean {
    return this.daysCount >= 1;
  }

  public hasSubstituteAssigned(): boolean {
    return !!this.substituteTeacherName && this.substituteTeacherName !== 'Pending Designation';
  }

  public getStatusBadge(): { label: string; badgeClass: string } {
    switch (this.status) {
      case 'approved':
        return { label: 'Leave Sanctioned', badgeClass: 'badge-green' };
      case 'rejected':
        return { label: 'Request Declined', badgeClass: 'badge-red' };
      case 'pending':
      default:
        return { label: 'Pending Principal Approval', badgeClass: 'badge-amber' };
    }
  }

  public toJSON(): TeacherLeaveRequest {
    return {
      id: this.id,
      teacher_id: this.teacherId,
      teacher_name: this.teacherName,
      department: this.department,
      leave_type: this.leaveType,
      start_date: this.startDate,
      end_date: this.endDate,
      days_count: this.daysCount,
      reason: this.reason,
      substitute_teacher_name: this.substituteTeacherName,
      status: this.status
    };
  }
}
