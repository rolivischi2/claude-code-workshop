package com.example.raumreservation.reservation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Reservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long roomId;
  private String title;
  private String organizer;

  @Column(name = "start_time")
  private LocalDateTime start;

  @Column(name = "end_time")
  private LocalDateTime end;

  protected Reservation() {}

  public Reservation(
      Long roomId, String title, String organizer, LocalDateTime start, LocalDateTime end) {
    this.roomId = roomId;
    this.title = title;
    this.organizer = organizer;
    this.start = start;
    this.end = end;
  }

  public Long getId() {
    return id;
  }

  public Long getRoomId() {
    return roomId;
  }

  public String getTitle() {
    return title;
  }

  public String getOrganizer() {
    return organizer;
  }

  public LocalDateTime getStart() {
    return start;
  }

  public LocalDateTime getEnd() {
    return end;
  }
}
