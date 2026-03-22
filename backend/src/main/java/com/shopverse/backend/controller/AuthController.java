package com.shopverse.backend.controller;

import com.shopverse.backend.dto.AuthResponse;
import com.shopverse.backend.dto.LoginRequest;
import com.shopverse.backend.dto.RegisterRequest;
import com.shopverse.backend.model.User;
import com.shopverse.backend.security.JwtUtil;
import com.shopverse.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService service;
    private final JwtUtil jwtUtil;

    public AuthController(UserService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        // ✅ FIX: use service not authService
        User user = service.register(request);

        // ❌ Remove password before sending response
        user.setPassword(null);

        return user;
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        Optional<User> found = service.login(request.getEmail(), request.getPassword());

        if(found.isPresent()){
            User u = found.get();

            // 🔐 Generate JWT
            String token = jwtUtil.generateToken(u.getEmail(), u.getRole());

            u.setPassword(null);

            return new AuthResponse(token, u);
        }

        throw new RuntimeException("Invalid credentials");
    }
}