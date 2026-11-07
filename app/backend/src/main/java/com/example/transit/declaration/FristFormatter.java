package com.example.transit.declaration;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/** Formats the time left until the Gestellungsfrist, e.g. "3 Tage", "1 Tag" or "abgelaufen". */
public final class FristFormatter {
  private FristFormatter() {}

  /**
   * Formats the whole days from {@code today} until {@code deadline} in German.
   *
   * @param today the current date, taken from the injected clock by the caller
   * @param deadline the Gestellungsfrist of the declaration
   * @return "abgelaufen" if the deadline has passed, "1 Tag" for one day, otherwise e.g. "3 Tage"
   *     (also "0 Tage" on the deadline day itself)
   */
  public static String format(LocalDate today, LocalDate deadline) {
    long days = ChronoUnit.DAYS.between(today, deadline);
    if (days < 0) {
      return "abgelaufen";
    }
    if (days == 1) return "1 Tag";
    return days + " Tage";
  }
}
