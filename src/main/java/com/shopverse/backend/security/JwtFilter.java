package com.shopverse.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import io.jsonwebtoken.Claims;
@Override
protected void doFilterInternal(HttpServletRequest req,
                                HttpServletResponse res,
                                FilterChain chain)
        throws ServletException, IOException {

    String path = req.getRequestURI();

    // 🔥 SKIP AUTH ENDPOINT COMPLETELY
    if (path.startsWith("/api/auth")) {
        chain.doFilter(req, res);
        return;
    }

    if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
        chain.doFilter(req, res);
        return;
    }

    String header = req.getHeader("Authorization");

    if (header != null && header.startsWith("Bearer ")) {
        String token = header.substring(7);

        if (jwtUtil.validateToken(token)) {

            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

            var auth = new UsernamePasswordAuthenticationToken(
                    username, null, authorities
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }

    chain.doFilter(req, res);
}