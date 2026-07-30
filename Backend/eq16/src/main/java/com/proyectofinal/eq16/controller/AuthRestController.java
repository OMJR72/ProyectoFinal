package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.dto.*;
import com.proyectofinal.eq16.service.CustomUserDetailService;
import com.proyectofinal.eq16.repository.*;
import com.proyectofinal.eq16.service.*;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    private final CustomUserDetailService customUserDetailService;
    private final RolRepository rolRepository;
    private final AuthService authService;
    
    public AuthRestController(CustomUserDetailService customUserDetailService, RolRepository rolRepository, AuthService authService) {
        this.customUserDetailService = customUserDetailService;
        this.rolRepository = rolRepository;
        this.authService = authService;
    }

    @PostMapping("/register/user")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request, 1L);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/analista")
    public ResponseEntity<AuthResponse> registerAnalista(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request, 2L);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<AuthResponse> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request, 3L);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
}