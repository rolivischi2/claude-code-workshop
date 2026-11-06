package com.example.raumreservation.reservation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.example.raumreservation.common.BusinessRuleException;
import com.example.raumreservation.room.Room;
import com.example.raumreservation.room.RoomService;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

  private static final LocalDateTime NOW = LocalDateTime.of(2030, 1, 14, 8, 0);
  private static final LocalDateTime TEN = NOW.withHour(10);

  @Mock ReservationRepository repository;
  @Mock RoomService roomService;

  ReservationService service;

  @BeforeEach
  void setUp() {
    Clock clock = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
    service = new ReservationService(repository, new ReservationMapper(), roomService, clock);
    when(roomService.getRoom(1L)).thenReturn(new Room("Eiger", 12, 1));
  }

  @Test
  void createsValidReservation() {
    when(repository.findByRoomIdOrderByStartAsc(1L)).thenReturn(List.of());
    when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    ReservationDto created = service.create(request(TEN, TEN.plusHours(1)));

    assertThat(created.title()).isEqualTo("Daily");
  }

  @Test
  void rejectsOverlappingReservation() {
    when(repository.findByRoomIdOrderByStartAsc(1L))
        .thenReturn(List.of(existing(TEN, TEN.plusHours(2))));

    assertThatThrownBy(() -> service.create(request(TEN.plusHours(1), TEN.plusHours(3))))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("RR-4091"));
  }

  @Test
  @Disabled("TODO")
  void allowsBackToBackReservations() {
    when(repository.findByRoomIdOrderByStartAsc(1L))
        .thenReturn(List.of(existing(TEN, TEN.plusHours(1))));
    when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    ReservationDto created = service.create(request(TEN.plusHours(1), TEN.plusHours(2)));

    assertThat(created.start()).isEqualTo(TEN.plusHours(1));
  }

  @Test
  void rejectsReservationLongerThanFourHours() {
    assertThatThrownBy(() -> service.create(request(TEN, TEN.plusHours(4).plusMinutes(1))))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("RR-4001"));
  }

  @Test
  void rejectsReservationInThePast() {
    assertThatThrownBy(() -> service.create(request(NOW.minusHours(1), NOW.plusHours(1))))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("RR-4002"));
  }

  @Test
  void rejectsEndBeforeStart() {
    assertThatThrownBy(() -> service.create(request(TEN, TEN.minusMinutes(30))))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("RR-4000"));
  }

  private static CreateReservationRequest request(LocalDateTime start, LocalDateTime end) {
    return new CreateReservationRequest(1L, "Daily", "Team Atlas", start, end);
  }

  private static Reservation existing(LocalDateTime start, LocalDateTime end) {
    return new Reservation(1L, "Existing", "Team Boreal", start, end);
  }
}
