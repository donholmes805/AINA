
export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  };
}

export interface Article {
  id: string;
  title: string;
  content: string;
  sources: GroundingSource[];
  imageUrl?: string;
}

export enum UserRole {
  Admin = 'Admin',
  Anchor = 'Anchor',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export enum SngineUserGroup {
  Admin,
  Anchor,
}

export interface SngineUser {
  user_id: string;
  user_name: string;
  user_group: SngineUserGroup;
}
