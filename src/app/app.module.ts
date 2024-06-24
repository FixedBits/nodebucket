/**
 * Title: app.module.ts
 * Authors: Professor Krasso, Victor Soto
 * Date: 06/09/2024
 * Description: Initializes and configures Angular app
 */

// Importing necessary modules from Angular and other libraries
import { NgModule } from '@angular/core'; // Angular's core functionality
import { BrowserModule } from '@angular/platform-browser'; // Module for running app in a browser
import { HttpClientModule } from '@angular/common/http'; // Module for making HTTP requests
import { FormsModule } from '@angular/forms'; // Module for building forms
import { DragDropModule } from '@angular/cdk/drag-drop'; // Module for enabling drag&drop use


// Importing application-specific modules
import { AppRoutingModule } from './app-routing.module'; // Handles routing for the app
import { SecurityModule } from './security/security.module'; // Security related features

// Importing components
import { AppComponent } from './app.component'; // Root component of the app
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component'; // Base layout component
import { NavComponent } from './layouts/nav/nav.component'; // Navigation component
import { FooterComponent } from './layouts/footer/footer.component'; // Footer component

// Importing page components
import { HomeComponent } from './home/home.component'; // Home page component
import { TasksComponent } from './tasks/tasks.component'; // Tasks component
import { ContactComponent } from './contact/contact.component'; // Contact page component
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component'; // About page component

// Defining the AppModule
@NgModule({
  declarations: [
    // List of components, directives, and pipes that belong to this module
    AppComponent,
    BaseLayoutComponent,
    NavComponent,
    FooterComponent,

    // Page components
    HomeComponent,
    TasksComponent,
    ContactComponent,
    AboutComponent,
    NotFoundComponent,
  ],
  imports: [
    // List of modules to import into this module
    // Everything from the imported modules is available to declarations of this module
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SecurityModule,
    FormsModule,
    DragDropModule,
  ],
  providers: [], // List of dependency injection providers
  bootstrap: [AppComponent],

})
export class AppModule {}