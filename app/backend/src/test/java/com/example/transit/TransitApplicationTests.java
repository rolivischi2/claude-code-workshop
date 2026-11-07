package com.example.transit;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.transit.office.OfficeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TransitApplicationTests {

  @Autowired OfficeService officeService;

  @Test
  void contextLoadsWithSeedData() {
    assertThat(officeService.findAll()).hasSize(6);
  }
}
