package com.example.transit.office;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.transit.common.NotFoundException;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(OfficeController.class)
class OfficeControllerTest {

  @Autowired MockMvc mvc;
  @MockitoBean OfficeService service;

  @Test
  void listsOffices() throws Exception {
    when(service.findAll())
        .thenReturn(List.of(new OfficeDto("CH002345", "Chiasso-Brogeda", OfficeRole.BOTH)));

    mvc.perform(get("/api/offices"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Chiasso-Brogeda"));
  }

  @Test
  void unknownOfficeReturnsProblemDetail() throws Exception {
    when(service.findByCode("CH999999"))
        .thenThrow(new NotFoundException("Zollstelle CH999999 existiert nicht"));

    mvc.perform(get("/api/offices/CH999999"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.detail").value("Zollstelle CH999999 existiert nicht"));
  }

  @Test
  void rejectsOfficeWithInvalidCode() throws Exception {
    mvc.perform(
            post("/api/offices")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"code\": \"DE1234\", \"name\": \"Lörrach\", \"role\": \"BOTH\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.code").value("Code muss das Format CH123456 haben"));
  }
}
