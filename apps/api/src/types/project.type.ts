export type projectType = {
  name: string,
  description: string,
  deadline: Date,
  clientId: string
}

export enum projectStatus {
  draft = "draft",
  pending = "pending",
  active = "active",
  on_hold = "on_hold",
  completed = "completed",
  cancelled = "cancelled"
}
