package com.proyectofinal.eq16.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.proyectofinal.eq16.models.Rol;
import com.proyectofinal.eq16.models.Usuario;
import com.proyectofinal.eq16.repository.RolRepository;
import com.proyectofinal.eq16.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (rolRepository.count() == 0) {
            Rol userRole = new Rol();
            userRole.setNombre("USER");
            userRole.setDescripcion("Usuario regular");
            rolRepository.save(userRole);

            Rol analistaRole = new Rol();
            analistaRole.setNombre("ANALISTA");
            analistaRole.setDescripcion("Analista");
            rolRepository.save(analistaRole);

            Rol adminRole = new Rol();
            adminRole.setNombre("ADMIN");
            adminRole.setDescripcion("Administrador");
            rolRepository.save(adminRole);
        }

        Rol adminRol = rolRepository.findById(3L).orElse(null);
        Rol analistaRol = rolRepository.findById(2L).orElse(null);
        Rol userRol = rolRepository.findById(1L).orElse(null);

        if (adminRol != null && !usuarioRepository.existsByEmail("admin@synapse.com")) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("Synapse");
            admin.setEmail("admin@synapse.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(adminRol);
            admin.setFecha_registro(LocalDateTime.now());
            admin.setPuntos(0L);
            usuarioRepository.save(admin);
        }

        if (analistaRol != null && !usuarioRepository.existsByEmail("analista@synapse.com")) {
            Usuario analista = new Usuario();
            analista.setNombre("Ana");
            analista.setApellido("Lista");
            analista.setEmail("analista@synapse.com");
            analista.setPassword(passwordEncoder.encode("analista123"));
            analista.setRol(analistaRol);
            analista.setFecha_registro(LocalDateTime.now());
            analista.setPuntos(0L);
            usuarioRepository.save(analista);
        }

        if (userRol != null && !usuarioRepository.existsByEmail("user@synapse.com")) {
            Usuario user = new Usuario();
            user.setNombre("User");
            user.setApellido("Prueba");
            user.setEmail("user@synapse.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRol(userRol);
            user.setFecha_registro(LocalDateTime.now());
            user.setPuntos(0L);
            usuarioRepository.save(user);
        }
    }
}
