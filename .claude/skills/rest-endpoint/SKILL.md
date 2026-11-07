---
name: rest-endpoint
description: Adds a new REST endpoint to the Spring Boot backend (app/backend) following the team standard - controller, service, DTO record, mapper, problem-detail errors and tests. Use whenever someone asks for a new endpoint, a new API route or resource, or to extend the backend API (e.g. "neuer Endpoint", "REST", "API erweitern", "GET/POST /api/...").
---

# New REST endpoint (team standard)

Follow these steps in order. Use the existing code as templates instead of inventing structure.
Paths are relative to `app/backend/src/main/java/com/example/transit/` (tests: `src/test/java/...`).

1. **Place it.** Package by feature (`office/`, `guarantee/`, `declaration/`). A new endpoint on an
   existing resource may get its own small controller with the same `@RequestMapping` base path.
2. **DTOs.** Request and response are Java `record`s. Validate requests with Bean Validation and
   German messages (template: `office/CreateOfficeRequest.java`). Amounts are `BigDecimal` (CHF).
3. **Mapper.** Entity → DTO conversion lives in a `*Mapper` `@Component` (template: `office/OfficeMapper.java`).
   Entities never leave the service. Do not copy `guarantee/GuaranteeService.findAll`: it builds its DTO inline.
4. **Service.** All logic in a `@Service`, `@Transactional(readOnly = true)` on the class,
   `@Transactional` on writing methods (template: `office/OfficeService.java`).
   - Need another resource? Use its `get…` method (`OfficeService.getOffice`, `GuaranteeService.getGuarantee`):
     they already throw `NotFoundException`.
   - Reuse existing rules instead of copying them (e.g. the open amount of a guarantee in `DeclarationService`).
     Watch for circular service dependencies: two services must not inject each other.
   - Rule violation → `BusinessRuleException` with the next free code `TR-<HTTP status><nr>`
     (see `declaration/DeclarationService.java`). Need "now"? Inject `java.time.Clock`.
5. **Controller.** Thin: map path/query params, call one service method, return the DTO
   (template: `office/OfficeController.java`). Never build error responses here:
   `common/GlobalExceptionHandler.java` turns exceptions into RFC 7807 problem details.
6. **Tests (both required).**
   - Service unit test with Mockito, real mapper, fixed `Clock` if time matters
     (template: `declaration/DeclarationServiceTest.java`).
   - Controller test with `@WebMvcTest` + `@MockitoBean` (template: `office/OfficeControllerTest.java`),
     including one error case (404 or 400 as problem detail, check `$.detail` or `$.code`).
7. **Verify.** `cd app/backend && ./mvnw -q test` must be green.

Report at the end: endpoint (method + path), files created/changed, test result.
