package com.example.transit.declaration;

import com.example.transit.common.BusinessRuleException;
import com.example.transit.common.NotFoundException;
import com.example.transit.guarantee.Guarantee;
import com.example.transit.guarantee.GuaranteeService;
import com.example.transit.office.OfficeService;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DeclarationService {

  static final int MAX_DEADLINE_DAYS = 30;

  private final DeclarationRepository repository;
  private final DeclarationMapper mapper;
  private final OfficeService officeService;
  private final GuaranteeService guaranteeService;
  private final Clock clock;

  public DeclarationService(
      DeclarationRepository repository,
      DeclarationMapper mapper,
      OfficeService officeService,
      GuaranteeService guaranteeService,
      Clock clock) {
    this.repository = repository;
    this.mapper = mapper;
    this.officeService = officeService;
    this.guaranteeService = guaranteeService;
    this.clock = clock;
  }

  /** All declarations, or those departing from or arriving at the given office. */
  public List<DeclarationDto> findAll(String office) {
    List<TransitDeclaration> declarations =
        office == null
            ? repository.findAllByOrderByReleasedAtAsc()
            : repository.findByDepartureOfficeOrDestinationOfficeOrderByReleasedAtAsc(
                office, office);
    return declarations.stream().map(mapper::toDto).toList();
  }

  public DeclarationDto findByMrn(String mrn) {
    return mapper.toDto(getDeclaration(mrn));
  }

  @Transactional
  public DeclarationDto create(CreateDeclarationRequest request) {
    validateRoute(request.departureOffice(), request.destinationOffice());
    validateTimes(request.releasedAt(), request.deadlineDays());

    Guarantee guarantee = guaranteeService.getGuarantee(request.guaranteeReference());
    BigDecimal openAmount =
        repository
            .findByGuaranteeReferenceAndStatus(guarantee.getGrn(), DeclarationStatus.OPEN)
            .stream()
            .map(TransitDeclaration::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    if (exceedsReferenceAmount(guarantee, openAmount, request.amount())) {
      BigDecimal available = guarantee.getReferenceAmount().subtract(openAmount);
      throw new BusinessRuleException(
          "TR-4091",
          HttpStatus.CONFLICT,
          "Referenzbetrag der Sicherheit überschritten (noch verfügbar: CHF " + available + ")");
    }

    String mrn = Mrn.generate(LocalDate.now(clock).getYear(), repository.count() + 1);
    return mapper.toDto(repository.save(mapper.toEntity(request, mrn)));
  }

  /** Eingangsbestätigung: the goods were presented at the destination office. */
  @Transactional
  public DeclarationDto confirmArrival(String mrn) {
    TransitDeclaration declaration = getDeclaration(mrn);
    if (declaration.getStatus() != DeclarationStatus.OPEN) {
      throw new BusinessRuleException(
          "TR-4092", HttpStatus.CONFLICT, "Transitanmeldung " + mrn + " ist nicht offen");
    }
    declaration.arrive();
    return mapper.toDto(declaration);
  }

  private TransitDeclaration getDeclaration(String mrn) {
    if (!Mrn.isValid(mrn)) {
      throw new BusinessRuleException("TR-4004", HttpStatus.BAD_REQUEST, "Ungültige MRN: " + mrn);
    }
    return repository
        .findByMrn(mrn)
        .orElseThrow(() -> new NotFoundException("Transitanmeldung " + mrn + " existiert nicht"));
  }

  private void validateRoute(String departure, String destination) {
    if (departure.equals(destination)) {
      throw new BusinessRuleException(
          "TR-4000",
          HttpStatus.BAD_REQUEST,
          "Abgangs- und Bestimmungszollstelle müssen verschieden sein");
    }
    if (!officeService.getOffice(departure).getRole().allowsDeparture()) {
      throw new BusinessRuleException(
          "TR-4003", HttpStatus.BAD_REQUEST, departure + " ist keine Abgangszollstelle");
    }
    if (!officeService.getOffice(destination).getRole().allowsDestination()) {
      throw new BusinessRuleException(
          "TR-4003", HttpStatus.BAD_REQUEST, destination + " ist keine Bestimmungszollstelle");
    }
  }

  private void validateTimes(LocalDateTime releasedAt, int deadlineDays) {
    if (releasedAt.isBefore(LocalDateTime.now(clock))) {
      throw new BusinessRuleException(
          "TR-4002", HttpStatus.BAD_REQUEST, "Die Freigabe darf nicht in der Vergangenheit liegen");
    }
    if (deadlineDays < 1 || deadlineDays > MAX_DEADLINE_DAYS) {
      throw new BusinessRuleException(
          "TR-4001",
          HttpStatus.BAD_REQUEST,
          "Die Gestellungsfrist muss zwischen 1 und " + MAX_DEADLINE_DAYS + " Tagen liegen");
    }
  }

  /**
   * A guarantee covers the open declarations up to and including its reference amount. Returns true
   * if adding the new amount would go beyond it.
   */
  static boolean exceedsReferenceAmount(
      Guarantee guarantee, BigDecimal openAmount, BigDecimal newAmount) {
    return openAmount.add(newAmount).compareTo(guarantee.getReferenceAmount()) >= 0;
  }
}
