package com.proyectofinal.eq16.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectofinal.eq16.models.Tareas;

public interface TareaRepository extends JpaRepository<Tareas, Long>{
    
}
