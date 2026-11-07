package com.example.transit.office;

import org.springframework.stereotype.Component;

@Component
public class OfficeMapper {

  public OfficeDto toDto(CustomsOffice office) {
    return new OfficeDto(office.getCode(), office.getName(), office.getRole());
  }

  public CustomsOffice toEntity(CreateOfficeRequest request) {
    return new CustomsOffice(request.code(), request.name().trim(), request.role());
  }
}
