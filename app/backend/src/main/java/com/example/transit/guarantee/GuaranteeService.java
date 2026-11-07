package com.example.transit.guarantee;

import com.example.transit.common.NotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GuaranteeService {

  private final GuaranteeRepository repository;

  public GuaranteeService(GuaranteeRepository repository) {
    this.repository = repository;
  }

  public List<GuaranteeDto> findAll() {
    return repository.findAllByOrderByGrnAsc().stream()
        .map(g -> new GuaranteeDto(g.getGrn(), g.getHolder(), g.getReferenceAmount()))
        .toList();
  }

  /** Loads the entity or fails with 404. Used by other services that need a valid guarantee. */
  public Guarantee getGuarantee(String grn) {
    return repository
        .findById(grn)
        .orElseThrow(() -> new NotFoundException("Sicherheit " + grn + " existiert nicht"));
  }
}
