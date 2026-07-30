package com.proyectofinal.eq16.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.proyectofinal.eq16.models.Rol;
import com.proyectofinal.eq16.repository.RolRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;

    public DataInitializer(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
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
    }
}
