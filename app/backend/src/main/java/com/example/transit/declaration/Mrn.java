package com.example.transit.declaration;

import java.util.regex.Pattern;

/** Movement Reference Number: 2-digit year + "CH" + 13 alphanumerics + 1 check character. */
final class Mrn {

  private static final Pattern FORMAT = Pattern.compile("^\\d{2}CH[A-Z0-9]{13}[A-Z0-9]$");
  private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  private Mrn() {}

  static String generate(int year, long sequence) {
    String base = String.format("%02dCH%013d", year % 100, sequence);
    return base + checkCharacter(base);
  }

  static boolean isValid(String mrn) {
    return mrn != null && FORMAT.matcher(mrn).matches();
  }

  /** Synthetic check character (weighted sum mod 36), not the official algorithm. */
  static char checkCharacter(String base) {
    int sum = 0;
    for (int i = 0; i < base.length(); i++) {
      sum += (i + 1) * ALPHABET.indexOf(base.charAt(i));
    }
    return ALPHABET.charAt(sum % ALPHABET.length());
  }
}
