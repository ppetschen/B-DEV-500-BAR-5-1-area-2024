import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TodoListComponent } from "./todo-list/todo-list.component";
import { TodoEditComponent } from "./todo-edit/todo-edit.component";
import { provideHttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    TodoListComponent,
    TodoEditComponent,
  ],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "angular";
}
