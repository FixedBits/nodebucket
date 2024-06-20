/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated: by Victor Soto
 * Description: routing module typescript for security component
 */


// Importing necessary modules from Angular core and Angular router
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importing components
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';

// Defining routes for this module
const routes: Routes = [
  {
    // The default path ('') is mapped to the SecurityComponent
    path: '',
    component: SecurityComponent,
    title: 'Nodebucket: Security',
    children: [
      {
        // The 'signin' path is mapped to the SigninComponent
        path: 'signin',
        component: SigninComponent,
        title: 'Nodebucket: Sign In'
      }
    ]
  }
];

// Decorator that marks a class as an NgModule and supplies configuration metadata
@NgModule({
  // The forChild method is used to create a module that contains all the directives, the given routes, and the router service itself
  imports: [RouterModule.forChild(routes)],
  // Making the RouterModule available to other parts of the app
  exports: [RouterModule]
})
// Exporting the module class
export class SecurityRoutingModule { }