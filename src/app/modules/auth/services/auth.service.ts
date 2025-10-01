import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { CreateUser, UpdateUser, User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

    private _authStatus = signal<AuthStatus>( 'checking' );
    private _user = signal<User | null>( null );
    private _token = signal<string | null>( localStorage.getItem( 'token' ) );

    private http = inject( HttpClient );

    public checkStatusResource = rxResource({
        stream: () => this.checkStatus(),
    });

    public authStatus = computed<AuthStatus>(() => {

        if ( this._authStatus() === 'checking' ) return 'checking';
        if ( this._user() ) return 'authenticated';

        return 'not-authenticated';

    });

    public user  = computed<User | null>(() => this._user() );
    public token = computed<string | null>(() => this._token() );

    public login( email: string, password: string ): Observable<boolean> {
        const url = `${ baseUrl }/auth/login`;

        return this.http.post<AuthResponse>( url , {
            email: email,
            password: password
        }).pipe(
            map(( resp ) => this.handleAuthSuccess( resp )),
            catchError(( err ) => this.handleAuthError( err ))
        );
    }

    public register( user: CreateUser ): Observable<boolean> {
        const url = `${ baseUrl }/auth/register`;

        return this.http.post<AuthResponse>( url, user ).pipe(
            map(( resp ) => this.handleAuthSuccess( resp )),
            catchError(( err ) => this.handleAuthError( err ))
        );
    }

    public update( body: UpdateUser ): Observable<User> {
        const url = `${ baseUrl }/auth/update`;

        return this.http.patch<User>( url, body ).pipe(
            map(( updatedUser ) => {
                this._user.set( updatedUser);
                return updatedUser;
            }),
            catchError(( error ) => throwError(() => error.error.message ))
        );
    }

    public checkStatus(): Observable<boolean> {

        const token = localStorage.getItem( 'token' );

        if ( !token ) {
            this.logout();
            return of( false );
        }

        return this.http.get<AuthResponse>(`${ baseUrl }/auth/check-status`).pipe(
            map(( resp ) => this.handleAuthSuccess( resp )),
            catchError(( err ) => this.handleAuthError( err ))
        );
    }

    public logout() {
        this._user.set( null );
        this._token.set( null );
        this._authStatus.set( 'not-authenticated' );
        localStorage.removeItem( 'token' );
    }

    private handleAuthSuccess( resp: AuthResponse ): boolean {
        this._user.set( resp.user );
        this._token.set( resp.token );
        this._authStatus.set( 'authenticated' );
        localStorage.setItem( 'token', resp.token );

        return true;
    }

    private handleAuthError( err: any ) {
        this.logout();
        return throwError( () => err );
    }

}