package com.proyectofinal.eq16.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.proyectofinal.eq16.models.Sesion;

import java.time.LocalDateTime;
import java.util.List;

public interface SesionRepository extends JpaRepository<Sesion, Long>{

    List<Sesion> findByUsuarioId(Long usuarioId);

    @Query("SELECT s FROM Sesion s WHERE s.usuario.id = :usuarioId AND s.fecha_inicio BETWEEN :start AND :end")
    List<Sesion> findByUsuarioIdAndFechaInicioBetween(@Param("usuarioId") Long usuarioId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    long countByUsuarioId(Long usuarioId);
}
