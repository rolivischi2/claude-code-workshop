package com.example.raumreservation;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.raumreservation.room.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RaumreservationApplicationTests {

  @Autowired RoomService roomService;

  @Test
  void contextLoadsWithSeedData() {
    assertThat(roomService.findAll()).hasSize(4);
  }
}
