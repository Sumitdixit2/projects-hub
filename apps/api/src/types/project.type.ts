export enum projectStatus {
  draft = "draft",
  pending = "pending",
  active = "active",
  on_hold = "on_hold",
  completed = "completed",
  cancelled = "cancelled"
}

export type projectType = {
  name: string,
  description: string,
  deadline: Date,
  clientId: string,
  assignedTo: string,
  project_status: "draft" | "pending" | "active" | "on_hold" | "completed" | "cancelled"
}
