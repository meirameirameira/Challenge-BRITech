import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onSubmit()" #f="ngForm">
      <label>Email <input name="email" [(ngModel)]="email" type="email" required /></label><br />
      <label>Password <input name="password" [(ngModel)]="password" type="password" required /></label><br />
      <button [disabled]="f.invalid">Entrar</button>
    </form>
    <p *ngIf="error" style="color:red">{{error}}</p>
    <p><a routerLink="/signup">Criar conta</a> · <a routerLink="/forgot">Esqueci a senha</a></p>
  `
})
export class LoginComponent {
  email = ''; password = ''; error = '';
  constructor(private Auth: AuthService, private router: Router) {}
  onSubmit() {
    this.error = '';
    this.Auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => { this.Auth.saveToken(res.accessToken); this.router.navigateByUrl('/users'); },
      error: (err) => this.error = err?.error?.message || 'Falha no login'
    });
  }
}
