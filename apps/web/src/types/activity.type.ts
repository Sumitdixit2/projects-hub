export enum actionType {
  CREATE= "CREATE",
  READ= "READ",
  UPDATE= "UPDATE",
  DELETE= "DELETE",
}

export enum entityType {
  Project = "Project",
  Milestone = "Milestone",
  Admin = "Admin",
  Client = "Client",
  Key = "Key"
}

export type activityInputType = {
    limit: string,
    page: string,
}

export type activityOutputType = {
  id: string;
  admin_id: string;
  action: string;
  action_type: actionType;
  entity_type: entityType;
  entity_id: string;
  created_at: string;
}
