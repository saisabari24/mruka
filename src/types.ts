export type SoftwareType = 'mobile' | 'website' | 'webapp' | 'desktop' | 'not-sure';

export interface ProjectInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectTitle: string;
  problemDescription: string;
  softwareType: SoftwareType;
  budgetRange: string;
  timeline: string;
  marketingChannel: string;
  submittedAt: string;
}

export type MeetingType = 'video' | 'phone' | 'in-person';

export interface BookingDetails {
  id: string;
  inquiryId?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  meetingType: MeetingType;
  bookedAt: string;
}

export type ProjectStatus = 'In development' | 'On hold' | 'Delivered' | 'Pending Approval';
export type MilestoneStatus = 'Completed' | 'In Progress' | 'Pending' | 'Delayed';

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  status: MilestoneStatus;
  dueDate: string;
  requiresClientAction?: boolean;
  clientActionLabel?: string;
}

export interface ProjectState {
  id: string; // e.g., MRK-8291
  name: string;
  company: string;
  status: ProjectStatus;
  milestonesCompleted: number;
  totalMilestones: number;
  daysRemaining: number;
  managerName: string;
  managerEmail: string;
  projectHealth: 'Healthy' | 'Needs Attention' | 'At Risk';
  progressPercentage: number;
  milestones: ProjectMilestone[];
}
