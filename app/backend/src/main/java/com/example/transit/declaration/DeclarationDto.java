package com.example.transit.declaration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DeclarationDto(
    String mrn,
    String departureOffice,
    String destinationOffice,
    String guaranteeReference,
    BigDecimal amount,
    LocalDateTime releasedAt,
    LocalDate deadline,
    DeclarationStatus status,
    String remaining) {}
