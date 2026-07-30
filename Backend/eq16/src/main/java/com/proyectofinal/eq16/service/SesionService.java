package com.proyectofinal.eq16.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofinal.eq16.dto.SesionRequest;
import com.proyectofinal.eq16.exception.ResourceException;
import com.proyectofinal.eq16.models.Sesion;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.SesionRepository;
import com.proyectofinal.eq16.repository.UsuarioRepository;

@Service
public class SesionService {
    private final SesionRepository sesionRepository;
    private final UsuarioRepository usuarioRepository;

    public SesionService(SesionRepository sesionRepository, UsuarioRepository usuarioRepository){
        this.sesionRepository = sesionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Sesion> listar(){
        return sesionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Sesion obtener(Long id){
        return sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceException("La sesion con id '" + id + "' no existe"));
    }

    @Transactional
    public Sesion crear(SesionRequest request){
        Usuario usuario = usuarioRepository.findById(request.getId_usuario())
                .orElseThrow(() -> new ResourceException("El usuario con id '" + request.getId_usuario() + "' no existe"));

        Sesion sesion = new Sesion();
        sesion.setFecha_inicio(request.getFecha_inicio());
        sesion.setFecha_fin(request.getFecha_fin());
        sesion.setDuracion_minutos(request.getDuracion_minutos());
        sesion.setEstado(request.getEstado() != null ? request.getEstado() : "EN_PROGRESO");
        sesion.setUsuario(usuario);

        return sesionRepository.save(sesion);
    }

    @Transactional
    public Sesion actualizar(Long id, SesionRequest request){
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceException("La sesion con id '" + id + "' no existe"));

        Usuario usuario = usuarioRepository.findById(request.getId_usuario())
                .orElseThrow(() -> new ResourceException("El usuario con id '" + request.getId_usuario() + "' no existe"));

        sesion.setFecha_inicio(request.getFecha_inicio());
        sesion.setFecha_fin(request.getFecha_fin());
        sesion.setDuracion_minutos(request.getDuracion_minutos());
        sesion.setEstado(request.getEstado());
        sesion.setUsuario(usuario);

        return sesionRepository.save(sesion);
    }

    @Transactional
    public void eliminar(Long id){
        if (!sesionRepository.existsById(id)) {
            throw new ResourceException("La sesion con id '" + id + "' no existe");
        }
        sesionRepository.deleteById(id);
    }
}
