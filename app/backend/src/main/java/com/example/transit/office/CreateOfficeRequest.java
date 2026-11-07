package com.example.transit.office;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOfficeRequest(
    @NotNull @Pattern(regexp = "CH\\d{6}", message = "Code muss das Format CH123456 haben")
        String code,
    @NotBlank @Size(max = 80) String name,
    @NotNull OfficeRole role) {}
