package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.dto.ActividadRequest;
import com.proyectofinal.eq16.models.Actividad;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.security.UsuarioContext;
import com.proyectofinal.eq16.service.ActividadService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    private final ActividadService actividadService;
    private final UsuarioContext usuarioContext;

    public ActividadController(ActividadService actividadService, UsuarioContext usuarioContext) {
        this.actividadService = actividadService;
        this.usuarioContext = usuarioContext;
    }

    @GetMapping
    public ResponseEntity<List<Actividad>> listar() {
        Usuario usuario = usuarioContext.getCurrentUser();
        return ResponseEntity.ok(actividadService.listarPorUsuario(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Actividad> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(actividadService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<Actividad> crear(@Valid @RequestBody ActividadRequest request) {
        Actividad actividad = actividadService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(actividad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Actividad> actualizar(@PathVariable Long id, @Valid @RequestBody ActividadRequest request) {
        Actividad actividad = actividadService.actualizar(id, request);
        return ResponseEntity.ok(actividad);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
