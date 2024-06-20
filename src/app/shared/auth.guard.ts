/**
 *  Title: auth.guard.ts
 *  Arthur: Professor Krasso
 *  Date: 06/09/2024
 *  Description: auth guard
 */

// Importing necessary modules and functions
import { CanActivateFn } from '@angular/router'; // Interface that a class can implement to be a guard deciding if a route can be activated
import { Router } from '@angular/router'; // Provides the navigation and URL manipulation capabilities
import { CookieService } from 'ngx-cookie-service'; // Service for managing browser cookies
import { inject } from '@angular/core'; // Function that allows to inject dependencies

// The 'authGuard' is a function that implements the 'CanActivate' interface
export const authGuard: CanActivateFn = (route, state) => {
  // Injecting the CookieService
  const cookie = inject(CookieService);

  // If there is a 'session_user' cookie, the user is authenticated and can activate the route
  if (cookie.get('session_user')) {
    return true;
  } else {
    // If there is no 'session_user' cookie, the user is not authenticated
    // Injecting the Router
    const router = inject(Router);
    // Navigate to the 'signin' route and pass the current URL as a query parameter 'returnUrl'
    router.navigate(['/security/signin'], { queryParams: { returnUrl: state.url } });
    // The user cannot activate the route
    return false;
  }
};