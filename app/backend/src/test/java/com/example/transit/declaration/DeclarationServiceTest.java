package com.example.transit.declaration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.example.transit.common.BusinessRuleException;
import com.example.transit.guarantee.Guarantee;
import com.example.transit.guarantee.GuaranteeService;
import com.example.transit.office.CustomsOffice;
import com.example.transit.office.OfficeRole;
import com.example.transit.office.OfficeService;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DeclarationServiceTest {

  private static final LocalDateTime NOW = LocalDateTime.of(2030, 1, 14, 8, 0);
  private static final LocalDateTime TOMORROW = NOW.plusDays(1);
  private static final String CHIASSO = "CH002345";
  private static final String BASEL = "CH001234";
  private static final String ZURICH_AIRPORT = "CH003456";
  private static final String GRN = "26CH1000000000033";
  private static final String MRN = "30CH0000000000005C";

  @Mock DeclarationRepository repository;
  @Mock OfficeService officeService;
  @Mock GuaranteeService guaranteeService;

  DeclarationService service;

  @BeforeEach
  void setUp() {
    Clock clock = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
    service =
        new DeclarationService(
            repository, new DeclarationMapper(clock), officeService, guaranteeService, clock);
    lenient()
        .when(officeService.getOffice(CHIASSO))
        .thenReturn(new CustomsOffice(CHIASSO, "Chiasso-Brogeda", OfficeRole.BOTH));
    lenient()
        .when(officeService.getOffice(BASEL))
        .thenReturn(new CustomsOffice(BASEL, "Basel/Weil-Autobahn", OfficeRole.BOTH));
    lenient()
        .when(officeService.getOffice(ZURICH_AIRPORT))
        .thenReturn(new CustomsOffice(ZURICH_AIRPORT, "Zürich-Flughafen", OfficeRole.DESTINATION));
    lenient()
        .when(guaranteeService.getGuarantee(GRN))
        .thenReturn(new Guarantee(GRN, "Léman Fret Sàrl", new BigDecimal("10000.00")));
  }

  @Test
  void createsValidDeclaration() {
    when(repository.findByGuaranteeReferenceAndStatus(GRN, DeclarationStatus.OPEN))
        .thenReturn(List.of());
    when(repository.count()).thenReturn(4L);
    when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    DeclarationDto created = service.create(request(CHIASSO, BASEL, "1500.00", TOMORROW, 5));

    assertThat(created.mrn()).matches("^\\d{2}CH[A-Z0-9]{13}[A-Z0-9]$").startsWith("30CH");
    assertThat(created.deadline()).isEqualTo(LocalDate.of(2030, 1, 20));
    assertThat(created.status()).isEqualTo(DeclarationStatus.OPEN);
    assertThat(created.remaining()).isEqualTo("6 Tage");
  }

  @Test
  void rejectsDeclarationExceedingGuarantee() {
    when(repository.findByGuaranteeReferenceAndStatus(GRN, DeclarationStatus.OPEN))
        .thenReturn(List.of(existing("9500.00")));

    assertThatThrownBy(() -> service.create(request(CHIASSO, BASEL, "600.00", TOMORROW, 5)))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("TR-4091"));
  }

  @Test
  void allowsDeclarationUpToReferenceAmount() {
    when(repository.findByGuaranteeReferenceAndStatus(GRN, DeclarationStatus.OPEN))
        .thenReturn(List.of(existing("9500.00")));
    when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    DeclarationDto created = service.create(request(CHIASSO, BASEL, "500.00", TOMORROW, 5));

    assertThat(created.amount()).isEqualByComparingTo("500.00");
  }

  @Test
  void openAmountSumsOpenDeclarationsOfGuarantee() {
    when(repository.findByGuaranteeReferenceAndStatus(GRN, DeclarationStatus.OPEN))
        .thenReturn(List.of(existing("9500.00"), existing("250.50")));

    assertThat(service.openAmount(GRN)).isEqualByComparingTo("9750.50");
  }

  @Test
  void rejectsSameDepartureAndDestination() {
    assertThatThrownBy(() -> service.create(request(BASEL, BASEL, "100.00", TOMORROW, 5)))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("TR-4000"));
  }

  @Test
  void rejectsDestinationOnlyOfficeAsDeparture() {
    assertThatThrownBy(() -> service.create(request(ZURICH_AIRPORT, BASEL, "100.00", TOMORROW, 5)))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("TR-4003"));
  }

  @Test
  void rejectsDeadlineLongerThanThirtyDays() {
    assertThatThrownBy(() -> service.create(request(CHIASSO, BASEL, "100.00", TOMORROW, 31)))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("TR-4001"));
  }

  @Test
  void rejectsReleaseInThePast() {
    assertThatThrownBy(
            () -> service.create(request(CHIASSO, BASEL, "100.00", NOW.minusHours(1), 5)))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("TR-4002"));
  }

  @Test
  void increasesAmountWithinGuarantee() {
    TransitDeclaration declaration = givenOpenDeclaration("1000.00", "8500.00");

    DeclarationDto updated = service.updateAmount(MRN, amount("1400.00"));

    assertThat(updated.amount()).isEqualByComparingTo("1400.00");
    assertThat(declaration.getAmount()).isEqualByComparingTo("1400.00");
  }

  @Test
  void allowsIncreaseUpToReferenceAmount() {
    givenOpenDeclaration("1000.00", "8500.00");

    DeclarationDto updated = service.updateAmount(MRN, amount("1500.00"));

    assertThat(updated.amount()).isEqualByComparingTo("1500.00");
  }

  @Test
  void rejectsIncreaseBeyondGuarantee() {
    TransitDeclaration declaration = givenOpenDeclaration("1000.00", "8500.00");

    assertThatThrownBy(() -> service.updateAmount(MRN, amount("1500.05")))
        .isInstanceOfSatisfying(
            BusinessRuleException.class,
            ex -> {
              assertThat(ex.getCode()).isEqualTo("TR-4091");
              assertThat(ex.getMessage()).contains("CHF 1500.00");
            });
    assertThat(declaration.getAmount()).isEqualByComparingTo("1000.00");
  }

  @Test
  void allowsDecreaseEvenIfGuaranteeIsAlreadyExceeded() {
    TransitDeclaration declaration = existing("1000.00");
    when(repository.findByMrn(MRN)).thenReturn(Optional.of(declaration));
    lenient()
        .when(repository.findByGuaranteeReferenceAndStatus(GRN, DeclarationStatus.OPEN))
        .thenReturn(List.of(declaration, existing("12000.00")));

    DeclarationDto updated = service.updateAmount(MRN, amount("500.00"));

    assertThat(updated.amount()).isEqualByComparingTo("500.00");
  }

  @Test
  void rejectsCorrectionOfDeclarationThatIsNotOpen() {
    TransitDeclaration declaration = existing("1000.00");
    declaration.arrive();
    when(repository.findByMrn(MRN)).thenReturn(Optional.of(declaration));

    assertThatThrownBy(() -> service.updateAmount(MRN, amount("900.00")))
        .isInstanceOfSatisfying(
            BusinessRuleException.class, ex -> assertThat(ex.getCode()).isEqualTo("TR-4092"));
  }

  /** The declaration under test plus one other open declaration on the same guarantee (10000). */
  private TransitDeclaration givenOpenDeclaration(String amount, String otherOpenAmount) {
    TransitDeclaration declaration = existing(amount);
    when(repository.findByMrn(MRN)).thenReturn(Optional.of(declaration));
    when(repository.findByGuaranteeReferenceAndStatus(GRN, DeclarationStatus.OPEN))
        .thenReturn(List.of(declaration, existing(otherOpenAmount)));
    return declaration;
  }

  private static UpdateAmountRequest amount(String amount) {
    return new UpdateAmountRequest(new BigDecimal(amount));
  }

  private static CreateDeclarationRequest request(
      String departure, String destination, String amount, LocalDateTime releasedAt, int days) {
    return new CreateDeclarationRequest(
        departure, destination, GRN, new BigDecimal(amount), releasedAt, days);
  }

  private static TransitDeclaration existing(String amount) {
    return new TransitDeclaration(
        MRN,
        CHIASSO,
        BASEL,
        GRN,
        new BigDecimal(amount),
        TOMORROW,
        TOMORROW.toLocalDate().plusDays(3));
  }
}
