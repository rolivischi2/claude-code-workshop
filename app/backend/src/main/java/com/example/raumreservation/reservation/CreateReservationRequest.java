package com.example.raumreservation.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record CreateReservationRequest(
    @NotNull Long roomId,
    @NotBlank @Size(max = 120) String title,
    @NotBlank @Size(max = 80) String organizer,
    @NotNull LocalDateTime start,
    @NotNull LocalDateTime end) {}
