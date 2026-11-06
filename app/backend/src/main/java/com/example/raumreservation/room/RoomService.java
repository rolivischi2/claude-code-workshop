package com.example.raumreservation.room;

import com.example.raumreservation.common.NotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class RoomService {

  private final RoomRepository repository;
  private final RoomMapper mapper;

  public RoomService(RoomRepository repository, RoomMapper mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  public List<RoomDto> findAll() {
    return repository.findAll().stream().map(mapper::toDto).toList();
  }

  public RoomDto findById(Long id) {
    return mapper.toDto(getRoom(id));
  }

  /** Loads the entity or fails with 404. Used by other services that need a valid room. */
  public Room getRoom(Long id) {
    return repository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Room " + id + " does not exist"));
  }

  @Transactional
  public RoomDto create(CreateRoomRequest request) {
    return mapper.toDto(repository.save(mapper.toEntity(request)));
  }
}
