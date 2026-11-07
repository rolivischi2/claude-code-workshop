import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const MAX_DEADLINE_DAYS = 30;

/**
 * Cross-field rules for a transit declaration.
 * `releasedAt` is a local date-time string (e.g. "2026-11-08T10:00").
 * Returns null when valid or when a value is still missing.
 */
export function validateDeclaration(
  departureOffice: string,
  destinationOffice: string,
  releasedAt: string,
  now: Date,
): ValidationErrors | null {
  const errors: ValidationErrors = {};
  if (departureOffice && departureOffice === destinationOffice) {
    errors['sameOffice'] = true;
  }
  if (releasedAt && new Date(releasedAt).getTime() < now.getTime()) {
    errors['releaseInPast'] = true;
  }
  return Object.keys(errors).length ? errors : null;
}

/** Form-group validator reading the office and `releasedAt` controls. */
export function declarationValidator(now: () => Date = () => new Date()): ValidatorFn {
  return (group: AbstractControl) =>
    validateDeclaration(
      group.get('departureOffice')?.value,
      group.get('destinationOffice')?.value,
      group.get('releasedAt')?.value,
      now(),
    );
}
