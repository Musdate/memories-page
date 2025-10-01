import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { ROUTES } from '@shared/constants';
import { AlertService } from '@core/services/alerts.service';
import { firstValueFrom } from 'rxjs';

export const AuthenticatedGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {

    const alertService = inject( AlertService );
    const authService = inject( AuthService );
    const router = inject( Router );

    try {

        const isAuthenticated = await firstValueFrom( authService.checkStatus() );

        if ( !isAuthenticated ) {
            router.navigateByUrl( ROUTES.login );
            return false
        }

        return true;

    } catch ( err ) {

        alertService.showError({ text: 'Error de red o autenticación.' });
        router.navigateByUrl( ROUTES.login );
        return false;

    }

}