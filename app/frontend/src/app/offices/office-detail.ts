import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeclarationDto, OfficeDto } from '../../generated/api-types';
import { DeclarationService } from '../api/declaration.service';
import { OfficeService } from '../api/office.service';
import { ROLE_LABELS, STATUS_LABELS } from '../labels';

@Component({
  selector: 'app-office-detail',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './office-detail.html',
})
export class OfficeDetail implements OnInit {
  private readonly officeService = inject(OfficeService);
  private readonly declarationService = inject(DeclarationService);

  /** Bound from the `:code` route parameter. */
  readonly code = input.required<string>();

  protected readonly office = signal<OfficeDto | undefined>(undefined);
  protected readonly declarations = signal<DeclarationDto[]>([]);
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly statusLabels = STATUS_LABELS;

  ngOnInit(): void {
    this.officeService.get(this.code()).subscribe((office) => this.office.set(office));
    this.loadDeclarations();
  }

  protected confirmArrival(declaration: DeclarationDto): void {
    this.declarationService
      .confirmArrival(declaration.mrn)
      .subscribe(() => this.loadDeclarations());
  }

  private loadDeclarations(): void {
    this.declarationService
      .getByOffice(this.code())
      .subscribe((declarations) => this.declarations.set(declarations));
  }
}
