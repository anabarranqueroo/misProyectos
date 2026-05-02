package com.emprescore.config;

import com.emprescore.service.UsuarioDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableMethodSecurity //Habilita la seguridad por métodos
public class SecurityConfig {

    private final UsuarioDetailsService usuarioDetailsService;

    public SecurityConfig(UsuarioDetailsService usuarioDetailsService) {
        this.usuarioDetailsService = usuarioDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()          // login y registro abiertos    
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN") // sólo admin puede listar usuarios
                .anyRequest().authenticated()                         // resto requiere autenticación
            )
            .userDetailsService(usuarioDetailsService) //Usa la clase para buscar el usuario en la base de datos
            .httpBasic(Customizer.withDefaults()); //Habilita la autenticación

        return http.build();
    }
}