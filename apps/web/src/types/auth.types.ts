export type UserRole = 'owner' | 'staff' | 'developer' | 'client';

export type agencyRegisterDataType = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  description?: string;
  website?: string;
}

export type clientRegisterDataType = {
  name: string;
  email: string;
  password: string;
  agency_id: string;
  inviteKey: string;
}

export type ownerRegisterDataType = {
  admin_id: string;
  fullname: string;
  admin_role: "owner";
  agency_password: string;
  agency_email: string;
  email: string;
  password: string;
}

export type memberRegisterDataType = {
  admin_id: string;
  fullname: string;
  admin_role: "staff" | "dev";
  email: string;
  password: string;
  inviteKey: string;
}

export type adminLoginDataType = {
  agencyId: string;
  email: string;
  password: string;
  admin_role: UserRole;
}
