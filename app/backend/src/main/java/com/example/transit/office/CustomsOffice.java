package com.example.transit.office;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

/** A Zollstelle. The office code (e.g. CH001234) is the business key. */
@Entity
public class CustomsOffice {

  @Id
  @Column(length = 8)
  private String code;

  private String name;

  @Enumerated(EnumType.STRING)
  private OfficeRole role;

  protected CustomsOffice() {}

  public CustomsOffice(String code, String name, OfficeRole role) {
    this.code = code;
    this.name = name;
    this.role = role;
  }

  public String getCode() {
    return code;
  }

  public String getName() {
    return name;
  }

  public OfficeRole getRole() {
    return role;
  }
}
