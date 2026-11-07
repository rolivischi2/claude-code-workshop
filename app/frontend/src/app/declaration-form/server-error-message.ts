import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../../generated/api-types';

const FALLBACK_BY_STATUS: Record<number, string> = {
  0: 'Der Server ist nicht erreichbar. Bitte später erneut versuchen.',
  400: 'Die Angaben sind ungültig. Bitte Eingaben prüfen.',
  404: 'Zollstelle oder Garantie existiert nicht.',
  409: 'Die Transitanmeldung wurde abgelehnt. Bitte Garantie und Betrag prüfen.',
};
const GENERIC =
  'Die Transitanmeldung konnte nicht gespeichert werden. Bitte später erneut versuchen.';

/**
 * Turns a failed backend call into a message for the form. The backend writes German texts into
 * the problem detail (`detail`, or `errors` per field on validation failures); without them the
 * HTTP status decides.
 */
export function serverErrorMessage(error: HttpErrorResponse): string {
  const problem =
    typeof error.error === 'object' ? (error.error as Partial<ProblemDetail> | null) : null;
  const fieldErrors = Object.values(problem?.errors ?? {});
  if (fieldErrors.length) {
    return `Die Angaben sind ungültig: ${fieldErrors.join(', ')}.`;
  }
  if (problem?.detail?.trim()) {
    return problem.detail;
  }
  return FALLBACK_BY_STATUS[error.status] ?? GENERIC;
}
