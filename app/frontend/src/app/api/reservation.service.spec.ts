import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateReservationRequest, ReservationDto } from '../../generated/api-types';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReservationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the reservations of a room sorted by start', () => {
    const later = { id: 1, start: '2026-11-08T14:00:00' } as ReservationDto;
    const earlier = { id: 2, start: '2026-11-08T09:00:00' } as ReservationDto;
    let result: ReservationDto[] = [];

    service.getByRoom(3).subscribe((list) => (result = list));
    http.expectOne('/api/reservations?roomId=3').flush([later, earlier]);

    expect(result.map((r) => r.id)).toEqual([2, 1]);
  });

  it('posts a new reservation', () => {
    const request: CreateReservationRequest = {
      roomId: 1,
      title: 'Sprint Review',
      organizer: 'Anna',
      start: '2026-11-08T10:00',
      end: '2026-11-08T11:00',
    };

    service.create(request).subscribe();
    const req = http.expectOne('/api/reservations');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ id: 9, ...request });
  });

  it('deletes a reservation', () => {
    service.delete(9).subscribe();
    expect(http.expectOne('/api/reservations/9').request.method).toBe('DELETE');
  });
});
