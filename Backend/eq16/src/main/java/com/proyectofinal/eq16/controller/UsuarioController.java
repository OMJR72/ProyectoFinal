package com.proyectofinal.eq16.controller;

import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.UsuarioRepository;
import com.proyectofinal.eq16.security.UsuarioContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioContext usuarioContext;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioContext usuarioContext, UsuarioRepository usuarioRepository,
                             PasswordEncoder passwordEncoder) {
        this.usuarioContext = usuarioContext;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> obtenerPerfil() {
        Usuario usuario = usuarioContext.getCurrentUser();
        Map<String, Object> perfil = new HashMap<>();
        perfil.put("id", usuario.getId());
        perfil.put("nombre", usuario.getNombre());
        perfil.put("apellido", usuario.getApellido());
        perfil.put("email", usuario.getEmail());
        perfil.put("nombreUsuario", usuario.getEmail().split("@")[0]);
        perfil.put("telefono", usuario.getTelefono());
        perfil.put("puntos", usuario.getPuntos());
        perfil.put("rol", usuario.getRol().getNombre());
        perfil.put("fechaRegistro", usuario.getFecha_registro());
        perfil.put("foto", usuario.getFoto());
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/perfil")
    public ResponseEntity<Map<String, Object>> actualizarPerfil(@RequestBody Map<String, String> body) {
        Usuario usuario = usuarioContext.getCurrentUser();
        if (body.containsKey("nombre")) usuario.setNombre(body.get("nombre"));
        if (body.containsKey("apellido")) usuario.setApellido(body.get("apellido"));
        if (body.containsKey("telefono")) usuario.setTelefono(body.get("telefono"));
        usuarioRepository.save(usuario);

        Map<String, Object> perfil = new HashMap<>();
        perfil.put("id", usuario.getId());
        perfil.put("nombre", usuario.getNombre());
        perfil.put("apellido", usuario.getApellido());
        perfil.put("email", usuario.getEmail());
        perfil.put("telefono", usuario.getTelefono());
        perfil.put("rol", usuario.getRol().getNombre());
        return ResponseEntity.ok(perfil);
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<Map<String, String>> cambiarPassword(@RequestBody Map<String, String> body) {
        Usuario usuario = usuarioContext.getCurrentUser();
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        Map<String, String> response = new HashMap<>();

        if (currentPassword == null || newPassword == null || newPassword.length() < 6) {
            response.put("error", "La nueva contraseña debe tener al menos 6 caracteres");
            return ResponseEntity.badRequest().body(response);
        }

        if (!passwordEncoder.matches(currentPassword, usuario.getPassword())) {
            response.put("error", "La contraseña actual no es correcta");
            return ResponseEntity.badRequest().body(response);
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);

        response.put("mensaje", "Contraseña actualizada correctamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/subir-foto")
    public ResponseEntity<Map<String, String>> subirFoto(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        if (file.isEmpty()) {
            response.put("error", "No se seleccionó ningún archivo");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String uploadDir = "uploads/avatars/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String ext = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + ext;
            Path path = Paths.get(uploadDir + filename);
            Files.write(path, file.getBytes());

            Usuario usuario = usuarioContext.getCurrentUser();
            usuario.setFoto("/api/usuarios/uploads/avatars/" + filename);
            usuarioRepository.save(usuario);

            response.put("foto", usuario.getFoto());
            response.put("mensaje", "Foto actualizada correctamente");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Error al subir el archivo: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/uploads/avatars/{filename:.+}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/avatars/").resolve(filename).normalize();
            File file = filePath.toFile();
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            String mimeType = Files.probeContentType(filePath);
            if (mimeType == null) mimeType = "application/octet-stream";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(new FileSystemResource(file));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}