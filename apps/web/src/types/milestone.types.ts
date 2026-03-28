export enum milestoneStatus {
  draft = "draft",
  pending = "pending",
  active = "active",
  on_hold = "on_hold",
  completed = "completed",
  cancelled = "cancelled"
}

export type MilestoneType = {
  name: string,
  description: string,
  due_date: Date,
  initialStatus: milestoneStatus
}


