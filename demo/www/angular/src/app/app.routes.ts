import { Routes } from "@angular/router";
import { TodoListComponent } from "./todo-list/todo-list.component";
import { TodoEditComponent } from "./todo-edit/todo-edit.component";

export const routes: Routes = [
  { path: "", component: TodoListComponent },
  { path: "edit/:id", component: TodoEditComponent },
  { path: "new", component: TodoEditComponent },
];
