import { HttpErrorResponse } from '@angular/common/http';
import { serverErrorMessage } from './server-error-message';

const error = (status: number, body: unknown = null) =>
  new HttpErrorResponse({ status, error: body });

describe('serverErrorMessage', () => {
  it('shows the detail of the problem detail', () => {
    const problem = {
      status: 409,
      code: 'TR-4091',
      detail: 'Referenzbetrag der Garantie überschritten (noch verfügbar: CHF 500.00)',
    };
    expect(serverErrorMessage(error(409, problem))).toBe(problem.detail);
  });

  it('lists the field errors of a validation problem instead of its English detail', () => {
    const problem = {
      status: 400,
      detail: 'Request validation failed',
      errors: { amount: 'Betrag muss grösser als 0 sein' },
    };
    expect(serverErrorMessage(error(400, problem))).toBe(
      'Die Angaben sind ungültig: Betrag muss grösser als 0 sein.',
    );
  });

  it('falls back to a German text by status when there is no detail', () => {
    expect(serverErrorMessage(error(409))).toContain('abgelehnt');
    expect(serverErrorMessage(error(409, { detail: '  ' }))).toContain('abgelehnt');
    expect(serverErrorMessage(error(400))).toContain('ungültig');
    expect(serverErrorMessage(error(0))).toContain('nicht erreichbar');
  });

  it('ignores a non-JSON body and has a generic text for everything else', () => {
    expect(serverErrorMessage(error(502, 'Bad Gateway'))).toContain('später erneut');
  });
});
