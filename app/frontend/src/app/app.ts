import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <a routerLink="/">Transitanmeldungen</a>
    </header>
    <main>
      <router-outlet />
    </main>
    <footer>Synthetische Übungsdaten – kein Abbild der realen NCTS-Regeln</footer>
  `,
})
export class App {}
