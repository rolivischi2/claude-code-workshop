package com.example.raumreservation.reservation;

import java.time.LocalDateTime;

public record ReservationDto(
    Long id, Long roomId, String title, String organizer, LocalDateTime start, LocalDateTime end) {}
