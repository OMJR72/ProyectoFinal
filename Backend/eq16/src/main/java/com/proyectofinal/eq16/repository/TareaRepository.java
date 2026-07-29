package com.proyectofinal.eq16.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectofinal.eq16.models.Tarea;

public interface TareaRepository extends JpaRepository<Tarea, Long>{
    
}
