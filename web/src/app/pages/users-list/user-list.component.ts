import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UsersService, UserDTO } from '../../core/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Users</h2>
    <div style="margin:8px 0;">
      <a routerLink="/users/add">+ Add User</a>
      <button (click)="load()" style="margin-left:8px">Recarregar</button>
    </div>
    <table border="1" cellpadding="6">
      <thead><tr><th>Id</th><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Ações</th></tr></thead>
      <tbody>
        <tr *ngFor="let u of users">
          <td>{{u.id}}</td>
          <td>{{u.name}}</td>
          <td>{{u.email}}</td>
          <td>{{u.role}}</td>
          <td>{{u.isActive}}</td>
          <td>
            <a [routerLink]="['/users/edit', u.id]">Edit</a>
            <button (click)="remove(u.id)" style="margin-left:8px">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p *ngIf="error" style="color:red">{{error}}</p>
  `
})
export class UsersListComponent {
  users: UserDTO[] = [];
  error = '';
  constructor(private svc: UsersService, private router: Router) {}
  ngOnInit() { this.load(); }
  load() {
    this.error = '';
    this.svc.listUsers().subscribe({
      next: (list) => this.users = list,
      error: (err) => this.error = err?.error?.message || 'Falha ao carregar'
    });
  }
  remove(id: number) {
    if (!confirm('Confirmar remoção?')) return;
    this.svc.removeUser(id).subscribe({
      next: () => this.load(),
      error: (err) => alert(err?.error?.message || 'Falha ao remover')
    });
  }
}
