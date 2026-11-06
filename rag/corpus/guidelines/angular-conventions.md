---
id: guidelines-angular-conventions
title: Angular conventions
lang: en
tags: [guideline, angular, frontend]
---

# Angular conventions

The frontend of Raumreservation is an Angular application. These conventions apply to all new code and to code that is touched during a change.

## Components

- Use **standalone components**. New NgModules are not created.
- Components are small and focused; a component that grows beyond a few hundred lines is split.
- Use `OnPush` change detection.
- Templates use the built-in control flow (`@if`, `@for`).

## State and reactivity

**Signals** are the default for local and shared state. Use `computed()` for derived values and `effect()` sparingly, only for side effects such as logging. RxJS remains appropriate for streams of events and HTTP calls; convert to signals at the boundary of the component.

## Dependency injection

Use the **`inject()`** function instead of constructor parameters. It works in components, services, guards and functional interceptors, and keeps class constructors empty.

## Formatting

Code is formatted with **Prettier**; the configuration lives in the repository root and is checked in the pipeline. Linting rules complement Prettier and are not duplicated by style discussions in reviews.

## No business logic in templates

Templates contain presentation only. Conditions that express business rules, such as whether a booking may still be cancelled, are computed in the component class or in a service and exposed as a signal or a method. This keeps rules testable and prevents duplicated logic.

### Examples of what belongs in a template

- binding values and events,
- simple conditionals on already computed flags,
- pipes for formatting dates and numbers.

## Naming and structure

- File names are kebab-case: `booking-list.component.ts`.
- Feature folders group components, services and routes.
- Shared UI building blocks live in a `shared` folder and have no dependency on features.

## Accessibility

Every interactive element must be reachable by keyboard and have an accessible name. See the guideline on frontend accessibility.
