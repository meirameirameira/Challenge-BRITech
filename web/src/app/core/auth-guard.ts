import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('auth_token') : null;
  if (token) return true;
  router.navigateByUrl('/login');
  return false;
};
