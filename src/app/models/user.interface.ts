export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: Date;
  location?: string;
  website?: string;
  jobTitle?: string;
  company?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: Date;
  location?: string;
  website?: string;
  jobTitle?: string;
  company?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    darkMode?: boolean;
    language?: string;
  };
}
