/**
 * Title: security.component.ts
 * Author: Professor Krasso
 * Date: 06/09/2024 
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private http: HttpClient) {}

  findEmployeeById(empId: number) {
    console.log('Finding employee by ID', empId);
    return this.http.get('/api/employees/' + empId);
  }
}