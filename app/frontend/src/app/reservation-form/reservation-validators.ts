import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const MAX_DURATION_MS = 4 * 60 * 60 * 1000;

/**
 * Cross-field rules for a reservation time range.
 * `start` and `end` are local date-time strings (e.g. "2026-11-08T10:00").
 * Returns null when valid or when a value is still missing.
 */
export function validateTimeRange(start: string, end: string, now: Date): ValidationErrors | null {
  if (!start || !end) {
    return null;
  }
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const errors: ValidationErrors = {};
  if (startTime <= now.getTime()) {
    errors['startInPast'] = true;
  }
  if (endTime <= startTime) {
    errors['endNotAfterStart'] = true;
  } else if (endTime - startTime > MAX_DURATION_MS) {
    errors['tooLong'] = true;
  }
  return Object.keys(errors).length ? errors : null;
}

/** Form-group validator reading the `start` and `end` controls. */
export function timeRangeValidator(now: () => Date = () => new Date()): ValidatorFn {
  return (group: AbstractControl) =>
    validateTimeRange(group.get('start')?.value, group.get('end')?.value, now());
}
