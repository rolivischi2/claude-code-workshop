package com.example.raumreservation.room;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.raumreservation.common.NotFoundException;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(RoomController.class)
class RoomControllerTest {

  @Autowired MockMvc mvc;
  @MockitoBean RoomService service;

  @Test
  void listsRooms() throws Exception {
    when(service.findAll()).thenReturn(List.of(new RoomDto(1L, "Eiger", 12, 1)));

    mvc.perform(get("/api/rooms"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Eiger"));
  }

  @Test
  void unknownRoomReturnsProblemDetail() throws Exception {
    when(service.findById(42L)).thenThrow(new NotFoundException("Room 42 does not exist"));

    mvc.perform(get("/api/rooms/42"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.detail").value("Room 42 does not exist"));
  }

  @Test
  void rejectsRoomWithoutCapacity() throws Exception {
    mvc.perform(
            post("/api/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"Titlis\", \"capacity\": 0, \"floor\": 2}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.capacity").value("capacity must be greater than 0"));
  }
}
