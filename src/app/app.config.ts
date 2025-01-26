import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './shared/interceptors/base-url-interceptor.interceptor';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { provideGoogleId } from './google-login/google-login.config';
import { provideFacebookId } from './facebook-login/facebook-login.config';

export const appConfig: ApplicationConfig = {
  providers: [provideGoogleId('290544365698-38tjk1j6b79v9hltq0iav71jccfha5ug.apps.googleusercontent.com'), provideFacebookId('623885330111293', 'v22.0'), provideExperimentalZonelessChangeDetection(), provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)), provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor]))]
};
