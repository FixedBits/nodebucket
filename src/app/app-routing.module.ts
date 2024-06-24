/**
 * Title: app-routing.module.ts
 * Author: Professor Krasso
 * Author: Victor Soto
 * Date: 06/09/2024
 * Description: Defining and managing routes of the app
 */

// Importing necessary modules from Angular core and Angular router
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importing the BaseLayoutComponent
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';

// Importing the HomeComponent
import { HomeComponent } from './home/home.component';

// Importing the TasksComponent
import { TasksComponent } from './tasks/tasks.component';

// Importing the authentication guard
import { authGuard } from './shared/auth.guard';

// Importing the ContactComponent
import { ContactComponent } from './contact/contact.component';

// Importing the AboutComponent
import { AboutComponent } from './about/about.component';

// Importing the not-found component
import { NotFoundComponent } from './not-found/not-found.component';


// Defining the routes for this module
const routes: Routes = [
  {
    // The default path ('') is mapped to the BaseLayoutComponent
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        // The '' and 'home' paths are mapped to the HomeComponent
        path: '',
        component: HomeComponent,
        title: 'Nodebucket: Home', // title for the home page
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Nodebucket: Home',
      },
      {
        // The 'contact' path is mapped to the ContactComponent
        path: 'contact',
        component: ContactComponent,
        title: 'Nodebucket: Contact',
      },
      {
        // The 'about' path is mapped to the AboutComponent
        path: 'about',
        component: AboutComponent,
        title: 'Nodebucket: About Us'
      },
      {
        // The 'tasks' path is mapped to the TasksComponent and is protected by the authGuard
        path: 'tasks',
        component: TasksComponent,
        canActivate: [authGuard],
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
        title: 'Nodebucket: Not Found'
             },

    ],
  },
  {
    // The 'security' path is mapped to the SecurityModule
    path: 'security',
    loadChildren: () =>
      import('./security/security.module').then((m) => m.SecurityModule),
  },
  {
      // Redirects to not-found page
    path: '**',
    redirectTo: '/not-found'
  }
];

// Decorator that marks a class as an NgModule and supplies configuration metadata
@NgModule({
  // The forRoot method is used to configure the router at the application's root level with the routes array and other options
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  // Making the RouterModule available to other parts of the app
  exports: [RouterModule],
})
// Exporting the AppRoutingModule class so it can be imported into other parts of the application
export class AppRoutingModule {}