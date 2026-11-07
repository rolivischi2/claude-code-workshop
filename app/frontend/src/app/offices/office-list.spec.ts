import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OfficeDto } from '../../generated/api-types';
import { OfficeList } from './office-list';

describe('OfficeList', () => {
  it('renders one row per office', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(OfficeList);
    const offices: OfficeDto[] = [
      { code: 'CH001234', name: 'Basel/Weil-Autobahn', role: 'BOTH' },
      { code: 'CH003456', name: 'Zürich-Flughafen', role: 'DESTINATION' },
    ];

    TestBed.inject(HttpTestingController).expectOne('/api/offices').flush(offices);
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('[data-testid="office-row"]');
    expect(rows.length).toBe(2);
    expect(rows[1].textContent).toContain('Zürich-Flughafen');
    expect(rows[1].textContent).toContain('Bestimmung');
    expect(rows[0].querySelector('a').getAttribute('href')).toBe('/offices/CH001234');
  });
});
