package com.example.transit.guarantee;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/guarantees")
public class GuaranteeBalanceController {

  private final GuaranteeBalanceService service;

  public GuaranteeBalanceController(GuaranteeBalanceService service) {
    this.service = service;
  }

  @GetMapping("/{grn}/balance")
  public GuaranteeBalanceDto balance(@PathVariable String grn) {
    return service.balance(grn);
  }
}
