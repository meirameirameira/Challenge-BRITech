import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Signup</h2>
    <form (ngSubmit)="onSubmit()" #f="ngForm">
      <label>Name <input name="name" [(ngModel)]="name" required /></label><br />
      <label>Email <input name="email" [(ngModel)]="email" type="email" required /></label><br />
      <label>Password <input name="password" [(ngModel)]="password" type="password" required minlength="6" /></label><br />
      <button [disabled]="f.invalid">Criar conta</button>
    </form>
    <p *ngIf="msg" style="color:green">{{msg}}</p>
    <p *ngIf="error" style="color:red">{{error}}</p>
    <p><a routerLink="/login">Voltar ao login</a></p>
  `
})
export class SignupComponent {
  name = ''; email = ''; password = ''; msg = ''; error = '';
  constructor(private auth: AuthService) {}
  onSubmit() {
    this.msg = this.error = '';
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.msg = 'Conta criada! Faça login.',
      error: (err) => this.error = err?.error?.message || 'Falha no cadastro'
    });
  }
}
