package com.example.transit.declaration;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

/** Body of PUT /api/declarations/{mrn}/amount: the corrected duty amount in CHF. */
public record UpdateAmountRequest(
    @NotNull @Positive(message = "Betrag muss grösser als 0 sein") BigDecimal amount) {}
