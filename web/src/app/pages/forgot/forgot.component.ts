import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Forgot password</h2>
    <form (ngSubmit)="onSubmit()" #f="ngForm">
      <label>Email <input name="email" [(ngModel)]="email" type="email" required /></label><br />
      <button [disabled]="f.invalid">Enviar</button>
    </form>
    <p *ngIf="msg" style="color:green">{{msg}}</p>
    <p *ngIf="devToken" style="font-family:monospace">devToken: {{devToken}}</p>
    <p *ngIf="error" style="color:red">{{error}}</p>
    <p><a routerLink="/login">Voltar ao login</a></p>
  `
})
export class ForgotComponent {
  email = ''; msg = ''; error = ''; devToken = '';
  constructor(private auth: AuthService) {}
  onSubmit() {
    this.msg = this.error = ''; this.devToken = '';
    this.auth.forgot(this.email).subscribe({
      next: (res) => { this.msg = res.message || 'Se existir, foi enviado um token.'; this.devToken = res.devToken ?? ''; },
      error: (err) => this.error = err?.error?.message || 'Falha'
    });
  }
}
