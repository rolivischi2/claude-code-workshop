import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RoomDto } from '../../generated/api-types';
import { RoomList } from './room-list';

describe('RoomList', () => {
  it('renders one row per room', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(RoomList);
    const rooms: RoomDto[] = [
      { id: 1, name: 'Eiger', capacity: 12, floor: 1 },
      { id: 2, name: 'Moench', capacity: 6, floor: 1 },
    ];

    TestBed.inject(HttpTestingController).expectOne('/api/rooms').flush(rooms);
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('[data-testid="room-row"]');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Eiger');
    expect(rows[0].querySelector('a').getAttribute('href')).toBe('/rooms/1');
  });
});
