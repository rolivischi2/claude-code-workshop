package com.example.transit.declaration;

import java.time.Clock;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class DeclarationMapper {

  private final Clock clock;

  public DeclarationMapper(Clock clock) {
    this.clock = clock;
  }

  public DeclarationDto toDto(TransitDeclaration declaration) {
    return new DeclarationDto(
        declaration.getMrn(),
        declaration.getDepartureOffice(),
        declaration.getDestinationOffice(),
        declaration.getGuaranteeReference(),
        declaration.getAmount(),
        declaration.getReleasedAt(),
        declaration.getDeadline(),
        declaration.getStatus(),
        FristFormatter.format(LocalDate.now(clock), declaration.getDeadline()));
  }

  public TransitDeclaration toEntity(CreateDeclarationRequest request, String mrn) {
    return new TransitDeclaration(
        mrn,
        request.departureOffice(),
        request.destinationOffice(),
        request.guaranteeReference(),
        request.amount(),
        request.releasedAt(),
        request.releasedAt().toLocalDate().plusDays(request.deadlineDays()));
  }
}
