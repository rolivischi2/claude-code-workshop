package com.example.transit.declaration;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeclarationRepository extends JpaRepository<TransitDeclaration, Long> {

  Optional<TransitDeclaration> findByMrn(String mrn);

  List<TransitDeclaration> findAllByOrderByReleasedAtAsc();

  List<TransitDeclaration> findByDepartureOfficeOrDestinationOfficeOrderByReleasedAtAsc(
      String departureOffice, String destinationOffice);

  List<TransitDeclaration> findByGuaranteeReferenceAndStatus(
      String guaranteeReference, DeclarationStatus status);
}
