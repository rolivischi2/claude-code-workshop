import { validateTimeRange } from './reservation-validators';

describe('validateTimeRange', () => {
  const now = new Date('2026-11-06T12:00');

  it('accepts a future range of up to 4 hours', () => {
    expect(validateTimeRange('2026-11-08T10:00', '2026-11-08T14:00', now)).toBeNull();
  });

  it('ignores missing values', () => {
    expect(validateTimeRange('', '2026-11-08T14:00', now)).toBeNull();
  });

  it('rejects an end that is not after the start', () => {
    expect(validateTimeRange('2026-11-08T10:00', '2026-11-08T10:00', now)).toEqual({
      endNotAfterStart: true,
    });
  });

  it('rejects ranges longer than 4 hours', () => {
    expect(validateTimeRange('2026-11-08T10:00', '2026-11-08T14:01', now)).toEqual({
      tooLong: true,
    });
  });

  it('rejects a start in the past', () => {
    expect(validateTimeRange('2026-11-06T11:00', '2026-11-06T13:00', now)).toEqual({
      startInPast: true,
    });
  });
});
