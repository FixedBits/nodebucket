/**
 * Title: security.component.ts
 * Author: Professor Krasso
 * Date: 06/09/2024
 * Description: security service typescript
 */

// Importing HttpClient for making HTTP requests
import { HttpClient } from '@angular/common/http';

// Importing Injectable decorator from Angular core
import { Injectable } from '@angular/core';

// Decorator that marks a class as available to be provided and injected as a dependency
@Injectable({
  // Specifies that this service should be created by the root application injector
  providedIn: 'root',
})
export class SecurityService {
  // Constructor with HttpClient injected
  constructor(private http: HttpClient) {}

  // Method to find an employee by ID
  findEmployeeById(empId: number) {
    // Making a GET request to the server with the employee ID
    return this.http.get('/api/employees/' + empId);
  }
}