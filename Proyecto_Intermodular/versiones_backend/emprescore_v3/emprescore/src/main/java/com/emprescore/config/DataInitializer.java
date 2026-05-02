package com.emprescore.config;

import com.emprescore.model.Rol;
import com.emprescore.model.Usuario;
import com.emprescore.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdmin(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                usuarioService.findByEmail("admin@emprescore.com");
            } catch (RuntimeException e) {
                Usuario admin = new Usuario();
                admin.setNombre("Admin");
                admin.setEmail("admin@emprescore.com");
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setRol(Rol.ADMIN);
                usuarioService.save(admin);
                System.out.println("Admin creado correctamente");
            }
        };
    }
}