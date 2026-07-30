package com.proyectofinal.eq16.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofinal.eq16.dto.ActividadRequest;
import com.proyectofinal.eq16.exception.ResourceException;
import com.proyectofinal.eq16.models.Actividad;
import com.proyectofinal.eq16.models.Sesion;
import com.proyectofinal.eq16.repository.ActividadRepository;
import com.proyectofinal.eq16.repository.SesionRepository;

@Service
public class ActividadService {
    private final ActividadRepository actividadRepository;
    private final SesionRepository sesionRepository;

    public ActividadService(ActividadRepository actividadRepository, SesionRepository sesionRepository){
        this.actividadRepository = actividadRepository;
        this.sesionRepository = sesionRepository;
    }

    @Transactional(readOnly = true)
    public List<Actividad> listar(){
        return actividadRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Actividad> listarPorUsuario(Long usuarioId){
        return actividadRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public Actividad obtener(Long id){
        return actividadRepository.findById(id)
                .orElseThrow(() -> new ResourceException("La actividad con id '" + id + "' no existe"));
    }

    @Transactional
    public Actividad crear(ActividadRequest request){
        Sesion sesion = sesionRepository.findById(request.getId_sesion())
                .orElseThrow(() -> new ResourceException("La sesion con id '" + request.getId_sesion() + "' no existe"));

        Actividad actividad = new Actividad();
        actividad.setNombre(request.getNombre());
        actividad.setDescripcion(request.getDescripcion());
        actividad.setTipo(request.getTipo() != null ? request.getTipo() : "OTRA");
        actividad.setSesion(sesion);

        return actividadRepository.save(actividad);
    }

    @Transactional
    public Actividad actualizar(Long id, ActividadRequest request){
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new ResourceException("La actividad con id '" + id + "' no existe"));

        Sesion sesion = sesionRepository.findById(request.getId_sesion())
                .orElseThrow(() -> new ResourceException("La sesion con id '" + request.getId_sesion() + "' no existe"));

        actividad.setNombre(request.getNombre());
        actividad.setDescripcion(request.getDescripcion());
        actividad.setTipo(request.getTipo());
        actividad.setSesion(sesion);

        return actividadRepository.save(actividad);
    }

    @Transactional
    public void eliminar(Long id){
        if (!actividadRepository.existsById(id)) {
            throw new ResourceException("La actividad con id '" + id + "' no existe");
        }
        actividadRepository.deleteById(id);
    }
}
