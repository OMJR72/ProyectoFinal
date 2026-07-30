package com.proyectofinal.eq16.service;

import java.time.LocalDate;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyectofinal.eq16.dto.AuthResponse;
import com.proyectofinal.eq16.dto.LoginRequest;
import com.proyectofinal.eq16.dto.RegisterRequest;
import com.proyectofinal.eq16.models.Rol;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.RolRepository;
import com.proyectofinal.eq16.repository.UsuarioRepository;
import com.proyectofinal.eq16.security.JwtService;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "El correo '" + request.getEmail() + "' ya está registrado"
            );
        }

        Rol rolUsuario = rolRepository.findById(1L)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No existe el rol Usuario con ID 1"
                        )
                );

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        usuario.setRol(rolUsuario);
        usuario.setFecha_registro(LocalDate.now());
        usuario.setPuntos(0L);

        usuarioRepository.save(usuario);

        UserDetails userDetails = User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .authorities("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }
}