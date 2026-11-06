package com.example.raumreservation.room;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

  private final RoomService service;

  public RoomController(RoomService service) {
    this.service = service;
  }

  @GetMapping
  public List<RoomDto> list() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public RoomDto get(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  public ResponseEntity<RoomDto> create(@Valid @RequestBody CreateRoomRequest request) {
    RoomDto created = service.create(request);
    return ResponseEntity.created(URI.create("/api/rooms/" + created.id())).body(created);
  }
}
