import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DeclarationService } from '../api/declaration.service';
import { GuaranteeService } from '../api/guarantee.service';
import { OfficeService } from '../api/office.service';
import { MAX_DEADLINE_DAYS, declarationValidator } from './declaration-validators';

@Component({
  selector: 'app-declaration-form',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './declaration-form.html',
})
export class DeclarationForm implements OnInit {
  private readonly declarationService = inject(DeclarationService);
  private readonly router = inject(Router);

  /** Bound from the `:code` route parameter: the departure office. */
  readonly code = input.required<string>();

  private readonly offices = toSignal(inject(OfficeService).getAll(), { initialValue: [] });
  protected readonly guarantees = toSignal(inject(GuaranteeService).getAll(), {
    initialValue: [],
  });
  protected readonly office = computed(() => this.offices().find((o) => o.code === this.code()));
  protected readonly departureOffices = computed(() =>
    this.offices().filter((o) => o.role !== 'DESTINATION'),
  );
  protected readonly destinationOffices = computed(() =>
    this.offices().filter((o) => o.role !== 'DEPARTURE'),
  );
  protected readonly saving = signal(false);
  protected readonly maxDeadlineDays = MAX_DEADLINE_DAYS;

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      departureOffice: ['', Validators.required],
      destinationOffice: ['', Validators.required],
      guaranteeReference: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      releasedAt: ['', Validators.required],
      deadlineDays: [
        8,
        [Validators.required, Validators.min(1), Validators.max(MAX_DEADLINE_DAYS)],
      ],
    },
    { validators: declarationValidator() },
  );

  ngOnInit(): void {
    this.form.controls.departureOffice.setValue(this.code());
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
    this.declarationService.create(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/offices', this.code()]),
      error: () => this.saving.set(false),
    });
  }
}
