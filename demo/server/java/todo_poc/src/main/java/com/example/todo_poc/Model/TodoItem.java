package com.example.todo_poc.Model;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public class TodoItem {

    private UUID id;
    @NotBlank
    private String title;
    private String description;
    private Boolean completed;

    public TodoItem() {
        this.id = UUID.randomUUID();
    }

    public TodoItem(String title, String description) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.completed = false;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}

