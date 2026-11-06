package com.example.raumreservation.reservation;

import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

  public ReservationDto toDto(Reservation reservation) {
    return new ReservationDto(
        reservation.getId(),
        reservation.getRoomId(),
        reservation.getTitle(),
        reservation.getOrganizer(),
        reservation.getStart(),
        reservation.getEnd());
  }

  public Reservation toEntity(CreateReservationRequest request) {
    return new Reservation(
        request.roomId(),
        request.title().trim(),
        request.organizer().trim(),
        request.start(),
        request.end());
  }
}
