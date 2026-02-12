export type UserRole = 'owner' | 'staff' | 'developer' | 'client';

export type agencyRegisterDataType = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  description?: string;
  website?: string;
}
