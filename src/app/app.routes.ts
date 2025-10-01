import { Routes } from '@angular/router';
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canMatch: [ NotAuthenticatedGuard ],
        loadChildren: () => import('./modules/auth/auth.routes'),
    },
    {
        path: 'landing',
        canMatch: [ AuthenticatedGuard ],
        loadChildren: () => import('./modules/landing/landing.routes')
    },
    {
        path: '**',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
];