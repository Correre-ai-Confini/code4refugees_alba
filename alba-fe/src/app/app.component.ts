import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {
  }
  title = 'smi4refugees';
  public isAuthenticated$ = this.authService.isAuthenticated$ ();

  public logout(): void {
    this.authService.logout ();
  }
}
