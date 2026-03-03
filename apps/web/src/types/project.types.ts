export type projectStatus = "draft" | "pending" | "active" | "on_hold" | "completed" | "cancelled";

export type projectType = {
  id: string;
  name: string;
  description: string;
  deadline: Date;
  client: string;
  assignedto: string;
  project_status: projectStatus;
}


