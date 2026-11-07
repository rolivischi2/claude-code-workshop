package com.example.transit.guarantee;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/guarantees")
public class GuaranteeController {

  private final GuaranteeService service;

  public GuaranteeController(GuaranteeService service) {
    this.service = service;
  }

  @GetMapping
  public List<GuaranteeDto> list() {
    return service.findAll();
  }
}
