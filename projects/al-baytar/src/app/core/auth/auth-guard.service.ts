import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectIsAuthenticated } from './auth.selectors';
import { AppState } from '../core.state';
import { authLogin } from '../core.module';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(select(selectIsAuthenticated));
  }

  login(credentials: { username: string; password: string }) {
    // Simulate a login request
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        // Mock successful login
        console.log('Login successful');
        this.store.dispatch(authLogin());
        this.router.navigate(['/dashboard']);  // Redirect to a secure route after login
      } else {
        // Mock login failure
        console.log('Login failed');
      }
    }, 1000);
  }

  logout() {
    
  }
}
