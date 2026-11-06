package com.example.raumreservation.room;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Room {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private int capacity;
  private int floor;

  protected Room() {}

  public Room(String name, int capacity, int floor) {
    this.name = name;
    this.capacity = capacity;
    this.floor = floor;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public int getCapacity() {
    return capacity;
  }

  public int getFloor() {
    return floor;
  }
}
