import { Routes } from '@angular/router';
import { RoomList } from './rooms/room-list';
import { RoomDetail } from './rooms/room-detail';
import { ReservationForm } from './reservation-form/reservation-form';

export const routes: Routes = [
  { path: '', component: RoomList, title: 'Räume' },
  { path: 'rooms/:id', component: RoomDetail, title: 'Raumdetails' },
  { path: 'rooms/:id/reserve', component: ReservationForm, title: 'Neue Reservation' },
  { path: '**', redirectTo: '' },
];
