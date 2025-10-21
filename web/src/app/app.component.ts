import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header style="padding:12px; border-bottom:1px solid #eee; display:flex; gap:12px; align-items:center;">
      <strong>BRITech</strong>
      <a routerLink="/login" *ngIf="!isAuth()">Login</a>
      <a routerLink="/signup" *ngIf="!isAuth()">Criar conta</a>
      <a routerLink="/forgot" *ngIf="!isAuth()">Esqueci minha senha</a>
      <a routerLink="/reset" *ngIf="!isAuth()">Redefinir senha</a>
      <a routerLink="/users" *ngIf="isAuth()">Usuários</a>
      <span style="margin-left:auto" *ngIf="isAuth()">
        <button (click)="logout()">Logout</button>
      </span>
    </header>
    <main style="padding:16px"><router-outlet></router-outlet></main>
  `
})
export class AppComponent {
  isAuth() { return !!localStorage.getItem('auth_token'); }
  constructor(private router: Router) {}
  logout() { localStorage.removeItem('auth_token'); this.router.navigateByUrl('/login'); }
}
