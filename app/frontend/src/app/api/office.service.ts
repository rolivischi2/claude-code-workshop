import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OfficeDto } from '../../generated/api-types';

@Injectable({ providedIn: 'root' })
export class OfficeService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<OfficeDto[]> {
    return this.http.get<OfficeDto[]>('/api/offices');
  }

  get(code: string): Observable<OfficeDto> {
    return this.http.get<OfficeDto>(`/api/offices/${code}`);
  }
}
