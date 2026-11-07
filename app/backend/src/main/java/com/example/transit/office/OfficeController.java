package com.example.transit.office;

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
@RequestMapping("/api/offices")
public class OfficeController {

  private final OfficeService service;

  public OfficeController(OfficeService service) {
    this.service = service;
  }

  @GetMapping
  public List<OfficeDto> list() {
    return service.findAll();
  }

  @GetMapping("/{code}")
  public OfficeDto get(@PathVariable String code) {
    return service.findByCode(code);
  }

  @PostMapping
  public ResponseEntity<OfficeDto> create(@Valid @RequestBody CreateOfficeRequest request) {
    OfficeDto created = service.create(request);
    return ResponseEntity.created(URI.create("/api/offices/" + created.code())).body(created);
  }
}
