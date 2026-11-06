// AUTO-GENERATED from the backend OpenAPI spec. DO NOT EDIT – changes will be overwritten.

export interface RoomDto {
  id: number;
  name: string;
  capacity: number;
  floor: number;
}

export interface ReservationDto {
  id: number;
  roomId: number;
  title: string;
  organizer: string;
  /** Local date-time without zone, e.g. "2026-11-08T10:00:00" */
  start: string;
  /** Local date-time without zone, e.g. "2026-11-08T12:00:00" */
  end: string;
}

export interface CreateReservationRequest {
  roomId: number;
  title: string;
  organizer: string;
  start: string;
  end: string;
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
