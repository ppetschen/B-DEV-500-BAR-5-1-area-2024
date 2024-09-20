import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TodoItem, TodoService } from "../todo.service";
import { FormsModule } from "@angular/forms";
import markdownit from "markdown-it";
import { CommonModule } from "@angular/common";
import hljs from "highlight.js";

@Component({
  selector: "app-todo-edit",
  templateUrl: "./todo-edit.component.html",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class TodoEditComponent implements OnInit {
  todo: TodoItem = { id: "", title: "", description: "", completed: false };
  isNew = true;
  currentTab: "edit" | "preview" = "edit";
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

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isNew = false;
      this.todoService.getTodoById(id).subscribe((data) => this.todo = data);
    }
  }

  saveTodo() {
    if (this.isNew) {
      this.todoService.createTodo(this.todo).subscribe(() =>
        this.router.navigate(["/"])
      );
    } else {
      this.todoService.updateTodo(this.todo.id, this.todo).subscribe(() =>
        this.router.navigate(["/"])
      );
    }
  }

  renderMarkdown(text: string): string {
    return this.markdown.render(text);
  }
}
