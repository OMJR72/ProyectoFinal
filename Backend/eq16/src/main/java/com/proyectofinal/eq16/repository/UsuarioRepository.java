package com.proyectofinal.eq16.repository;

import com.proyectofinal.eq16.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
}
