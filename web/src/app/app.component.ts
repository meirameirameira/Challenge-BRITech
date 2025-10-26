import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header class="header">
      <a routerLink="/" class="brand">
        <img src="assets/logo-britech-c-h.svg" alt="BRITech" class="logo" />
      </a>

      <nav class="nav-center">
        <a routerLink="/login" *ngIf="!isAuth()">Login ·</a> 
        <a routerLink="/signup" *ngIf="!isAuth()">Criar Conta ·</a> 
        <a routerLink="/forgot" *ngIf="!isAuth()">Esqueci minha senha ·</a> 
        <a routerLink="/reset"  *ngIf="!isAuth()">Redefinir senha</a>

        <a routerLink="/users" *ngIf="isAuth()">Users</a>
      </nav>

      <div class="nav-right" *ngIf="isAuth()">
        <button (click)="logout()">Logout</button>
      </div>
    </header>
    <main style="padding:16px"><router-outlet></router-outlet></main>
  `
})
export class AppComponent {
  isAuth() { return !!localStorage.getItem('auth_token'); }
  constructor(private router: Router) {}
  logout() { localStorage.removeItem('auth_token'); this.router.navigateByUrl('/login'); }
}
