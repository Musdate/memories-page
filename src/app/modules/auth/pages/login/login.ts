import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { ROUTES } from '@shared/constants';
import { AlertService } from '@core/services/alerts.service';
import { Loading } from '@shared/components/loading/loading';

@Component({
  selector: 'app-login',
  imports: [ RouterModule, ReactiveFormsModule, Loading ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export default class Login {

  private readonly fb           = inject( FormBuilder );
  private readonly router       = inject( Router );
  private readonly authService  = inject( AuthService );
  private readonly alertService = inject( AlertService );

  public isLoading = signal( false );

  public loginForm: FormGroup = this.fb.group({
    email:      [ 'admin@gmail.com', [ Validators.required, Validators.email ]],
    password:   [ '123456', [ Validators.required, Validators.minLength(6), Validators.maxLength(20) ]],
    rememberMe: [ false ]
  });

  ngOnInit(): void {
    this.loadRememberedUser();
  }

  private loadRememberedUser() {
    const savedUser = localStorage.getItem( 'rememberedUser' );

    if ( savedUser ) {
      this.loginForm.patchValue({ email: savedUser, rememberMe: true });
    }
  }

  public onLogin() {

    if ( this.loginForm.invalid ) {
      this.alertService.showError({ text: 'Credenciales incorrectas.', timer: 2000 });
      return;
    }

    const { email = '', password = '', rememberMe = false } = this.loginForm.value;

    if ( rememberMe ) {
      localStorage.setItem( 'rememberedUser', email );
    } else {
      localStorage.removeItem( 'rememberedUser' );
    }

    this.isLoading.set( true );

    this.authService.login( email, password ).subscribe({
      next: ( isAuthenticated ) => {
        if ( isAuthenticated ) {
          this.router.navigateByUrl( ROUTES.landing );
          return;
        }
      },
      error: () => {
        this.alertService.showError({ text: 'Credenciales incorrectas.', timer: 2000 });
        this.isLoading.set( false );
      },
      complete: () => {
        this.isLoading.set( false );
      }
    });

  }

}