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

        Optional<User> userOpt = userRepository.findByEmail(email.trim());

        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password.trim())) {
            return Optional.empty();
        }

        return Optional.of(user);
    }
}