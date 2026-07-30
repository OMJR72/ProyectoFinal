package com.proyectofinal.eq16.service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.proyectofinal.eq16.dto.AuthResponse;
import com.proyectofinal.eq16.dto.LoginRequest;
import com.proyectofinal.eq16.dto.RegisterRequest;
import com.proyectofinal.eq16.exception.ResourceException;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.AuthenticationManager;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RolRepository rolRepository;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.rolRepository = rolRepository;
    }

    public AuthResponse register(RegisterRequest request, Long rol) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ResourceException("El email '" + request.getEmail() + "' ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getnombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rolRepository.findById(rol).orElseThrow(() -> new ResourceException("El rol '" + rol + "' no existe")));
        usuario.setPuntos(0L);
        usuarioRepository.save(usuario);

        String token = jwtService.generarToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtService.generarToken(request.getEmail());
        return new AuthResponse(token, request.getEmail());
    }
}
