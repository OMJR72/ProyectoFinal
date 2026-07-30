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
    public List<Tarea> listarPorUsuario(Long usuarioId){
        return tareaRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Tarea> listarPrioritariasPorUsuario(Long usuarioId){
        return tareaRepository.findByUsuarioIdAndEstadoNot(usuarioId, "COMPLETADA");
    }

    @Transactional(readOnly = true)
    public long contarCompletadasPorUsuario(Long usuarioId){
        return tareaRepository.countByUsuarioIdAndEstado(usuarioId, "COMPLETADA");
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
    public Tarea crearParaUsuario(TareaRequest request, Usuario usuario){
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

        if (request.getTitulo() != null) tarea.setTitulo(request.getTitulo());
        if (request.getDescripcion() != null) tarea.setDescripcion(request.getDescripcion());
        if (request.getFecha_limite() != null) tarea.setFecha_limite(request.getFecha_limite());
        if (request.getPrioridad() != null) tarea.setPrioridad(request.getPrioridad());
        if (request.getEstado() != null) tarea.setEstado(request.getEstado());
        if (request.getId_usuario() != null) {
            Usuario usuario = usuarioRepository.findById(request.getId_usuario())
                    .orElseThrow(() -> new ResourceException("El usuario con id '" + request.getId_usuario() + "' no existe"));
            tarea.setUsuario(usuario);
        }

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
