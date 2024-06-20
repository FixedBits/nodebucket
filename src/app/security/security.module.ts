/**
 * Title: security.module.ts
 * Author: Professor Krasso
 * Date: 06/09/2024
 * Description: security module typescript
 */

// Importing necessary modules from Angular core and Angular common
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importing the routing module for the 'Security' feature
import { SecurityRoutingModule } from './security-routing.module';

// Importing RouterModule for router functionality
import { RouterModule } from '@angular/router';

// Importing components
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';

// Importing forms modules for form handling
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importing HttpClientModule for making HTTP requests
import { HttpClientModule } from '@angular/common/http';

// Decorator that marks a class as an NgModule and supplies configuration metadata
@NgModule({
  // Components that this module declares
  declarations: [SecurityComponent, SigninComponent],

  // Modules that this module needs from Angular and other sources
  imports: [
    CommonModule, // Provides Angular directives and pipes such as ngIf, ngFor, etc.
    SecurityRoutingModule, // Routing module for 'Security' feature
    RouterModule, // Provides router directives and services
    FormsModule, // Provides template-driven forms functionality
    ReactiveFormsModule, // Provides reactive forms functionality
    HttpClientModule, // Provides HttpClient for making HTTP requests
  ],
})
// Exporting the module class
export class SecurityModule {}