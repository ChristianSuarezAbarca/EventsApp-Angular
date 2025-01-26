import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'events', loadChildren: () => import('./events/event.routes').then(m => m.eventsRoutes)},
    { path: 'login', loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)},
    { path: '', loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)},
    { path: '**', loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)}
];
