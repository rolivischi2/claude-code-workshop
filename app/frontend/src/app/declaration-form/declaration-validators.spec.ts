import { validateDeclaration } from './declaration-validators';

describe('validateDeclaration', () => {
  const now = new Date('2026-11-06T12:00');

  it('accepts different offices and a future release', () => {
    expect(validateDeclaration('CH002345', 'CH001234', '2026-11-08T10:00', now)).toBeNull();
  });

  it('ignores missing values', () => {
    expect(validateDeclaration('', '', '', now)).toBeNull();
  });

  it('rejects the same office for departure and destination', () => {
    expect(validateDeclaration('CH001234', 'CH001234', '2026-11-08T10:00', now)).toEqual({
      sameOffice: true,
    });
  });

  it('rejects a release in the past', () => {
    expect(validateDeclaration('CH002345', 'CH001234', '2026-11-06T11:00', now)).toEqual({
      releaseInPast: true,
    });
  });

  it('accepts a release right now', () => {
    expect(validateDeclaration('CH002345', 'CH001234', '2026-11-06T12:00', now)).toBeNull();
  });
});
