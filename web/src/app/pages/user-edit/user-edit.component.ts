import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { UsersService, UserDTO } from '../../core/users.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Editar Usuário #{{id}}</h2>
    <form *ngIf="loaded" (ngSubmit)="onSubmit()" #f="ngForm">
      <label>Nome <input name="name" [(ngModel)]="name" required /></label>
      <label>Email <input name="email" [(ngModel)]="email" type="email" required /></label>
      <label>Role <input name="role" [(ngModel)]="role" /></label>
      <label>Atividade <input name="isActive" type="checkbox" [(ngModel)]="isActive" /></label><br />
      <button [disabled]="f.invalid">Salvar</button>
      <a routerLink="/users" class="cancelar" style="margin-left:8px; display: block; text-align: center; margin-top: 8px; font-weight: 600;">Cancelar</a>
    </form>
    <p *ngIf="error" style="color:red">{{error}}</p>
    `
})
export class UserEditComponent {
  id!: number; loaded=false; error='';
  name=''; email=''; password=''; role='user'; isActive=true;

  constructor(private route: ActivatedRoute, private svc: UsersService, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.listUsers().subscribe({
      next: (list) => {
        const u = list.find(x => x.id === this.id);
        if (!u) { this.error = 'Usuário não encontrado'; return; }
        this.name = u.name; this.email = u.email; this.role = (u.role ?? 'user'); this.isActive = !!u.isActive; this.loaded = true;
      },
      error: (err) => this.error = err?.error?.message || 'Falha ao carregar'
    });
  }

  onSubmit() {
    this.error='';
    this.svc.editUser(this.id, {
      name: this.name, email: this.email,
      password: this.password || null,
      role: this.role, isActive: this.isActive
    }).subscribe({
      next: () => this.router.navigateByUrl('/users'),
      error: (err) => this.error = err?.error?.message || 'Falha ao salvar'
    });
  }
}
