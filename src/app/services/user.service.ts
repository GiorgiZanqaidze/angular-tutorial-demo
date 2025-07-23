import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { User, UserUpdateRequest } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = new BehaviorSubject<User | null>(null);

  // Mock user data for demonstration
  private mockUser: User = {
    id: '1',
    firstName: 'giorgi',
    lastName: 'zankaidze',
    email: 'giorgi.zankaidze@example.com',
    phone: '+995 555 123 456',
    bio: 'Passionate Angular developer with experience in building modern web applications. Love working with TypeScript and creating user-friendly interfaces.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: new Date('1990-05-15'),
    location: 'Tbilisi, Georgia',
    website: 'https://portfolio.example.com',
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Solutions Ltd',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/giorgi-zankaidze',
      twitter: 'https://twitter.com/giorgi_dev',
      github: 'https://github.com/giorgi-zankaidze'
    },
    preferences: {
      emailNotifications: true,
      darkMode: false,
      language: 'ka'
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  };

  constructor() {
    // Initialize with mock user
    this.currentUser.next(this.mockUser);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  getUserById(id: string): Observable<User | null> {
    // Simulate API call
    return of(this.mockUser).pipe(delay(500));
  }

  updateUser(updateRequest: UserUpdateRequest): Observable<User> {
    // Simulate API call
    const updatedUser: User = {
      ...this.mockUser,
      ...updateRequest,
      preferences: updateRequest.preferences ? {
        emailNotifications: updateRequest.preferences.emailNotifications ?? this.mockUser.preferences?.emailNotifications ?? true,
        darkMode: updateRequest.preferences.darkMode ?? this.mockUser.preferences?.darkMode ?? false,
        language: updateRequest.preferences.language ?? this.mockUser.preferences?.language ?? 'ka'
      } : this.mockUser.preferences,
      updatedAt: new Date()
    };

    // Update the current user
    this.mockUser = updatedUser;
    this.currentUser.next(updatedUser);

    return of(updatedUser).pipe(delay(1000));
  }

  uploadAvatar(file: File): Observable<string> {
    // Simulate file upload
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const avatarUrl = reader.result as string;
        // In real app, you'd upload to server and get URL back
        setTimeout(() => {
          observer.next(avatarUrl);
          observer.complete();
        }, 1500);
      };
      reader.readAsDataURL(file);
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // Simulate password change
    return of(true).pipe(delay(1000));
  }

  deleteAccount(): Observable<boolean> {
    // Simulate account deletion
    this.currentUser.next(null);
    return of(true).pipe(delay(1000));
  }

  // Helper methods
  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
}
