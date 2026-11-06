import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreateReservationRequest, ReservationDto } from '../../generated/api-types';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly http = inject(HttpClient);

  /** Reservations of a room, sorted by start time. */
  getByRoom(roomId: number): Observable<ReservationDto[]> {
    return this.http
      .get<ReservationDto[]>('/api/reservations', { params: { roomId } })
      .pipe(map((list) => [...list].sort((a, b) => a.start.localeCompare(b.start))));
  }

  create(request: CreateReservationRequest): Observable<ReservationDto> {
    return this.http.post<ReservationDto>('/api/reservations', request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reservations/${id}`);
  }
}
