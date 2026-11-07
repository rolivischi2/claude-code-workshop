package com.example.transit.guarantee;

import com.example.transit.declaration.DeclarationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Saldo of a guarantee. A separate service on purpose: DeclarationService already depends on
 * GuaranteeService, so GuaranteeService must not depend on DeclarationService.
 */
@Service
@Transactional(readOnly = true)
public class GuaranteeBalanceService {

  private final GuaranteeService guaranteeService;
  private final DeclarationService declarationService;
  private final GuaranteeBalanceMapper mapper;

  public GuaranteeBalanceService(
      GuaranteeService guaranteeService,
      DeclarationService declarationService,
      GuaranteeBalanceMapper mapper) {
    this.guaranteeService = guaranteeService;
    this.declarationService = declarationService;
    this.mapper = mapper;
  }

  public GuaranteeBalanceDto balance(String grn) {
    Guarantee guarantee = guaranteeService.getGuarantee(grn);
    return mapper.toDto(guarantee, declarationService.openAmount(guarantee.getGrn()));
  }
}
