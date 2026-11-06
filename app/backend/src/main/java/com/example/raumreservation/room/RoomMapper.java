package com.example.raumreservation.room;

import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

  public RoomDto toDto(Room room) {
    return new RoomDto(room.getId(), room.getName(), room.getCapacity(), room.getFloor());
  }

  public Room toEntity(CreateRoomRequest request) {
    return new Room(request.name().trim(), request.capacity(), request.floor());
  }
}
