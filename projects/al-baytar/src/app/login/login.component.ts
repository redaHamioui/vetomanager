import { Component } from '@angular/core';
import { AppState, AuthGuardService } from '../core/core.module';
import { selectIsAuthenticated } from '../core/auth/auth.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
 


  constructor(private authService: AuthGuardService,  private store: Store<AppState>) {}

  onLoginClick() {
    // Handle the login flow
    this.authService.login({ username: 'admin', password: 'admin' });
  }

  onLogoutClick() {
    // Handle logout
    this.authService.logout();
  }
}
