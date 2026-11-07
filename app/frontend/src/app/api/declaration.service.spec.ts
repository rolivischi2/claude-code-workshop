import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateDeclarationRequest, DeclarationDto } from '../../generated/api-types';
import { DeclarationService } from './declaration.service';

describe('DeclarationService', () => {
  let service: DeclarationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DeclarationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the declarations of an office sorted by release time', () => {
    const later = { mrn: 'B', releasedAt: '2026-11-08T14:00:00' } as DeclarationDto;
    const earlier = { mrn: 'A', releasedAt: '2026-11-08T09:00:00' } as DeclarationDto;
    let result: DeclarationDto[] = [];

    service.getByOffice('CH001234').subscribe((list) => (result = list));
    http.expectOne('/api/declarations?office=CH001234').flush([later, earlier]);

    expect(result.map((d) => d.mrn)).toEqual(['A', 'B']);
  });

  it('posts a new declaration', () => {
    const request: CreateDeclarationRequest = {
      departureOffice: 'CH002345',
      destinationOffice: 'CH001234',
      guaranteeReference: '26CH1000000000022',
      amount: 1500,
      releasedAt: '2026-11-08T10:00',
      deadlineDays: 5,
    };

    service.create(request).subscribe();
    const req = http.expectOne('/api/declarations');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ mrn: '26CH00000000000055', ...request });
  });

  it('confirms the arrival of a declaration', () => {
    service.confirmArrival('26CH0000000000001R').subscribe();
    const req = http.expectOne('/api/declarations/26CH0000000000001R/arrival');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
