import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateActivityDto, CreatePetDto, Pet, UpdateActivityDto, UpdatePetDto } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalksService {

  private readonly http = inject( HttpClient );
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  public onSavePet( body: CreatePetDto ) {
    const url = `${ this.baseUrl }/walks/createPet`;
    return this.http.post<Pet>( url, body );
  }

  public findAllPets(): Observable<Pet[]> {
    const url = `${ this.baseUrl }/walks/getAllPets`;
    return this.http.get<Pet[]>( url );
  }

  public findArchivedPets(): Observable<Pet[]> {
    const url = `${ this.baseUrl }/walks/getArchivedPets`;
    return this.http.get<Pet[]>( url );
  }

  public findPetsByName( name: string ): Observable<Pet[]> {
    const url = `${ this.baseUrl }/walks/getPetsByName?name=${ encodeURIComponent( name ) }`;
    return this.http.get<Pet[]>( url );
  }

  public findOnePet( petId: string ): Observable<Pet> {
    const url = `${ this.baseUrl }/walks/getPet/${ petId }`;
    return this.http.get<Pet>( url );
  }

  public updatePet( petId: string, body: UpdatePetDto ): Observable<Pet> {
    const url = `${ this.baseUrl }/walks/updatePet/${ petId }`;
    return this.http.patch<Pet>( url, body );
  }

  public deletePet( petId: string ) {
    const url = `${ this.baseUrl }/walks/deletePet/${ petId }`;
    return this.http.delete<Pet>( url );
  }

  public addPetActivity( petId: string, body: CreateActivityDto ): Observable<Pet> {
    const url = `${ this.baseUrl }/walks/addPetActivity/${ petId }`;
    return this.http.post<Pet>( url, body );
  }

  public updatePetActivity( petId: string, body: UpdateActivityDto ): Observable<Pet> {
    const url = `${ this.baseUrl }/walks/updatePetActivity/${ petId }`;
    return this.http.patch<Pet>( url, body );
  }

  public deletePetActivities( petId: string, activitiesIds: string[] ): Observable<Pet> {
    const url = `${ this.baseUrl }/walks/deletePetActivities/${ petId }`;
    return this.http.delete<Pet>( url, { body: { activitiesIds } } );
  }

  public payPetActivities( petId: string, activitiesIds: string[] ): Observable<Pet> {
    const url = `${ this.baseUrl }/walks/payPetActivities/${ petId }`;
    return this.http.patch<Pet>( url, { activitiesIds } );
  }

  public toggleArchivePet( petsIds: string[] ): Observable<void> {
    const url = `${ this.baseUrl }/walks/toggleArchivePet`;
    return this.http.patch<void>( url, { petsIds } );
  }

}