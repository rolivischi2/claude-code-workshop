import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { RoomService } from '../api/room.service';

@Component({
  selector: 'app-room-list',
  imports: [RouterLink],
  templateUrl: './room-list.html',
})
export class RoomList {
  protected readonly rooms = toSignal(inject(RoomService).getAll(), { initialValue: [] });
}
