import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@core/services/alerts.service';
import { ActivityPrices, ActivityType, Pet, PetActivities, UpdateActivityDto } from '@ladriaventuras/interfaces';
import { WalksService } from '@ladriaventuras/services/walks.service';
import { GRID_THEME, GRID_LOCALE, GRID_EDIT_TYPE } from '@shared/grid-config';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ArchiveIcon, DeleteIcon, DollarIcon, EditIcon, PdfIcon, WalksIcon } from '@shared/icons';
import { parse, isValid, format } from 'date-fns';
import { GridApi } from 'ag-grid-community';
import { CellEditingStartedEvent, ICellRendererParams, IRowNode, RowValueChangedEvent, RowSelectionOptions } from 'ag-grid-community';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ROUTES } from '@shared/constants';
import generatePDF from '@ladriaventuras/shared/pdf/pet-report-generator.service';
import { AuthService } from '@auth/services/auth.service';
import { Loading } from '@shared/components/loading/loading';

@Component({
  selector: 'app-walk-info',
  imports: [
    ReactiveFormsModule,
    AgGridAngular,
    CurrencyPipe,
    EditIcon,
    WalksIcon,
    DeleteIcon,
    PdfIcon,
    ArchiveIcon,
    DollarIcon,
    Loading,
    CommonModule
  ],
  templateUrl: './walk-info.html',
  styleUrl: './walk-info.scss'
})
export default class WalkInfo {

  private readonly activedRoute = inject( ActivatedRoute );
  private readonly authService  = inject( AuthService );
  private readonly walksService = inject( WalksService );
  private readonly alertService = inject( AlertService );
  private readonly router       = inject( Router );
  private readonly fb           = inject( FormBuilder );

  public petId: string = this.activedRoute.snapshot.params['id'];
  public isLoading = signal( false );
  public activityData = signal<PetActivities[]>([]);
  public hasSelectedRows = signal(false);
  public gridApi!: GridApi;

  private originalRow: UpdateActivityDto | null = null;
  private originalParams: any;

  public gridOptions = {
    editType: GRID_EDIT_TYPE,
    localeText: GRID_LOCALE,
    theme: GRID_THEME,
    pagination: true,
    stopEditingWhenCellsLoseFocus: true,
    rowSelection: {
      mode: "multiRow",
      checkboxes: true
    } as RowSelectionOptions
  };

  public pricesForm: FormGroup = this.fb.group({
    dailyWalkPrice:      [ 0, [ Validators.min(0) ] ],
    weeklyWalkPrice:     [ 0, [ Validators.min(0) ] ],
    dailyGuarderiaPrice: [ 0, [ Validators.min(0) ] ],
    dailyCuidadoPrice:   [ 0, [ Validators.min(0) ] ]
  });

  public pet: Pet = {
    _id            : '',
    user           : '',
    name           : '',
    comment        : '',
    activity       : [],
    priceSummary   : { total: 0, pending: 0 },
    activityPrices : { dailyWalkPrice: 0, weeklyWalkPrice: 0, dailyGuarderiaPrice: 0, dailyCuidadoPrice: 0 },
  };

