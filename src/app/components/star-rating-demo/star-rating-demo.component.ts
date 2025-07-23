import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-star-rating-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent],
  templateUrl: './star-rating-demo.component.html',
  styleUrl: './star-rating-demo.component.scss'
})
export class StarRatingDemoComponent {
  ratingForm: FormGroup;
  submittedValue: number | null = null;

  constructor(private fb: FormBuilder) {
    this.ratingForm = this.fb.group({
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  onSubmit(): void {
    if (this.ratingForm.valid) {
      this.submittedValue = this.ratingForm.get('rating')?.value;
      console.log('Form submitted with rating:', this.submittedValue);
    } else {
      console.log('Form is invalid');
    }
  }

  enableRating(): void {
    this.ratingForm.get('rating')?.enable();
  }

  disableRating(): void {
    this.ratingForm.get('rating')?.disable();
  }

  resetForm(): void {
    this.ratingForm.reset({ rating: 3 });
    this.submittedValue = null;
  }

  get isRatingDisabled(): boolean {
    return this.ratingForm.get('rating')?.disabled ?? false;
  }

  get currentRatingValue(): number {
    return this.ratingForm.get('rating')?.value ?? 0;
  }
}
