import { Component, OnInit } from "@angular/core";
import { TodoItem, TodoService } from "../todo.service";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import markdownit from "markdown-it";
import hljs from "highlight.js";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  markdown = markdownit({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }

      return "";
    },
  });

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }

  toggleCompleted(todo: TodoItem) {
    this.todoService.updateTodo(todo.id, { completed: todo.completed })
      .subscribe(() => {
        this.loadTodos();
      });
  }

  renderMarkdown(text: string): string {
    return this.markdown.render(text);
  }
}
