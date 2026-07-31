package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.dto.TareaRequest;
import com.proyectofinal.eq16.models.Tarea;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.security.UsuarioContext;
import com.proyectofinal.eq16.service.TareaService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService tareaService;
    private final UsuarioContext usuarioContext;

    public TareaController(TareaService tareaService, UsuarioContext usuarioContext) {
        this.tareaService = tareaService;
        this.usuarioContext = usuarioContext;
    }

    @GetMapping
    public ResponseEntity<List<Tarea>> listar() {
        return ResponseEntity.ok(tareaService.listar());
    }

    @GetMapping("/prioritarias")
    public ResponseEntity<List<Tarea>> listarPrioritarias() {
        Usuario usuario = usuarioContext.getCurrentUser();
        return ResponseEntity.ok(tareaService.listarPrioritariasPorUsuario(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<Tarea> crear(@Valid @RequestBody TareaRequest request) {
        Usuario usuario = usuarioContext.getCurrentUser();
        Tarea tarea = tareaService.crearParaUsuario(request, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(tarea);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizar(@PathVariable Long id, @RequestBody TareaRequest request) {
        Tarea tarea = tareaService.actualizar(id, request);
        return ResponseEntity.ok(tarea);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tareaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
