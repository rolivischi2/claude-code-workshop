import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { OfficeService } from '../api/office.service';
import { ROLE_LABELS } from '../labels';

@Component({
  selector: 'app-office-list',
  imports: [RouterLink],
  templateUrl: './office-list.html',
})
export class OfficeList {
  protected readonly offices = toSignal(inject(OfficeService).getAll(), { initialValue: [] });
  protected readonly roleLabels = ROLE_LABELS;
}
