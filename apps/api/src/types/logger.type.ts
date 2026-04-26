export enum entityType {
  Project = "Project",
  Milestone = "Milestone",
  Admin = "Admin",
  Client = "Client",
  Key = "Key"
}

export type loggerType = {
  admin_id: string,
  action: string,
  entity_type: entityType,
  entity_id : string,
}
