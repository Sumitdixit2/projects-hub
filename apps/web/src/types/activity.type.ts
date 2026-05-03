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
    limit: string;
    page: string;
}

export type activityOutputType = {
  id: string;
  action: string;
  name: string;
  entity_type: entityType;
  created_at: string;
}
