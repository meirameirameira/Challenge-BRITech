import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { UsersListComponent } from './pages/users-list/user-list.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { AuthGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login',  component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot', component: ForgotComponent },
  {
    path: 'users',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UsersListComponent },
      { path: 'add', component: UserAddComponent },
      { path: 'edit/:id', component: UserEditComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
