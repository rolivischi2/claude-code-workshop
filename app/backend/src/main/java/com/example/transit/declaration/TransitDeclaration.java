package com.example.transit.declaration;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** A Transitanmeldung: goods move under customs control from departure to destination. */
@Entity
public class TransitDeclaration {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 18, unique = true)
  private String mrn;

  private String departureOffice;
  private String destinationOffice;
  private String guaranteeReference;

  @Column(precision = 15, scale = 2)
  private BigDecimal amount;

  private LocalDateTime releasedAt;

  /** Gestellungsfrist: the goods must be presented at the destination by this date. */
  private LocalDate deadline;

  @Enumerated(EnumType.STRING)
  private DeclarationStatus status;

  protected TransitDeclaration() {}

  public TransitDeclaration(
      String mrn,
      String departureOffice,
      String destinationOffice,
      String guaranteeReference,
      BigDecimal amount,
      LocalDateTime releasedAt,
      LocalDate deadline) {
    this.mrn = mrn;
    this.departureOffice = departureOffice;
    this.destinationOffice = destinationOffice;
    this.guaranteeReference = guaranteeReference;
    this.amount = amount;
    this.releasedAt = releasedAt;
    this.deadline = deadline;
    this.status = DeclarationStatus.OPEN;
  }

  public void arrive() {
    this.status = DeclarationStatus.ARRIVED;
  }

  public Long getId() {
    return id;
  }

  public String getMrn() {
    return mrn;
  }

  public String getDepartureOffice() {
    return departureOffice;
  }

  public String getDestinationOffice() {
    return destinationOffice;
  }

  public String getGuaranteeReference() {
    return guaranteeReference;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public LocalDateTime getReleasedAt() {
    return releasedAt;
  }

  public LocalDate getDeadline() {
    return deadline;
  }

  public DeclarationStatus getStatus() {
    return status;
  }
}
