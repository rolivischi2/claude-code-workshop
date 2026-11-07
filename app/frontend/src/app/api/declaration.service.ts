import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreateDeclarationRequest, DeclarationDto } from '../../generated/api-types';

@Injectable({ providedIn: 'root' })
export class DeclarationService {
  private readonly http = inject(HttpClient);

  /** Declarations departing from or arriving at an office, sorted by release time. */
  getByOffice(office: string): Observable<DeclarationDto[]> {
    return this.http
      .get<DeclarationDto[]>('/api/declarations', { params: { office } })
      .pipe(map((list) => [...list].sort((a, b) => a.releasedAt.localeCompare(b.releasedAt))));
  }

  create(request: CreateDeclarationRequest): Observable<DeclarationDto> {
    return this.http.post<DeclarationDto>('/api/declarations', request);
  }

  confirmArrival(mrn: string): Observable<DeclarationDto> {
    return this.http.post<DeclarationDto>(`/api/declarations/${mrn}/arrival`, null);
  }
}
