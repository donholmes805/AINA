
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
