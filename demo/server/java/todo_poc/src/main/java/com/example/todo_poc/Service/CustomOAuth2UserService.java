package com.example.todo_poc.Service;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.stereotype.Service;

import com.example.todo_poc.Model.UserModel;
import com.example.todo_poc.Repository.UserRepository;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import java.util.Optional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUserService delegate = new OidcUserService();
        OidcUser oidcUser = delegate.loadUser(userRequest);

        // Extract the user information
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();

        System.out.println("Email: " + email + " Name: " + name);

        // Find user in database or create a new one
        Optional<UserModel> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            UserModel newUser = new UserModel(name, email, userRequest.getClientRegistration().getClientName());
            userRepository.save(newUser);
        }

        return oidcUser;
    }
}
