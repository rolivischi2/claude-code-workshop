import { Component, OnInit, inject, input, numberAttribute, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoomDto } from '../../generated/api-types';
import { ReservationService } from '../api/reservation.service';
import { RoomService } from '../api/room.service';
import { timeRangeValidator } from './reservation-validators';

@Component({
  selector: 'app-reservation-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reservation-form.html',
})
export class ReservationForm implements OnInit {
  private readonly roomService = inject(RoomService);
  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);

  /** Bound from the `:id` route parameter. */
  readonly id = input.required({ transform: numberAttribute });

  protected readonly room = signal<RoomDto | undefined>(undefined);
  protected readonly saving = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      title: ['', [Validators.required, Validators.maxLength(120)]],
      organizer: ['', [Validators.required, Validators.maxLength(80)]],
      start: ['', Validators.required],
      end: ['', Validators.required],
    },
    { validators: timeRangeValidator() },
  );

  ngOnInit(): void {
    this.roomService.get(this.id()).subscribe((room) => this.room.set(room));
  }

  protected showErrors(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.reservationService.create({ roomId: this.id(), ...this.form.getRawValue() }).subscribe({
      next: () => this.router.navigate(['/rooms', this.id()]),
      error: () => this.saving.set(false),
    });
  }
}
