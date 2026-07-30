package com.proyectofinal.eq16.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyectofinal.eq16.dto.AuthResponse;
import com.proyectofinal.eq16.dto.LoginRequest;
import com.proyectofinal.eq16.dto.RegisterRequest;
import com.proyectofinal.eq16.exception.ResourceException;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.RolRepository;
import com.proyectofinal.eq16.repository.UsuarioRepository;
import com.proyectofinal.eq16.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RolRepository rolRepository;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RolRepository rolRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.rolRepository = rolRepository;
    }

    public AuthResponse register(RegisterRequest request, Long rol) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ResourceException(
                    "El email '" + request.getEmail() + "' ya está registrado"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());

        usuario.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        usuario.setRol(
                rolRepository.findById(rol)
                        .orElseThrow(() ->
                                new ResourceException(
                                        "El rol '" + rol + "' no existe"
                                )
                        )
        );

        usuario.setPuntos(0L);

        usuarioRepository.save(usuario);

        UserDetails userDetails = User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .roles(usuario.getRol().getNombre())
                .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, usuario.getEmail());
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceException("Usuario no encontrado")
                );

        UserDetails userDetails = User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .roles(usuario.getRol().getNombre())
                .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, usuario.getEmail());
    }
}