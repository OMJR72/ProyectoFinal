package com.proyectofinal.eq16.repository;

import com.proyectofinal.eq16.models.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    List<Tarea> findByUsuarioId(Long usuarioId);

    List<Tarea> findByUsuarioIdAndEstadoNot(Long usuarioId, String estado);

    long countByUsuarioIdAndEstado(Long usuarioId, String estado);
}