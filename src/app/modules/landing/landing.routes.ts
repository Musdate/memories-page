import { Routes } from '@angular/router';

export const landingRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import( './landing' ),
        children: [
            {
                path: 'settings',
                loadComponent: () => import( '../user-settings/user-settings' )
            },
            {
                path: 'walks',
                loadComponent: () => import( '../ladriaventuras/pages/walks/walks' )
            },
            {
                path: 'walk-info/:id',
                loadComponent: () => import( '../ladriaventuras/pages/walk-info/walk-info' )
            }
        ]
    }
];

export default landingRoutes;