  public activityColumns: ColDef[] = [
    {
      field: 'activityType',
      headerName: 'Tipo',
      filter: true,
      editable: true,
      width: 110,
      minWidth: 110,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: () => ({ values: Object.values( ActivityType ) }),
    },
    {
      field: 'date',
      headerName: 'Fecha',
      filter: true,
      editable: true,
      width: 110,
      minWidth: 110,
      sort: 'desc',
      comparator: ( valueA: string, valueB: string ) => {
        const dateA = parse( valueA, 'dd-MM-yyyy', new Date() );
        const dateB = parse( valueB, 'dd-MM-yyyy', new Date() );
        return dateA.getTime() - dateB.getTime();
      }
    },
    {
      field: 'paid',
      headerName: 'Estado',
      filter: true,
      editable: true,
      width: 115,
      minWidth: 115,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: [true, false] },
      valueFormatter: ( params ) => params.value ? 'Pagado' : 'Pendiente',
      cellRenderer: ( params: ICellRendererParams ) => params.value ? 'Pagado' : 'Pendiente'
    },
    {
      field: 'note',
      headerName: 'Nota',
      filter: true,
      editable: true,
      flex: 1,
      minWidth: 115
    }
  ];

  ngOnInit(): void {
    this.loadPet();
  }

  private loadPet() {

    this.isLoading.set( true );

    this.walksService.findOnePet( this.petId ).subscribe({
      next: ( pet ) => {
        this.updatePetData( pet );
      },
      error: ( error ) => {
        this.alertService.showError({ text: error.error.message || 'Error.', timer: 2000 });
        this.isLoading.set( false );
      },
      complete: () => {
        this.isLoading.set( false );
      }
    });

  }

  public onUpdatePet( params: { name?: string, comment?: string, activityPrices?: ActivityPrices } ) {

    if ( params.name && params.name === this.originalParams.name ) return;
    if ( params.comment && params.comment === this.originalParams.comment ) return;
    if ( params.activityPrices && JSON.stringify( params.activityPrices ) === JSON.stringify( this.originalParams.activityPrices )) return;

    this.isLoading.set( true );

    this.walksService.updatePet( this.petId, params ).subscribe({
      next: ( updatedPet ) => {
        this.updatePetData( updatedPet );
        this.alertService.showSuccess({ text: 'Guardado Exitoso!!', timer: 2000 });
      },
      error: ( message ) => {
        this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
        this.isLoading.set( false );
      },
      complete: () => {
        this.isLoading.set( false );
      }
    });

  }

  public async onEditPetName() {
    const { value: formValues } = await Swal.fire({
      title: "Editar Nombre",
      html: `
        <input id="swal-petName"
               value="${ this.pet.name }"
               class="modal-input"
               type="text"
               placeholder="Nombre Mascota"
               autocomplete="off">
      `,
      focusConfirm: false,
      confirmButtonText: "Guardar",
      customClass: {
        confirmButton: "primary-btn",
        cancelButton: "primary-btn"
      },
      preConfirm: () => {
        return {
          name: (<HTMLInputElement>document.getElementById("swal-petName")).value
        };
      }
    });
    if ( formValues ) {
      this.onUpdatePet( formValues );
    }
  }

  public async onEditPetComment() {
    const { value: formValues } = await Swal.fire({
      title: "Editar Comentario",
      html: `
        <input id="swal-petComment"
               value="${ this.pet.comment }"
               class="modal-input"
               type="text"
               placeholder="Comentario"
               autocomplete="off">
      `,
      focusConfirm: false,
      confirmButtonText: "Guardar",
      customClass: {
        confirmButton: "primary-btn",
        cancelButton: "primary-btn"
      },
      preConfirm: () => {
        return {
          comment: (<HTMLInputElement>document.getElementById("swal-petComment")).value
        };
      }
    });
    if ( formValues ) {
      this.onUpdatePet( formValues );
    }
  }

  public onNewActivity() {

    const todayDate = format(new Date(), 'dd-MM-yyyy');
    const existDate = this.activityData().some( a => a.date === todayDate );

    const nuevaActividad: PetActivities = {
      date: todayDate,
      activityType: ActivityType.Paseo,
      paid: false,
      note: ''
    };

    this.isLoading.set(true);

    this.walksService.addPetActivity( this.petId, nuevaActividad ).subscribe({
      next: ( updatedPet ) => {
        this.updatePetData( updatedPet );
        if ( existDate ) {
          this.alertService.showSuccess({ text: 'Se ha guardado otra actividad para esta fecha.', timer: 2000 });
        } else {
          this.alertService.showSuccess({ text: 'Actividad guardada.', timer: 2000 });
        }
      },
      error: ( message ) => {
        this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
        this.isLoading.set( false );
      },
      complete: () => {
        this.isLoading.set( false );
      }
    });

  }

  public onDownloadPdf() {
    generatePDF( this.pet, this.authService.user() );
  }

  public onArchivePet() {

    Swal.fire({
      title: `¿Estás seguro que deseas archivar a ${ this.pet.name }?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: "primary-btn",
        cancelButton: "primary-btn"
      }
    }).then(( result ) => {

      if ( result.isConfirmed ) {

        this.isLoading.set(true);

        this.walksService.toggleArchivePet( [ this.petId ] ).subscribe({
          next: () => {
            this.alertService.showSuccess({ text: 'Mascota archivada.', timer: 2000 });
            this.router.navigateByUrl( ROUTES.walks );
          },
          error: ( message ) => {
            this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
            this.isLoading.set( false );
          },
          complete: () => {
            this.isLoading.set( false );
          }
        });

      }

    });

  }

  public onDeletePet() {

    Swal.fire({
      title: `¿Estás seguro que deseas eliminar a ${ this.pet.name }?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: "primary-btn",
        cancelButton: "primary-btn"
      }
    }).then(( result ) => {

      if ( result.isConfirmed ) {

        this.isLoading.set(true);

        this.walksService.deletePet( this.petId ).subscribe({
          next: () => {
            this.alertService.showSuccess({ text: 'Mascota eliminada.', timer: 2000 });
            this.router.navigateByUrl( ROUTES.walks );
          },
          error: ( message ) => {
            this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
            this.isLoading.set( false );
          },
          complete: () => {
            this.isLoading.set( false );
          }
        });

      }

    });

  }

  public onPayActivities() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedIds = selectedNodes.map( node => node.data._id );

    this.isLoading.set( true );

    this.walksService.payPetActivities( this.petId, selectedIds ).subscribe({
      next: ( updatedPet ) => {
        this.updatePetData( updatedPet );
        this.alertService.showSuccess({ text: 'Actividades pagadas.', timer: 2000 });
      },
      error: ( message ) => {
        this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
        this.isLoading.set( false );
      },
      complete: () => {
        this.isLoading.set( false );
      }
    });
  }

  public onDeleteActivities() {

    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedIds = selectedNodes.map( node => node.data._id );

    Swal.fire({
      title: `¿Estás seguro que deseas eliminar ${ selectedIds.length } actividades?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: "primary-btn",
        cancelButton: "primary-btn"
      }
    }).then(( result ) => {

      if ( result.isConfirmed ) {

        this.isLoading.set( true );

        this.walksService.deletePetActivities( this.petId, selectedIds ).subscribe({
          next: ( updatedPet ) => {
            this.updatePetData( updatedPet );
            this.alertService.showSuccess({ text: 'Actividades eliminadas.', timer: 2000 });
          },
          error: ( message ) => {
            this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
            this.isLoading.set( false );
          },
          complete: () => {
            this.isLoading.set( false );
          }
        });

      }

    });

  }

  public onCellEditingStarted( event: CellEditingStartedEvent<UpdateActivityDto> ) {
    if (!event.data) return;
    this.originalRow = { ...event.data };
  }

  public onRowValueChanged( event: RowValueChangedEvent<UpdateActivityDto> ) {
    const updatedActivity = event.data;
    if ( !updatedActivity || !this.originalRow ) return;

    if ( !this.isValidDateString( updatedActivity.date )) {
      this.alertService.showError({ text: 'Fecha inválida', timer: 2000 });
      this.originalRow && this.restoreRowValues(updatedActivity, this.originalRow, event.api, event.node);
      return;
    }

    this.isLoading.set( true );
    this.walksService.updatePetActivity( this.petId, updatedActivity ).subscribe({
      next: ( updatedPet ) => {
        this.updatePetData( updatedPet );
        this.alertService.showSuccess({ text: 'Guardado Exitoso!!', timer: 2000 });
      },
      error: ( message ) => {
        this.alertService.showError({ text: message.error.message || 'Error.', timer: 2000 });
        this.originalRow && this.restoreRowValues(updatedActivity, this.originalRow, event.api, event.node);
        this.isLoading.set( false );
      },
      complete: () => {
        this.isLoading.set( false );
      }
    });
  }

  private isValidDateString( dateStr: string ): boolean {
    const date = parse( dateStr, 'dd-MM-yyyy', new Date() );
    return isValid( date );
  }

  private restoreRowValues( row: PetActivities, original: PetActivities, api: GridApi, node: IRowNode<UpdateActivityDto> ) {
    if ( !row || !original ) return;
    Object.assign( row, original );
    api.refreshCells({ rowNodes: [node] });
  }

  private updatePetData( pet: Pet ) {

    this.pet = pet;

    this.pricesForm.patchValue({
      dailyWalkPrice: this.pet.activityPrices.dailyWalkPrice,
      weeklyWalkPrice: this.pet.activityPrices.weeklyWalkPrice,
      dailyGuarderiaPrice: this.pet.activityPrices.dailyGuarderiaPrice,
      dailyCuidadoPrice: this.pet.activityPrices.dailyCuidadoPrice
    });

    this.originalParams = {
      name: this.pet.name,
      comment: this.pet.comment,
      activityPrices: this.pet.activityPrices
    };

    if ( pet.activity ) this.activityData.set( pet.activity );

  }

  public onGridReady( params: GridReadyEvent ) {
    this.gridApi = params.api;
  }

  public onSelectionChanged() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    this.hasSelectedRows.set( selectedNodes.length > 0 );
  }

}