package com.proyectofinal.eq16.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class SesionRequest {

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fecha_inicio;

    private LocalDateTime fecha_fin;

    @NotNull(message = "La duracion es obligatoria")
    private Long duracion_minutos;

    private String estado;

    @NotNull(message = "El id del usuario es obligatorio")
    private Long id_usuario;

    public LocalDateTime getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(LocalDateTime fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public LocalDateTime getFecha_fin() {
        return fecha_fin;
    }

    public void setFecha_fin(LocalDateTime fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    public Long getDuracion_minutos() {
        return duracion_minutos;
    }

    public void setDuracion_minutos(Long duracion_minutos) {
        this.duracion_minutos = duracion_minutos;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

}
