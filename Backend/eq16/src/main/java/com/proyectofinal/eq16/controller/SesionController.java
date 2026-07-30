package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.dto.SesionRequest;
import com.proyectofinal.eq16.models.Sesion;
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

    public SesionController(SesionService sesionService) {
        this.sesionService = sesionService;
    }

    @GetMapping
    public ResponseEntity<List<Sesion>> listar() {
        return ResponseEntity.ok(sesionService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sesion> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(sesionService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<Sesion> crear(@Valid @RequestBody SesionRequest request) {
        Sesion sesion = sesionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(sesion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sesion> actualizar(@PathVariable Long id, @Valid @RequestBody SesionRequest request) {
        Sesion sesion = sesionService.actualizar(id, request);
        return ResponseEntity.ok(sesion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        sesionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
