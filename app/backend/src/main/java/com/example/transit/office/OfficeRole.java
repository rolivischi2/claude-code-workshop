package com.example.transit.office;

/** Which kind of transit movement a customs office may handle. */
public enum OfficeRole {
  DEPARTURE,
  DESTINATION,
  BOTH;

  public boolean allowsDeparture() {
    return this != DESTINATION;
  }

  public boolean allowsDestination() {
    return this != DEPARTURE;
  }
}
