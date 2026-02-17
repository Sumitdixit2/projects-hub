export type projectStatus = "draft" | "pending" |  "active" | "on_hold" |"completed" | "cancelled";

export type projectType = {
  name: string;
  description: string;
  deadline: Date;
  clientId: string;
  assignedTo : string;
  project_status: projectStatus;
}

 
   
