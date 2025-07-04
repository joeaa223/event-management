import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withDebugTracing } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app-routing.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withDebugTracing()
    ),
    provideHttpClient(withInterceptorsFromDi())
  ]
}; 