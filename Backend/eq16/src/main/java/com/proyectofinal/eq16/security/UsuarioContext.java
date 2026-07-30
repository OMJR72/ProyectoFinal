package com.proyectofinal.eq16.security;

import com.proyectofinal.eq16.exception.ResourceException;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioContext {

    private final UsuarioRepository usuarioRepository;

    public UsuarioContext(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResourceException("Usuario no autenticado");
        }
        String email = auth.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceException("Usuario no encontrado"));
    }
}