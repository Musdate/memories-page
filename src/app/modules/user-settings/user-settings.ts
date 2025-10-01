import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bank } from '@auth/interfaces/user.interface';
import { AuthService } from '@auth/services/auth.service';
import { AlertService } from '@core/services/alerts.service';

@Component({
  selector: 'app-user-settings',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.scss'
})
export default class UserSettings {

  private readonly fb           = inject( FormBuilder );
  private readonly authService  = inject( AuthService );
  private readonly alertService = inject( AlertService );

  public isLoading      = signal( false );
  public errorNameField = signal( false );

  private originalValues: any;

  public userForm: FormGroup = this.fb.group({
    name  : [ this.authService.user()!.name, [ Validators.required ]],
    email : [ { value: this.authService.user()!.email, disabled: true }, [ Validators.required ]],
    banks : this.fb.array([])
  });

  ngOnInit(): void {
    this.loadBanks();
    this.originalValues = { ...this.userForm.value };
  }

  get banks() {
    return this.userForm.get( 'banks' ) as FormArray;
  }

  private loadBanks() {
    (this.authService.user()?.banks ?? []).forEach(( bank ) => {
      this.banks.push( this.createBanksForm( bank ));
    });
  }

  private createBanksForm( bank: Bank ): FormGroup {
    return this.fb.group({
      name: [ bank.name, [ Validators.required ]],
      number: [ bank.number ]
    });
  }

  public onSaveSettings() {

    if ( JSON.stringify( this.userForm.value ) === JSON.stringify( this.originalValues )) return;

    if ( this.userForm.valid ) {

      this.isLoading.set( true );

      const body = { ...this.userForm.value, _id: this.authService.user()?._id };

      this.authService.update( body ).subscribe({
        next: () => {
          this.originalValues = { ...this.userForm.value };
          this.alertService.showSuccess({ text: 'Guardado Exitoso!!', timer: 2000 });
        },
        error: ( message ) => {
          this.alertService.showError({ text: message.error.message || 'Error al guardar.', timer: 2000 });
          this.isLoading.set( false );
        },
        complete: () => {
          this.isLoading.set( false );
        }
      });

    } else {

      this.errorNameField.set( true );
      this.alertService.showError({ text: 'Username es requerido', timer: 2000 });

    }
  }

  public onAddBank() {
    this.banks.push( this.createBanksForm({ name: 'Bancolombia', number: '' }));
    this.banks.push( this.createBanksForm({ name: 'Nequi', number: '' }));
  }

  public hasErrors( field: string ): boolean {
    return !! ( this.userForm.get( field )?.invalid && this.userForm.get( field )?.touched );
  }

}
