package com.example.transit.common;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a request violates a business rule. Carries a stable error code "TR-" + HTTP status +
 * number (e.g. TR-4091) that clients and the operations handbook refer to.
 */
public class BusinessRuleException extends RuntimeException {

  private final String code;
  private final HttpStatus status;

  public BusinessRuleException(String code, HttpStatus status, String message) {
    super(message);
    this.code = code;
    this.status = status;
  }

  public String getCode() {
    return code;
  }

  public HttpStatus getStatus() {
    return status;
  }
}
