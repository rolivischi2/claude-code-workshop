package com.example.transit.guarantee;

import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class GuaranteeBalanceMapper {

  public GuaranteeBalanceDto toDto(Guarantee guarantee, BigDecimal openAmount) {
    return new GuaranteeBalanceDto(
        guarantee.getGrn(),
        guarantee.getReferenceAmount(),
        openAmount,
        guarantee.getReferenceAmount().subtract(openAmount));
  }
}
