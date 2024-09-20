package com.example.todo_poc.Model;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public class TodoItem {

    private UUID id;
    @NotBlank
    private String title;
    private String description;
    private Boolean done;

    public TodoItem() {
        this.id = UUID.randomUUID();
    }

    public TodoItem(String title, String description, Boolean done) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.done = done;
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

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }
}

