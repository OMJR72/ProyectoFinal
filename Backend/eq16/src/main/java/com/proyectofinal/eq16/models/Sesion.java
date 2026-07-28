package com.proyectofinal.eq16.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sesiones")
public class Sesion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sesion_id")
    private Long sesion_id;

    @Column(name = "fecha_inicio")
    private LocalDateTime fecha_inicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fecha_fin;

    @Column(name = "duracion_minutos")
    private Long duracion_minutos;

    @Column (name = "estado")
    private Boolean estado;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Sesion() {
    }

    public Sesion(Long sesion_id, LocalDateTime fecha_inicio, LocalDateTime fecha_fin, Long duracion_minutos, Boolean estado, Usuario usuario) {
        this.sesion_id = sesion_id;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.duracion_minutos = duracion_minutos;
        this.estado = estado;
        this.usuario = usuario;
    }

    public Long getSesion_id() {
        return sesion_id;
    }

    public void setSesion_id(Long sesion_id) {
        this.sesion_id = sesion_id;
    }

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

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    
}
