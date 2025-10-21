import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Redefinir Senha</h2>
    <form (ngSubmit)="onSubmit()" #f="ngForm">
      <label>Token
        <input name="token" [(ngModel)]="token" required />
      </label><br />
      <label>Nova senha
        <input name="newPassword" type="password" [(ngModel)]="newPassword" required minlength="6" />
      </label><br />
      <button [disabled]="f.invalid || loading">Trocar senha</button>
      <a routerLink="/login" style="margin-left:8px">Voltar ao login</a>
    </form>

    <p *ngIf="msg" style="color:green">{{ msg }}</p>
    <p *ngIf="error" style="color:red">{{ error }}</p>
  `
})
export class ResetComponent {
  token = '';
  newPassword = '';
  loading = false;
  msg = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.msg = this.error = '';
    this.loading = true;
    this.auth.resetpwd(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.msg = res.message || 'Senha alterada com sucesso.';
        this.loading = false;
        setTimeout(() => this.router.navigateByUrl('/login'), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Token inválido ou expirado.';
      }
    });
  }
}
