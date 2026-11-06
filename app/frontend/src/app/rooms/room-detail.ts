import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationDto, RoomDto } from '../../generated/api-types';
import { ReservationService } from '../api/reservation.service';
import { RoomService } from '../api/room.service';

@Component({
  selector: 'app-room-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './room-detail.html',
})
export class RoomDetail implements OnInit {
  private readonly roomService = inject(RoomService);
  private readonly reservationService = inject(ReservationService);

  /** Bound from the `:id` route parameter. */
  readonly id = input.required({ transform: numberAttribute });

  protected readonly room = signal<RoomDto | undefined>(undefined);
  protected readonly reservations = signal<ReservationDto[]>([]);

  ngOnInit(): void {
    this.roomService.get(this.id()).subscribe((room) => this.room.set(room));
    this.loadReservations();
  }

  protected remove(reservation: ReservationDto): void {
    this.reservationService.delete(reservation.id).subscribe(() => this.loadReservations());
  }

  private loadReservations(): void {
    this.reservationService
      .getByRoom(this.id())
      .subscribe((reservations) => this.reservations.set(reservations));
  }
}
