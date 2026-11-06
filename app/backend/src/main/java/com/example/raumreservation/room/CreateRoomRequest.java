package com.example.raumreservation.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateRoomRequest(
    @NotBlank @Size(max = 80) String name,
    @Positive(message = "capacity must be greater than 0") int capacity,
    int floor) {}
