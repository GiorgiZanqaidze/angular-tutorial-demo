import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { User, UserUpdateRequest } from '../../models/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  user: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  isUploadingAvatar = false;
  successMessage = '';
  errorMessage = '';

  readonly languages = [
    { code: 'ka', name: 'ქართული' },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.createProfileForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      bio: ['', [Validators.maxLength(500)]],
      dateOfBirth: [''],
      location: [''],
      website: [''],
      jobTitle: [''],
      company: [''],
      socialMedia: this.fb.group({
        linkedin: [''],
        twitter: [''],
        github: ['']
      }),
      preferences: this.fb.group({
        emailNotifications: [true],
        darkMode: [false],
        language: ['ka']
      })
    });
  }

  private createPasswordForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          if (user) {
            this.populateForm(user);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load profile';
          this.isLoading = false;
        }
      });
  }

  private populateForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      bio: user.bio || '',
      dateOfBirth: user.dateOfBirth ? this.formatDateForInput(user.dateOfBirth) : '',
      location: user.location || '',
      website: user.website || '',
      jobTitle: user.jobTitle || '',
      company: user.company || '',
      socialMedia: {
        linkedin: user.socialMedia?.linkedin || '',
        twitter: user.socialMedia?.twitter || '',
        github: user.socialMedia?.github || ''
      },
      preferences: {
        emailNotifications: user.preferences?.emailNotifications ?? true,
        darkMode: user.preferences?.darkMode ?? false,
        language: user.preferences?.language || 'ka'
      }
    });
  }

  private formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  toggleEdit(): void {
    if (this.isEditing) {
      // Cancel editing
      if (this.user) {
        this.populateForm(this.user);
      }
      this.clearMessages();
    }
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isSaving = true;
    this.clearMessages();

    const formValue = this.profileForm.value;
    const updateRequest: UserUpdateRequest = {
      ...formValue,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined
    };

    this.userService.updateUser(updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.isEditing = false;
          this.isSaving = false;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update profile';
          this.isSaving = false;
        }
      });
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }

      this.uploadAvatar(file);
    }
  }

  private uploadAvatar(file: File): void {
    this.isUploadingAvatar = true;
    this.clearMessages();

    this.userService.uploadAvatar(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (avatarUrl) => {
          if (this.user) {
            this.user.avatar = avatarUrl;
            this.successMessage = 'Avatar updated successfully!';
            setTimeout(() => this.clearMessages(), 3000);
          }
          this.isUploadingAvatar = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to upload avatar';
          this.isUploadingAvatar = false;
        }
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = 'Password changed successfully!';
            this.passwordForm.reset();
            setTimeout(() => this.clearMessages(), 3000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to change password';
          this.isLoading = false;
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['email']) return 'Invalid email format';
    }
    return '';
  }

  getPasswordError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return 'Password must be at least 8 characters';
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  getUserInitials(): string {
    if (!this.user) return '';
    return this.userService.getInitials(this.user);
  }

  getFullName(): string {
    if (!this.user) return '';
    return this.userService.getFullName(this.user);
  }
}
