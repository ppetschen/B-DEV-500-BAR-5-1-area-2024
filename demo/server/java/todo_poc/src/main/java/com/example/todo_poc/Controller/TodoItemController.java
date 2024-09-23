package com.example.todo_poc.Controller;

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
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin
@RequestMapping("/todo")
public class TodoItemController {

    @Autowired
    private TodoItemRepository todoItemRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> save(@RequestBody @Valid TodoItem todoItem) {
        try {
            todoItem.setCompleted(false);
            TodoItem newTodoItem = todoItemRepository.save(todoItem);
            // Use the helper method to format the response
            return ResponseEntity.ok(createResponse(newTodoItem));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> findAll() {
        try {
            return ResponseEntity.ok(createResponse(todoItemRepository.findAll()));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable("id") UUID id) {
        try {
            Optional<TodoItem> todoItem = todoItemRepository.findById(id);
            if (todoItem.isPresent()) {
                return ResponseEntity.ok(createResponse(todoItem.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTodoItem(@PathVariable("id") UUID id, @RequestBody TodoItem updatedTodoItem) {
        try {
            Optional<TodoItem> existingTodoItem = todoItemRepository.findById(id);
            if (existingTodoItem.isPresent()) {
                TodoItem todoItem = existingTodoItem.get();
                todoItem.setTitle(updatedTodoItem.getTitle());
                todoItem.setDescription(updatedTodoItem.getDescription());
                todoItem.setCompleted(updatedTodoItem.getCompleted());
                todoItemRepository.save(todoItem);
                return ResponseEntity.ok(createResponse(todoItem));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTodoItemPartially(@PathVariable("id") UUID id,
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
                if (updatedTodoItem.getCompleted() != null) {
                    todoItem.setCompleted(updatedTodoItem.getCompleted());
                }
                todoItemRepository.save(todoItem);
                return ResponseEntity.ok(createResponse(todoItem));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable("id") UUID id) {
        try {
            if (todoItemRepository.existsById(id)) {
                todoItemRepository.deleteById(id);
                return ResponseEntity.ok(createResponse("TodoItem deleted successfully."));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    

    // Utility method to format response data
    private Map<String, Object> createResponse(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        return response;
    }
}
