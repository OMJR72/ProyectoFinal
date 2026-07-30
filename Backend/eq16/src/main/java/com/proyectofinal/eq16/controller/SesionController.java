package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.dto.SesionRequest;
import com.proyectofinal.eq16.models.Sesion;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.security.UsuarioContext;
import com.proyectofinal.eq16.service.SesionService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sesiones")
public class SesionController {

    private final SesionService sesionService;
    private final UsuarioContext usuarioContext;

    public SesionController(SesionService sesionService, UsuarioContext usuarioContext) {
        this.sesionService = sesionService;
        this.usuarioContext = usuarioContext;
    }

    @GetMapping
    public ResponseEntity<List<Sesion>> listar() {
        Usuario usuario = usuarioContext.getCurrentUser();
        return ResponseEntity.ok(sesionService.listarPorUsuario(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sesion> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(sesionService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<Sesion> crear(@Valid @RequestBody SesionRequest request) {
        Usuario usuario = usuarioContext.getCurrentUser();
        Sesion sesion = sesionService.crearParaUsuario(request, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(sesion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sesion> actualizar(@PathVariable Long id, @RequestBody SesionRequest request) {
        Sesion sesion = sesionService.actualizar(id, request);
        return ResponseEntity.ok(sesion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        sesionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
