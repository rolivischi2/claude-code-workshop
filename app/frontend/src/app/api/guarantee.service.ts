import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GuaranteeDto } from '../../generated/api-types';

@Injectable({ providedIn: 'root' })
export class GuaranteeService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<GuaranteeDto[]> {
    return this.http.get<GuaranteeDto[]>('/api/guarantees');
  }
}
