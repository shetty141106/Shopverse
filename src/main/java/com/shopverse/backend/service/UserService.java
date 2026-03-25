package com.shopverse.backend.service;

import com.shopverse.backend.dto.RegisterRequest;
import com.shopverse.backend.model.User;
import com.shopverse.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= REGISTER =================
    public User register(RegisterRequest request){

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    // ================= LOGIN =================
    public Optional<User> login(String email, String password) {

        Optional<User> user = userRepository.findByEmail(email.trim());

        if(user.isPresent()) {
            if(user.get().getPassword().equals(password.trim())) {
                return user;
            }
        }
        System.out.println("Input email: " + email);
        System.out.println("DB email: " + user.get().getEmail());
        System.out.println("Input password: " + password);
        System.out.println("DB password: " + user.get().getPassword());

        return Optional.empty();
    }
}