package com.proyectofinal.eq16.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofinal.eq16.dto.TareaRequest;
import com.proyectofinal.eq16.exception.ResourceException;
import com.proyectofinal.eq16.models.Tarea;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.TareaRepository;
import com.proyectofinal.eq16.repository.UsuarioRepository;

@Service
public class TareaService {
    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;

    public TareaService(TareaRepository tareaRepository, UsuarioRepository usuarioRepository){
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Tarea> listar(){
        return tareaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tarea obtener(Long id){
        return tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceException("La tarea con id '" + id + "' no existe"));
    }

    @Transactional
    public Tarea crear(TareaRequest request){
        Usuario usuario = usuarioRepository.findById(request.getId_usuario())
                .orElseThrow(() -> new ResourceException("El usuario con id '" + request.getId_usuario() + "' no existe"));

        Tarea tarea = new Tarea();
        tarea.setTitulo(request.getTitulo());
        tarea.setDescripcion(request.getDescripcion());
        tarea.setFecha_limite(request.getFecha_limite());
        tarea.setPrioridad(request.getPrioridad() != null ? request.getPrioridad() : "MEDIA");
        tarea.setEstado(request.getEstado() != null ? request.getEstado() : "PENDIENTE");
        tarea.setUsuario(usuario);

        return tareaRepository.save(tarea);
    }

    @Transactional
    public Tarea actualizar(Long id, TareaRequest request){
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceException("La tarea con id '" + id + "' no existe"));

        Usuario usuario = usuarioRepository.findById(request.getId_usuario())
                .orElseThrow(() -> new ResourceException("El usuario con id '" + request.getId_usuario() + "' no existe"));

        tarea.setTitulo(request.getTitulo());
        tarea.setDescripcion(request.getDescripcion());
        tarea.setFecha_limite(request.getFecha_limite());
        tarea.setPrioridad(request.getPrioridad());
        tarea.setEstado(request.getEstado());
        tarea.setUsuario(usuario);

        return tareaRepository.save(tarea);
    }

    @Transactional
    public void eliminar(Long id){
        if (!tareaRepository.existsById(id)) {
            throw new ResourceException("La tarea con id '" + id + "' no existe");
        }
        tareaRepository.deleteById(id);
    }
}
