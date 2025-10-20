import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header style="padding:12px; border-bottom:1px solid #eee; display:flex; gap:12px; align-items:center;">
      <strong>User Management</strong>
      <a routerLink="/login">Login</a>
      <a routerLink="/signup">Signup</a>
      <a routerLink="/forgot">Forgot</a>
      <a routerLink="/users">Users</a>
    </header>
    <main style="padding:16px">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
