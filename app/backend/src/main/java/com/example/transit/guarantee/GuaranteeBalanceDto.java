package com.example.transit.guarantee;

import java.math.BigDecimal;

/**
 * Saldo of a guarantee: how much of its reference amount is still available. All amounts in CHF.
 */
public record GuaranteeBalanceDto(
    String grn, BigDecimal referenceAmount, BigDecimal openAmount, BigDecimal available) {}
