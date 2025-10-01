import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import( './layout/layout' ),
        children: [
            {
                path: 'login',
                loadComponent: () => import( './pages/login/login' )
            },
            {
                path: 'register',
                loadComponent: () => import( './pages/register/register' )
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    }
];

export default authRoutes;