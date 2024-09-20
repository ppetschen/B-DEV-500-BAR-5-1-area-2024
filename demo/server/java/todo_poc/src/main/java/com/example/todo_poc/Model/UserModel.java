package com.example.todo_poc.Model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class UserModel {
    
    private String username;
    private String email;
    private String provider; // Eg. Google, Facebook, etc.

    // Constructors
    public UserModel(String username, String email, String provider) {
        super();
        
        this.username = username;
        this.email = email;
        this.provider = provider;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getProvider() {
        return provider;
    }
    public void setProvider(String provider) {
        this.provider = provider;
    }
}
