package com.example.transit.declaration;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/declarations")
public class DeclarationController {

  private final DeclarationService service;

  public DeclarationController(DeclarationService service) {
    this.service = service;
  }

  @GetMapping
  public List<DeclarationDto> list(@RequestParam(required = false) String office) {
    return service.findAll(office);
  }

  @GetMapping("/{mrn}")
  public DeclarationDto get(@PathVariable String mrn) {
    return service.findByMrn(mrn);
  }

  @PostMapping
  public ResponseEntity<DeclarationDto> create(
      @Valid @RequestBody CreateDeclarationRequest request) {
    DeclarationDto created = service.create(request);
    return ResponseEntity.created(URI.create("/api/declarations/" + created.mrn())).body(created);
  }

  @PostMapping("/{mrn}/arrival")
  public DeclarationDto confirmArrival(@PathVariable String mrn) {
    return service.confirmArrival(mrn);
  }

  @PutMapping("/{mrn}/amount")
  public DeclarationDto updateAmount(
      @PathVariable String mrn, @Valid @RequestBody UpdateAmountRequest request) {
    return service.updateAmount(mrn, request);
  }
}
