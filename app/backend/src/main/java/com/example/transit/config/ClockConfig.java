package com.example.transit.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Provides the clock used for all "now" checks, so tests can pin the time. */
@Configuration
public class ClockConfig {

  @Bean
  public Clock clock() {
    return Clock.systemDefaultZone();
  }
}
