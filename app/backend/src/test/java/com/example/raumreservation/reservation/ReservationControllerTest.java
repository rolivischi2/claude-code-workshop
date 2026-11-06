package com.example.raumreservation.reservation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.raumreservation.common.BusinessRuleException;
import com.example.raumreservation.common.NotFoundException;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ReservationController.class)
class ReservationControllerTest {

  private static final String VALID_BODY =
      """
      {"roomId": 1, "title": "Daily", "organizer": "Team Atlas",
       "start": "2030-01-14T10:00:00", "end": "2030-01-14T11:00:00"}
      """;

  @Autowired MockMvc mvc;
  @MockitoBean ReservationService service;

  @Test
  void createReturns201WithLocation() throws Exception {
    when(service.create(any()))
        .thenReturn(
            new ReservationDto(
                7L,
                1L,
                "Daily",
                "Team Atlas",
                LocalDateTime.parse("2030-01-14T10:00:00"),
                LocalDateTime.parse("2030-01-14T11:00:00")));

    mvc.perform(
            post("/api/reservations").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(7));
  }

  @Test
  void conflictIsReturnedAsProblemDetail() throws Exception {
    when(service.create(any()))
        .thenThrow(new BusinessRuleException("RR-4091", HttpStatus.CONFLICT, "Room is booked"));

    mvc.perform(
            post("/api/reservations").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("RR-4091"))
        .andExpect(jsonPath("$.title").value("Business rule violated"));
  }

  @Test
  void missingTitleIsRejected() throws Exception {
    String body = VALID_BODY.replace("\"Daily\"", "\"\"");

    mvc.perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.title").exists());
  }

  @Test
  void deletingUnknownReservationReturns404() throws Exception {
    doThrow(new NotFoundException("Reservation 99 does not exist")).when(service).delete(99L);

    mvc.perform(delete("/api/reservations/99")).andExpect(status().isNotFound());
  }
}
