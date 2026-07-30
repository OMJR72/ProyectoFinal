package com.proyectofinal.eq16.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.proyectofinal.eq16.models.Actividad;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long>{

    @Query("SELECT a FROM Actividad a WHERE a.sesion.usuario.id = :usuarioId ORDER BY a.fecha DESC")
    List<Actividad> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}
