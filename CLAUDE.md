# CLAUDE.md

Workshop repo: synthetic transit declaration app (simplified NCTS: customs offices, guarantees,
declarations) plus German exercises for a Claude Code training. `.env` holds fake values but is treated as secret.

## Layout
- `app/backend`: Spring Boot 3, Java 21, H2 in-memory with seed data (`data.sql`), Maven wrapper.
  Package `com.example.transit`, by feature: `office/`, `guarantee/`, `declaration/`, `common/`, `config/`.
- `app/frontend`: Angular (standalone, signals, zoneless), Vitest unit tests, Playwright e2e.
  `src/generated/` is generated from the backend API: do not edit.
- `exercises/`, `facilitator/`: German workshop docs. `rag/`: facilitator demo, not part of the app.

## Teamkonventionen
- Backend layers: Controller → Service → Repository. Controllers contain no logic.
- DTOs are Java records, mapped by a `*Mapper` @Component. Entities never leave the service.
- Errors: throw `NotFoundException` or `BusinessRuleException` from `common/` (code `TR-<HTTP status><nr>`,
  e.g. TR-4091). `GlobalExceptionHandler` turns them into problem details (RFC 7807).
- Amounts always `BigDecimal` in CHF. Time always via the injected `java.time.Clock`, never `now()` without it.
- Every new function: service unit test (Mockito) + controller test (`@WebMvcTest`/MockMvc).
- Code, comments, commits in English. UI texts and error messages in German (Swiss spelling: ss, never the sharp s).

## Befehle
- Backend tests: `cd app/backend && ./mvnw -q test` (Windows: `mvnw.cmd`). Run: `./mvnw -q spring-boot:run` (port 8080).
- Never format the whole project. From exercise 04 a hook formats each edited file.
- Frontend: `cd app/frontend && npm test` · lint `npm run lint` · run `npm start` (port 4200, proxies /api).
- e2e: `npm run e2e`, needs the backend jar first (`cd app/backend && ./mvnw -q package -DskipTests`).
