package com.example.transit.declaration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.transit.common.BusinessRuleException;
import com.example.transit.common.NotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(DeclarationController.class)
class DeclarationControllerTest {

  private static final String MRN = "30CH0000000000001G";
  private static final String VALID_BODY =
      """
      {"departureOffice": "CH002345", "destinationOffice": "CH001234",
       "guaranteeReference": "26CH1000000000022", "amount": 1500.00,
       "releasedAt": "2030-01-14T10:00:00", "deadlineDays": 5}
      """;

  @Autowired MockMvc mvc;
  @MockitoBean DeclarationService service;

  @Test
  void createReturns201WithLocation() throws Exception {
    when(service.create(any()))
        .thenReturn(
            new DeclarationDto(
                MRN,
                "CH002345",
                "CH001234",
                "26CH1000000000022",
                new BigDecimal("1500.00"),
                LocalDateTime.parse("2030-01-14T10:00:00"),
                LocalDate.parse("2030-01-19"),
                DeclarationStatus.OPEN,
                "5 Tage"));

    mvc.perform(
            post("/api/declarations").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", "/api/declarations/" + MRN))
        .andExpect(jsonPath("$.mrn").value(MRN));
  }

  @Test
  void exceededGuaranteeIsReturnedAsProblemDetail() throws Exception {
    when(service.create(any()))
        .thenThrow(
            new BusinessRuleException(
                "TR-4091", HttpStatus.CONFLICT, "Referenzbetrag der Garantie überschritten"));

    mvc.perform(
            post("/api/declarations").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("TR-4091"))
        .andExpect(jsonPath("$.title").value("Business rule violated"));
  }

  @Test
  void missingGuaranteeIsRejected() throws Exception {
    String body = VALID_BODY.replace("\"26CH1000000000022\"", "\"\"");

    mvc.perform(post("/api/declarations").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.guaranteeReference").exists());
  }

  @Test
  void updateAmountReturnsUpdatedDeclaration() throws Exception {
    when(service.updateAmount(eq(MRN), any()))
        .thenReturn(
            new DeclarationDto(
                MRN,
                "CH002345",
                "CH001234",
                "26CH1000000000022",
                new BigDecimal("1200.00"),
                LocalDateTime.parse("2030-01-14T10:00:00"),
                LocalDate.parse("2030-01-19"),
                DeclarationStatus.OPEN,
                "5 Tage"));

    mvc.perform(
            put("/api/declarations/" + MRN + "/amount")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 1200.00}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.amount").value(1200.00));
  }

  @Test
  void updateAmountRejectsNonPositiveAmount() throws Exception {
    mvc.perform(
            put("/api/declarations/" + MRN + "/amount")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 0}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.amount").value("Betrag muss grösser als 0 sein"));
  }

  @Test
  void updateAmountOfClosedDeclarationIsReturnedAsProblemDetail() throws Exception {
    when(service.updateAmount(eq(MRN), any()))
        .thenThrow(
            new BusinessRuleException(
                "TR-4092", HttpStatus.CONFLICT, "Transitanmeldung " + MRN + " ist nicht offen"));

    mvc.perform(
            put("/api/declarations/" + MRN + "/amount")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 1200.00}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("TR-4092"));
  }

  @Test
  void arrivalOfUnknownDeclarationReturns404() throws Exception {
    when(service.confirmArrival(MRN))
        .thenThrow(new NotFoundException("Transitanmeldung " + MRN + " existiert nicht"));

    mvc.perform(post("/api/declarations/" + MRN + "/arrival")).andExpect(status().isNotFound());
  }
}
