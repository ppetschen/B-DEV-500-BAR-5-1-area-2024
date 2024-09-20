package com.example.todo_poc.Repository;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.todo_poc.Model.UserModel;

public interface UserRepository extends MongoRepository<UserModel, String> {
    Optional<UserModel> findByEmail(String email);
}
