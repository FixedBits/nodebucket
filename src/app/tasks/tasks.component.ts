/**
 * Title: tasks.components.ts
 * Author: Professor Krasso
 * Date: 06/12/2024
 * Description: Task component logic
 */

// Import statements
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { stringify } from 'ajv';
import { CdkDropList } from '@angular/cdk/drag-drop';


// Define an interface for an item with an ID and text
export interface Item {
  _id: string;
  text: string;
}

// Define an interface for an employee with an ID and two lists of items
export interface Employee {
  empId: number;
  todo: Item[];
  done: Item[];
}

// Define a component for tasks
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})



// Define a class for the tasks component
export class TasksComponent {
  // Declare local variables
  empId: number;
  employee: Employee;
  todo: Item[];
  done: Item[];
  taskService: any;
  errorMessage: any;
  successMessage: string | undefined;
  hideAlert: any;


  // Define the constructor
  constructor(private http: HttpClient, private cookieService: CookieService) {
    // Get the employee ID from a cookie
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    // Initialize the employee and the lists
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
    // Make a request to get the employee's tasks
    this.http.get(`/api/employees/${this.empId}/tasks`).subscribe({
      next: (emp: any) => {
        // If the request is successful, update the employee
        this.employee = emp;
      },
      error: () => {
        // If there's an error, log it
        console.error(
          'Unable to get employee data for employee ID: ',
          this.empId
        );
      },
      complete: () => {
        // When the request is complete, update the lists
        this.todo = this.employee.todo ?? [];
        this.done = this.employee.done ?? [];
      },
    });
  }

// drop event for the todo and done lists using the cdkDragDrop directive from the drag and drop module
drop(event: CdkDragDrop<any[]>) {
  // if the item was dropped in the same container, move it to the new index
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    console.log('Moved item in array', event.container.data); // Log the new array to the console

    // Call updateTaskList function and pass in this.todo and this.done arrays
    this.updateTaskList(this.empId, this.todo, this.done);

  } else {
    // If the item is dropped in a different container, move it to the new container
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    console.log('Moved item between arrays', event.previousContainer.data, event.container.data);
  }
  }

/**
 * @description Updates the task list for the employee with the specified empId and passes in the todo and done arrays
 * @param empId
 * @param todo
 * @param done
 */
updateTaskList(empId: number, todo: Item[], done: Item[]) {
  this.taskService.updateTask(empId, todo, done).subscribe({
    next: (res: any) => {
      console.log('Task updated successfully')
    },
    error: (err: any) => {
      console.log('error', err); // Log the error to the console
      this.errorMessage = err.message; // Set the error message
      this.hideAlert(); // Call the hideAlert function
    }
  })
}

// Define a method to create a task
createTask(form: NgForm) {
  // Check if the form is valid
  if (form.valid) {
    // Get the task from the form
    const todoTask = form.value.task;
    // Make a request to create a new task
    this.http.post(`/api/employees/${this.empId}/tasks`, {
      text: todoTask,
    })
      .subscribe({
        next: (result: any) => {
          // If the request is successful, add the new task to the list
          const newTodoItem = {
            _id: result.id,
            text: todoTask,
          };
          this.todo.push(newTodoItem);
        },
        error: (err) => {
          // If there's an error, log it
          console.error(
            'Unable to create task for employee: ' + this.empId,
            err);
        },
      });
  }
}
  // Delete task
  deleteTask(taskId: string) {
    console.log(`Task item: ${taskId}`);

    // confirm dialog
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    // Call the deleteTask function on the taskService and subscribe to the observable and pass in the empId and taskId
    this.taskService.deleteTask(this.empId, taskId).subscribe({
      // If the task is selected successfully, remove it from the task array
      next: (res: any) => {
        console.log('Task deleted with id', taskId);

        if (!this.todo) this.todo = []; //if the todo array is null set it to an empty array
        if (!this.done) this.done = []; //if the done array is null set it to an empty array

        // We are doing this because we do not know if the task is in the todo or done array
        this.todo = this.todo.filter(t => t._id.toString() !== taskId);
        this.done = this.done.filter(t => t._id.toString() !== taskId);

        this.successMessage = "Task deleted successfully!"; // Set the success message
        this.hideAlert(); // Call the hideAlert() function
      },
      error: (err:Error) => {
        // Log the error
        console.log('error', err);
        this.errorMessage = err.message;

        this.hideAlert(); // Call the hideAlert() function
      }
    });
  }
}