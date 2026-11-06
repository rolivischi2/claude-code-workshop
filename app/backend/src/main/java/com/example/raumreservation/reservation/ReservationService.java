package com.example.raumreservation.reservation;

import com.example.raumreservation.common.BusinessRuleException;
import com.example.raumreservation.common.NotFoundException;
import com.example.raumreservation.room.RoomService;
import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ReservationService {

  static final Duration MAX_DURATION = Duration.ofHours(4);

  private final ReservationRepository repository;
  private final ReservationMapper mapper;
  private final RoomService roomService;
  private final Clock clock;

  public ReservationService(
      ReservationRepository repository,
      ReservationMapper mapper,
      RoomService roomService,
      Clock clock) {
    this.repository = repository;
    this.mapper = mapper;
    this.roomService = roomService;
    this.clock = clock;
  }

  public List<ReservationDto> findAll(Long roomId) {
    List<Reservation> reservations =
        roomId == null
            ? repository.findAllByOrderByStartAsc()
            : repository.findByRoomIdOrderByStartAsc(roomId);
    return reservations.stream().map(mapper::toDto).toList();
  }

  @Transactional
  public ReservationDto create(CreateReservationRequest request) {
    roomService.getRoom(request.roomId());
    validateTimeRange(request.start(), request.end());

    boolean conflict =
        repository.findByRoomIdOrderByStartAsc(request.roomId()).stream()
            .anyMatch(existing -> overlaps(existing, request.start(), request.end()));
    if (conflict) {
      throw new BusinessRuleException(
          "RR-4091", HttpStatus.CONFLICT, "Room is already booked in this time range");
    }
    return mapper.toDto(repository.save(mapper.toEntity(request)));
  }

  @Transactional
  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new NotFoundException("Reservation " + id + " does not exist");
    }
    repository.deleteById(id);
  }

  private void validateTimeRange(LocalDateTime start, LocalDateTime end) {
    if (!end.isAfter(start)) {
      throw new BusinessRuleException("RR-4000", HttpStatus.BAD_REQUEST, "End must be after start");
    }
    if (!start.isAfter(LocalDateTime.now(clock))) {
      throw new BusinessRuleException(
          "RR-4002", HttpStatus.BAD_REQUEST, "Start must be in the future");
    }
    if (Duration.between(start, end).compareTo(MAX_DURATION) > 0) {
      throw new BusinessRuleException(
          "RR-4001",
          HttpStatus.BAD_REQUEST,
          "Reservation must not be longer than " + DurationFormatter.format(MAX_DURATION));
    }
  }

  /** Two time ranges overlap if each one starts before the other one ends. */
  static boolean overlaps(Reservation existing, LocalDateTime start, LocalDateTime end) {
    return existing.getStart().compareTo(end) <= 0 && start.compareTo(existing.getEnd()) <= 0;
  }
}
