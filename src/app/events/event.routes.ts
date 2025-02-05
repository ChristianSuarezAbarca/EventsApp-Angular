import { eventResolver } from '../shared/resolvers/event.resolver';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';
import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { Routes } from '@angular/router';
import { loginActivateGuard } from '../shared/guards/login-activate-guard.guard';

export const eventsRoutes: Routes = [
    { path: '', canActivate: [loginActivateGuard], loadComponent: () => import('./events-page/events-page.component').then((m) => m.EventsPageComponent), title: 'Events page' },
    { path: 'add', canDeactivate: [leavePageGuard], canActivate: [loginActivateGuard], loadComponent: () => import('./event-form/event-form.component').then((m) => m.EventFormComponent), title: 'New event' },
    { path: ':id', canActivate: [numericIdGuard, loginActivateGuard], resolve: { event: eventResolver }, loadComponent: () => import('./event-detail/event-detail.component').then((m) => m.EventDetailComponent) },
    { path: ':id/edit', canDeactivate: [leavePageGuard], canActivate: [loginActivateGuard], loadComponent: () => import('./event-form/event-form.component').then((m) => m.EventFormComponent), title: 'Edit event' }
];