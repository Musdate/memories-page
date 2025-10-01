import { Component, inject, signal } from '@angular/core';
import { CreatePetDto, Pet } from '../../interfaces';
import { AlertService } from '@core/services/alerts.service';
import { Loading } from '@shared/components/loading/loading';
import { RouterModule } from '@angular/router';
import { WalksService } from '@ladriaventuras/services/walks.service';
import { ArchiveIcon, PlusIcon } from '@shared/icons';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-walks',
  imports: [
    Loading,
    RouterModule,
    PlusIcon,
    ArchiveIcon,
    ReactiveFormsModule
  ],
  templateUrl: './walks.html',
  styleUrl: './walks.scss'
})
export default class Walks {

  private readonly walksService  = inject( WalksService );
  private readonly alertService = inject( AlertService );

  public allPets: Pet[] = [];
  public archivedPets: Pet[] = [];
  public filteredPets = signal<Pet[]>([]);
  public isLoading = signal( false );
  public isLoadingPets = signal( false );
  public searchControl = new FormControl('');

  ngOnInit(): void {

    this.loadPets();

    this.searchControl.valueChanges.pipe(debounceTime(300))
    .subscribe(value => {
      this.filteredPets.set( this.onFilterPets( value ?? '' ));
    });

  }

  public loadPets() {
    this.isLoadingPets.set( true );

    this.walksService.findAllPets().subscribe({
      next: ( pets ) => {
        this.allPets = pets;
        this.filteredPets.set( pets );
      },
      error: ( message ) => {
        this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
        this.isLoadingPets.set( false );
      },
      complete: () => {
        this.isLoadingPets.set( false );
      }
    });
  }

  public onSavePet( formValue: CreatePetDto ): void {
    this.isLoading.set( true );

    this.walksService.onSavePet( formValue ).subscribe({
      next: () => {
        this.alertService.showSuccess({ text: 'Guardado Exitoso!!', timer: 2000 });
      },
      error: ( message ) => {
        this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
        this.isLoading.set( false );
      },
      complete: () => {
        this.loadPets();
        this.isLoading.set( false );
      }
    });
  }

  public async addPet() {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Mascota",
      html: `
        <label for="swal-petName"> Nombre </label>
        <input id="swal-petName" class="modal-input" type="text" placeholder="Nombre Mascota" autocomplete="off">
        <label for="swal-petComment"> Comentario </label>
        <input id="swal-petComment" class="modal-input" type="text" placeholder="Comentario" autocomplete="off">
      `,
      focusConfirm: false,
      confirmButtonText: "Guardar",
      customClass: {
        confirmButton: "primary-btn",
        cancelButton: "primary-btn"
      },
      preConfirm: () => {
        return {
          name: (<HTMLInputElement>document.getElementById("swal-petName")).value,
          comment: (<HTMLInputElement>document.getElementById("swal-petComment")).value
        };
      }
    });
    if ( formValues ) {
      this.onSavePet( formValues );
    }
  }

  public async toggleArchivePets() {

    Swal.fire({

      title: "Mascotas Archivadas",
      didOpen: () => Swal.showLoading()

    }).then( result => {

      if ( result.isConfirmed && result.value.length > 0 ) {

        this.isLoading.set(true);

        this.walksService.toggleArchivePet( result.value ).subscribe({
          next: () => {
            this.alertService.showSuccess({ text: 'Mascotas desarchivadas.', timer: 2000 });
          },
          error: ( message ) => {
            this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
            this.isLoading.set( false );
          },
          complete: () => {
            this.isLoading.set( false );
            this.loadPets();
          }
        });

      }

    });

    this.walksService.findArchivedPets().subscribe({
      next: ( archivedPets ) => {
        this.archivedPets = archivedPets;
        Swal.hideLoading();
        Swal.update({
          html: `
            <div class="archived-pets-container">
              ${ archivedPets.map( pet => `
                <label>
                  <input type="checkbox" class="archived-checkbox" value="${pet._id}">
                  ${pet.name}
                </label>
              `).join('') }
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: "Desarchivar",
          preConfirm: () => {
            const checked = Array.from( document.querySelectorAll('.archived-checkbox:checked') ) as HTMLInputElement[];
            return checked.map( cb => cb.value );
          }
        });
      },
      error: () => {
        Swal.hideLoading();
        Swal.update({
          html: `<div style="color:#842029;"> Error al cargar mascotas archivadas. </div>`,
          showConfirmButton: true
        });
      }
    });

  }

  public onFilterPets( searchText: string ): Pet[] {
    if ( this.allPets.length <= 100 ) {

      if ( !searchText ) return this.allPets;
      return this.allPets.filter( pet => {
        return pet.name.toLowerCase().includes( searchText.toLowerCase() );
      });

    } else {

      this.isLoadingPets.set( true );
      this.walksService.findPetsByName( searchText ).subscribe({
        next: ( pets ) => {
          this.filteredPets.set(pets);
        },
        error: ( err ) => {
          this.alertService.showError({ text: err.error.message || 'Error.', timer: 2000 });
          this.isLoadingPets.set(false);
        },
        complete: () => {
          this.isLoadingPets.set(false);
        }
      });

      return this.filteredPets();

    }

  }

}