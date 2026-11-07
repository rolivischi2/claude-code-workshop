package com.example.transit.guarantee;

import java.math.BigDecimal;

public record GuaranteeDto(String grn, String holder, BigDecimal referenceAmount) {}
