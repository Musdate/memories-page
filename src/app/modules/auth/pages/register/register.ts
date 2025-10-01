import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { ROUTES, FIELD_ERROR } from '@shared/constants';
import { AlertService } from '@core/services/alerts.service';
import { Loading } from '@shared/components/loading/loading';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    Loading,
    CommonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export default class Register {

  private readonly fb           = inject( FormBuilder );
  private readonly router       = inject( Router );
  private readonly authService  = inject( AuthService );
  private readonly alertService = inject( AlertService );

  public isLoading = signal( false );

  private errorMessages = new Map<string, string>();
  private lastErrorMessages: string = '';

  public userForm: FormGroup = this.fb.group({
    name:       [ '', [ Validators.required ] ],
    email:      [ '', [ Validators.required, Validators.email ] ],
    password:   [ '', [ Validators.required, Validators.minLength(6), Validators.maxLength(20) ] ]
  });

  ngOnDestroy() {
    if ( this.errorMessages.size > 0 ) {
      Swal.close();
    }
  }

  public onRegister() {

    Swal.close();

    if ( this.userForm.valid ) {

      this.isLoading.set( true );

      this.authService.register( this.userForm.value ).subscribe({
        next: ( isAuthenticated ) => {
          if ( isAuthenticated ) {
            this.alertService.showSuccess({ text: 'Registro Exitoso!!', timer: 2000 });
            this.router.navigateByUrl( ROUTES.landing );
            return;
          }
        },
        error: ( message ) => {
          this.alertService.showError({ text: message.error.message || 'Error en el registro.', timer: 2000 });
          this.isLoading.set( false );
        },
        complete: () => {
          this.isLoading.set( false );
        }
      });

    } else {

      this.userForm.markAllAsTouched();
      this.showErrorAlert();

    }

  }

  public hasErrors( field: string ): boolean {

    if ( this.userForm.get(field)?.invalid && this.userForm.get(field)?.touched ) {

      this.errorMessages.set( field, FIELD_ERROR[field] );
      this.showErrorAlert();
      return true;

    } else {

      this.errorMessages.delete(field);
      this.showErrorAlert();
      return false;

    }

  }

  private showErrorAlert() {

    const currentErrorMessages = [ ...this.errorMessages.values() ].join('<br>');

    if ( this.lastErrorMessages !== currentErrorMessages ) {
      this.lastErrorMessages = currentErrorMessages;

      if ( this.errorMessages.size > 0 ) {
        this.alertService.showError({ text: currentErrorMessages, toast: true });
      } else {
        Swal.close();
      }

    }

  }

}