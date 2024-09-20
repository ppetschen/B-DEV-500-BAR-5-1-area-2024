package com.example.todo_poc.Controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo_poc.Model.TodoItem;
import com.example.todo_poc.Repository.TodoItemRepository;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@CrossOrigin
@RequestMapping("/todo")
public class TodoItemController {

    @Autowired
    private TodoItemRepository todoItemRepository;

    @PostMapping
    public ResponseEntity<TodoItem> save(@RequestBody @Valid TodoItem todoItem) {
        try {
            TodoItem newTodoItem = todoItemRepository.save(todoItem);
            return ResponseEntity.ok(newTodoItem);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TodoItem>> findAll() {
        try {
            return ResponseEntity.ok(todoItemRepository.findAll());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoItem> findById(@PathVariable("id") UUID id) {
        try {
            Optional<TodoItem> todoItem = todoItemRepository.findById(id);
            if (todoItem.isPresent()) {
                return ResponseEntity.ok(todoItem.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoItem> updateTodoItem(@PathVariable("id") UUID id, @RequestBody TodoItem updatedTodoItem) {
        try {
            Optional<TodoItem> existingTodoItem = todoItemRepository.findById(id);
            if (existingTodoItem.isPresent()) {
                TodoItem todoItem = existingTodoItem.get();
                todoItem.setTitle(updatedTodoItem.getTitle());
                todoItem.setDescription(updatedTodoItem.getDescription());
                todoItem.setDone(updatedTodoItem.getDone());
                todoItemRepository.save(todoItem);
                return ResponseEntity.ok(todoItem);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TodoItem> updateTodoItemPartially(@PathVariable("id") UUID id,
            @RequestBody TodoItem updatedTodoItem) {
        try {
            Optional<TodoItem> existingTodoItem = todoItemRepository.findById(id);
            if (existingTodoItem.isPresent()) {
                TodoItem todoItem = existingTodoItem.get();
                if (updatedTodoItem.getTitle() != null) {
                    todoItem.setTitle(updatedTodoItem.getTitle());
                }
                if (updatedTodoItem.getDescription() != null) {
                    todoItem.setDescription(updatedTodoItem.getDescription());
                }
                if (updatedTodoItem.getDone() != null) {
                    todoItem.setDone(updatedTodoItem.getDone());
                }
                todoItemRepository.save(todoItem);
                return ResponseEntity.ok(todoItem);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        try {
            if (todoItemRepository.existsById(id)) {
                todoItemRepository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
