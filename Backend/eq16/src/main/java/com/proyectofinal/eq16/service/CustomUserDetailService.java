package com.proyectofinal.eq16.service;

import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.proyectofinal.eq16.exception.*;
import com.proyectofinal.eq16.dto.AuthResponse;
import com.proyectofinal.eq16.dto.RegisterRequest;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.UsuarioRepository;
import com.proyectofinal.eq16.repository.RolRepository;
import com.proyectofinal.eq16.models.Rol;

@Service
public class CustomUserDetailService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RolRepository rolRepository;

    public CustomUserDetailService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.rolRepository = rolRepository;
    }

    
    public AuthResponse register(RegisterRequest request, Long rol) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ResourceException("El username '" + request.getEmail() + "' ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rolRepository.findById(rol).orElseThrow(() -> new ResourceException("El rol '" + rol + "' no existe")));
        usuarioRepository.save(usuario);

        String token = jwtService.generarToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getEmail());
    }
}
