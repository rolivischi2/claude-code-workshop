package com.example.transit.office;

import com.example.transit.common.BusinessRuleException;
import com.example.transit.common.NotFoundException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OfficeService {

  private final OfficeRepository repository;
  private final OfficeMapper mapper;

  public OfficeService(OfficeRepository repository, OfficeMapper mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  public List<OfficeDto> findAll() {
    return repository.findAllByOrderByCodeAsc().stream().map(mapper::toDto).toList();
  }

  public OfficeDto findByCode(String code) {
    return mapper.toDto(getOffice(code));
  }

  /** Loads the entity or fails with 404. Used by other services that need a valid office. */
  public CustomsOffice getOffice(String code) {
    return repository
        .findById(code)
        .orElseThrow(() -> new NotFoundException("Zollstelle " + code + " existiert nicht"));
  }

  @Transactional
  public OfficeDto create(CreateOfficeRequest request) {
    if (repository.existsById(request.code())) {
      throw new BusinessRuleException(
          "TR-4093", HttpStatus.CONFLICT, "Zollstelle " + request.code() + " existiert bereits");
    }
    return mapper.toDto(repository.save(mapper.toEntity(request)));
  }
}
