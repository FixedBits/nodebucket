/**
 *  Title: signin.component.ts
 *  Arthur: Professor Krasso
 *  Date: 08/05/2023
 * Description: signin component typescript
 */

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SecurityService } from '../security.service';

// This is the session user interface with the empId, firstName, and lastName fields
export interface SessionUser {
  empId: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  errorMessage: string; // This is the error message
  sessionUser: SessionUser; // This is the session user
  isLoading: boolean = false; // This is the isLoading boolean

  // This is the signin form with the empId field
  signinForm = this.fb.group({
    empId: [
      null,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')]),
    ],
  });

  // This is the constructor with the FormBuilder, Router, CookieService, SecurityService, and ActivatedRoute injected
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private securityService: SecurityService,
    private route: ActivatedRoute
  ) {
    this.errorMessage = '';
    this.sessionUser = {} as SessionUser;
  }

  // This is the signin method
  signin() {
    this.isLoading = true; // set isLoading to true to display the loading spinner

    const empId = this.signinForm.controls['empId'].value;
    console.log('signinForm', this.signinForm.value); // log the signin form value

    // Check if empId is valid
    if (!empId || isNaN(parseInt(empId, 10))) {
      this.errorMessage =
        'The employee ID you entered is invalid, please try again.'; // display error message
      this.isLoading = false; // set isLoading to false to hide the loading spinner
      return;
    }

    // call the findEmployeeById() function from the SecurityService
    this.securityService.findEmployeeById(empId).subscribe({
      next: (employee: any) => {
        console.log('employee', employee); // log the employee

        this.sessionUser = employee; // set the session user
        this.cookieService.set('session_user', empId, 1); // set the session_user cookie
        this.cookieService.set(
          'session_name',
          `${employee.firstName} ${employee.lastName}`,
          1
        ); // set the session_name cookie

        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || '/'; // check if there is a return URL
        this.isLoading = false; // set isLoading to false to hide the loading spinner

        this.router.navigate([returnUrl]); // redirect users to the returnUrl or homepage
      },
      error: (err) => {
        this.isLoading = false; // set isLoading to false to hide the loading spinner

        // Check if there is an err.error.message property
        if (err.error.message) {
          this.errorMessage = err.error.message; // display the custom error message from the Security API
        } else {
          this.errorMessage = err.message; // display the standard error message
        }
      },
    });
  }
}