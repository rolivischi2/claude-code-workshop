// AUTO-GENERATED from the backend OpenAPI spec. DO NOT EDIT – changes will be overwritten.

export type OfficeRole = 'DEPARTURE' | 'DESTINATION' | 'BOTH';

export type DeclarationStatus = 'OPEN' | 'ARRIVED' | 'CLOSED';

export interface OfficeDto {
  /** Customs office code, e.g. "CH001234" */
  code: string;
  name: string;
  role: OfficeRole;
}

export interface GuaranteeDto {
  /** Guarantee Reference Number (GRN), e.g. "26CH1000000000011" */
  grn: string;
  holder: string;
  /** CHF */
  referenceAmount: number;
}

export interface DeclarationDto {
  /** Movement Reference Number, e.g. "26CH0000000000001R" */
  mrn: string;
  departureOffice: string;
  destinationOffice: string;
  guaranteeReference: string;
  /** CHF */
  amount: number;
  /** Local date-time without zone, e.g. "2026-11-08T10:00:00" */
  releasedAt: string;
  /** Local date, e.g. "2026-11-14" */
  deadline: string;
  status: DeclarationStatus;
  /** Time left until the deadline, e.g. "3 Tage", "1 Tag" or "abgelaufen" */
  remaining: string;
}

export interface CreateDeclarationRequest {
  departureOffice: string;
  destinationOffice: string;
  guaranteeReference: string;
  amount: number;
  releasedAt: string;
  /** Gestellungsfrist in days after release, 1..30 */
  deadlineDays: number;
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code?: string;
  errors?: Record<string, string>;
}
