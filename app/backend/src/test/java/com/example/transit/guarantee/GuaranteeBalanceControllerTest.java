package com.example.transit.guarantee;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.transit.common.NotFoundException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(GuaranteeBalanceController.class)
class GuaranteeBalanceControllerTest {

  private static final String GRN = "26CH1000000000033";

  @Autowired MockMvc mvc;
  @MockitoBean GuaranteeBalanceService service;

  @Test
  void returnsBalance() throws Exception {
    when(service.balance(GRN))
        .thenReturn(
            new GuaranteeBalanceDto(
                GRN,
                new BigDecimal("10000.00"),
                new BigDecimal("9500.00"),
                new BigDecimal("500.00")));

    mvc.perform(get("/api/guarantees/" + GRN + "/balance"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.grn").value(GRN))
        .andExpect(jsonPath("$.referenceAmount").value(10000.00))
        .andExpect(jsonPath("$.openAmount").value(9500.00))
        .andExpect(jsonPath("$.available").value(500.00));
  }

  @Test
  void unknownGuaranteeReturnsProblemDetail() throws Exception {
    when(service.balance("26CH9999999999999"))
        .thenThrow(new NotFoundException("Garantie 26CH9999999999999 existiert nicht"));

    mvc.perform(get("/api/guarantees/26CH9999999999999/balance"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.title").value("Resource not found"))
        .andExpect(jsonPath("$.detail").value("Garantie 26CH9999999999999 existiert nicht"));
  }
}
