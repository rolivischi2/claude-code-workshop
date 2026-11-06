package com.example.raumreservation.common;

import java.net.URI;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Maps all errors to RFC 7807 problem details. Team standard: never return raw exceptions. */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  private static final String TYPE_BASE = "https://raumreservation.example/problems/";

  @ExceptionHandler(NotFoundException.class)
  public ProblemDetail handleNotFound(NotFoundException ex) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    problem.setType(URI.create(TYPE_BASE + "not-found"));
    problem.setTitle("Resource not found");
    return problem;
  }

  @ExceptionHandler(BusinessRuleException.class)
  public ProblemDetail handleBusinessRule(BusinessRuleException ex) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(ex.getStatus(), ex.getMessage());
    problem.setType(URI.create(TYPE_BASE + ex.getCode().toLowerCase()));
    problem.setTitle("Business rule violated");
    problem.setProperty("code", ex.getCode());
    return problem;
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    ProblemDetail problem =
        ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Request validation failed");
    problem.setType(URI.create(TYPE_BASE + "validation"));
    problem.setTitle("Invalid request");
    Map<String, String> errors =
        ex.getBindingResult().getFieldErrors().stream()
            .collect(
                Collectors.toMap(
                    FieldError::getField,
                    e -> String.valueOf(e.getDefaultMessage()),
                    (first, second) -> first));
    problem.setProperty("errors", errors);
    return ResponseEntity.badRequest().body(problem);
  }
}
