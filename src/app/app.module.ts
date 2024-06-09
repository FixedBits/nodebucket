/**
 * Title: app.module.ts
 * Authors: Professor Krasso, Victor Soto
 * Date: 06/09/2024
 */

// imports statements
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { NavComponent } from './layouts/nav/nav.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { TasksComponent } from './tasks/tasks.component';
import { SecurityModule } from './security/security.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BaseLayoutComponent,
    NavComponent,
    FooterComponent,
    TasksComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, SecurityModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
