import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from '../../core/users.service';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Add User</h2>
    <form (ngSubmit)="onSubmit()" #f="ngForm">
      <label>Name <input name="name" [(ngModel)]="name" required /></label><br />
      <label>Email <input name="email" [(ngModel)]="email" type="email" required /></label><br />
      <label>Password <input name="password" [(ngModel)]="password" type="password" required minlength="6" /></label><br />
      <label>Role <input name="role" [(ngModel)]="role" /></label><br />
      <label>Active <input name="isActive" type="checkbox" [(ngModel)]="isActive" /></label><br />
      <button [disabled]="f.invalid">Salvar</button>
      <a routerLink="/users" style="margin-left:8px">Cancelar</a>
    </form>
    <p *ngIf="error" style="color:red">{{error}}</p>
  `
})
export class UserAddComponent {
  name=''; email=''; password=''; role='user'; isActive=true; error='';
  constructor(private svc: UsersService, private router: Router) {}
  onSubmit() {
    this.error = '';
    this.svc.addUser({ name: this.name, email: this.email, password: this.password, role: this.role, isActive: this.isActive })
      .subscribe({
        next: () => this.router.navigateByUrl('/users'),
        error: (err) => this.error = err?.error?.message || 'Falha ao salvar'
      });
  }
}
