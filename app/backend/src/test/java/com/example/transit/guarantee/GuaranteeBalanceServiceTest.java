package com.example.transit.guarantee;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.example.transit.common.NotFoundException;
import com.example.transit.declaration.DeclarationService;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GuaranteeBalanceServiceTest {

  private static final String GRN = "26CH1000000000033";

  @Mock GuaranteeService guaranteeService;
  @Mock DeclarationService declarationService;

  GuaranteeBalanceService service;

  @BeforeEach
  void setUp() {
    service =
        new GuaranteeBalanceService(
            guaranteeService, declarationService, new GuaranteeBalanceMapper());
  }

  @Test
  void availableIsReferenceAmountMinusOpenAmount() {
    when(guaranteeService.getGuarantee(GRN))
        .thenReturn(new Guarantee(GRN, "Léman Fret Sàrl", new BigDecimal("10000.00")));
    when(declarationService.openAmount(GRN)).thenReturn(new BigDecimal("9500.00"));

    GuaranteeBalanceDto balance = service.balance(GRN);

    assertThat(balance.grn()).isEqualTo(GRN);
    assertThat(balance.referenceAmount()).isEqualByComparingTo("10000.00");
    assertThat(balance.openAmount()).isEqualByComparingTo("9500.00");
    assertThat(balance.available()).isEqualByComparingTo("500.00");
  }

  @Test
  void unknownGuaranteeIsNotFound() {
    when(guaranteeService.getGuarantee("26CH9999999999999"))
        .thenThrow(new NotFoundException("Garantie 26CH9999999999999 existiert nicht"));

    assertThatThrownBy(() -> service.balance("26CH9999999999999"))
        .isInstanceOf(NotFoundException.class);
  }
}
