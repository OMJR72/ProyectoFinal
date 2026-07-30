package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.models.Rol;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.RolRepository;
import com.proyectofinal.eq16.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public AdminController(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Map<String, Object>>> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Usuario u : usuarios) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", u.getId());
            item.put("nombre", u.getNombre());
            item.put("apellido", u.getApellido());
            item.put("email", u.getEmail());
            item.put("telefono", u.getTelefono());
            item.put("rol", u.getRol().getNombre());
            item.put("rolId", u.getRol().getRol_id());
            item.put("puntos", u.getPuntos());
            item.put("fechaRegistro", u.getFecha_registro());
            item.put("foto", u.getFoto());
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, Object>> obtenerUsuario(@PathVariable Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Map<String, Object> item = new HashMap<>();
        item.put("id", u.getId());
        item.put("nombre", u.getNombre());
        item.put("apellido", u.getApellido());
        item.put("email", u.getEmail());
        item.put("telefono", u.getTelefono());
        item.put("rol", u.getRol().getNombre());
        item.put("rolId", u.getRol().getRol_id());
        item.put("puntos", u.getPuntos());
        item.put("fechaRegistro", u.getFecha_registro());
        item.put("foto", u.getFoto());
        return ResponseEntity.ok(item);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, Object>> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (body.containsKey("nombre")) u.setNombre(body.get("nombre"));
        if (body.containsKey("apellido")) u.setApellido(body.get("apellido"));
        if (body.containsKey("email")) u.setEmail(body.get("email"));
        if (body.containsKey("telefono")) u.setTelefono(body.get("telefono"));

        usuarioRepository.save(u);

        Map<String, Object> item = new HashMap<>();
        item.put("id", u.getId());
        item.put("nombre", u.getNombre());
        item.put("apellido", u.getApellido());
        item.put("email", u.getEmail());
        item.put("rol", u.getRol().getNombre());
        item.put("mensaje", "Usuario actualizado correctamente");
        return ResponseEntity.ok(item);
    }

    @PutMapping("/usuarios/{id}/rol")
    public ResponseEntity<Map<String, Object>> cambiarRol(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Object rolIdObj = body.get("rolId");
        if (rolIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "rolId es requerido"));
        }

        Long rolId = rolIdObj instanceof Number ? ((Number) rolIdObj).longValue() : Long.parseLong(rolIdObj.toString());
        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        u.setRol(rol);
        usuarioRepository.save(u);

        Map<String, Object> item = new HashMap<>();
        item.put("id", u.getId());
        item.put("email", u.getEmail());
        item.put("rol", u.getRol().getNombre());
        item.put("mensaje", "Rol actualizado correctamente");
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente"));
    }
}
