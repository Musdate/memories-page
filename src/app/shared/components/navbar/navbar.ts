import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { ROUTES } from '@shared/constants';
import { CloseIcon, HomeIcon, LogoutIcon, MenuIcon, MoviesIcon, SettingsIcon, WalksIcon } from '@shared/icons';

@Component({
  selector: 'navbar',
  imports: [
    RouterLink,
    RouterModule,
    SettingsIcon,
    LogoutIcon,
    MenuIcon,
    CloseIcon,
    HomeIcon,
    MoviesIcon,
    WalksIcon
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  public authService = inject( AuthService );
  private router = inject( Router );

  public showSidebar: boolean = false;

  get userName(): string {
    const user = this.authService.user();
    return user ? user.name : 'Username';
  }

  public onLogout() {
    this.authService.logout();
    this.router.navigateByUrl( ROUTES.login );
  }

  public toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

}