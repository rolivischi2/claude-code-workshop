import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomDto } from '../../generated/api-types';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<RoomDto[]> {
    return this.http.get<RoomDto[]>('/api/rooms');
  }

  get(id: number): Observable<RoomDto> {
    return this.http.get<RoomDto>(`/api/rooms/${id}`);
  }
}
