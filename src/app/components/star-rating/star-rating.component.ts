import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ]
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() maxStars: number = 5;
  
  rating: number = 0;
  hoveredRating: number = 0;
  disabled: boolean = false;
  
  private onChange = (rating: number) => {};
  private onTouched = () => {};

  get stars(): number[] {
    return Array.from({ length: this.maxStars }, (_, i) => i + 1);
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.rating = value || 0;
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Component methods
  onStarClick(star: number): void {
    if (this.disabled) return;
    
    this.rating = star;
    this.onChange(this.rating);
    this.onTouched();
  }

  onStarHover(star: number): void {
    if (this.disabled) return;
    this.hoveredRating = star;
  }

  onStarLeave(): void {
    if (this.disabled) return;
    this.hoveredRating = 0;
  }

  isStarFilled(star: number): boolean {
    const displayRating = this.hoveredRating || this.rating;
    return star <= displayRating;
  }
} 