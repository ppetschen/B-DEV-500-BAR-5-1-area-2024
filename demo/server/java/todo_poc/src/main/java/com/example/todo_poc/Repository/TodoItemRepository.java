package com.example.todo_poc.Repository;



import java.util.UUID;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.todo_poc.Model.TodoItem;

public interface TodoItemRepository extends MongoRepository<TodoItem, UUID> {
    
    
}
