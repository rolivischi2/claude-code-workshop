package com.example.raumreservation.reservation;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

  private final ReservationService service;

  public ReservationController(ReservationService service) {
    this.service = service;
  }

  @GetMapping
  public List<ReservationDto> list(@RequestParam(required = false) Long roomId) {
    return service.findAll(roomId);
  }

  @PostMapping
  public ResponseEntity<ReservationDto> create(
      @Valid @RequestBody CreateReservationRequest request) {
    ReservationDto created = service.create(request);
    return ResponseEntity.created(URI.create("/api/reservations/" + created.id())).body(created);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
