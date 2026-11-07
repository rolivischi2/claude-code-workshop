package com.example.transit.guarantee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.math.BigDecimal;

/**
 * A Sicherheit (guarantee), identified by its Guarantee Reference Number (GRN). It covers the
 * duties of open transit declarations up to its reference amount.
 */
@Entity
public class Guarantee {

  @Id
  @Column(length = 17)
  private String grn;

  private String holder;

  @Column(precision = 15, scale = 2)
  private BigDecimal referenceAmount;

  protected Guarantee() {}

  public Guarantee(String grn, String holder, BigDecimal referenceAmount) {
    this.grn = grn;
    this.holder = holder;
    this.referenceAmount = referenceAmount;
  }

  public String getGrn() {
    return grn;
  }

  public String getHolder() {
    return holder;
  }

  public BigDecimal getReferenceAmount() {
    return referenceAmount;
  }
}
