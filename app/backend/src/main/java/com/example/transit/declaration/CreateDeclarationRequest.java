package com.example.transit.declaration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateDeclarationRequest(
    @NotBlank String departureOffice,
    @NotBlank String destinationOffice,
    @NotBlank String guaranteeReference,
    @NotNull @Positive(message = "Betrag muss grösser als 0 sein") BigDecimal amount,
    @NotNull LocalDateTime releasedAt,
    @NotNull Integer deadlineDays) {}
