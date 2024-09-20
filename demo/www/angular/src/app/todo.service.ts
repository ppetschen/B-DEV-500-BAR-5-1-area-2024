import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private apiUrl = "http://localhost:3000/todo";

  constructor(private http: HttpClient) {}

  getTodos(): Observable<TodoItem[]> {
    return this.http.get<{ data: TodoItem[] }>(
      this.apiUrl,
    ).pipe(map((res) => res.data));
  }

  getTodoById(id: string): Observable<TodoItem> {
    return this.http.get<{ data: TodoItem[] }>(`${this.apiUrl}/${id}`).pipe(
      map((res) => res.data[0]),
    );
  }

  createTodo(todo: TodoItem): Observable<void> {
    return this.http.post<void>(this.apiUrl, {
      ...todo,
      id: crypto.randomUUID(),
    });
  }

  updateTodo(id: string, changes: Partial<TodoItem>): Observable<TodoItem> {
    return this.http.put<{ data: TodoItem }>(`${this.apiUrl}/${id}`, changes)
      .pipe(
        map((res) => res.data),
      );
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
