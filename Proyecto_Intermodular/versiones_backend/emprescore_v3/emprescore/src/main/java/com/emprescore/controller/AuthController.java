package com.emprescore.controller;

import com.emprescore.dto.LoginResponse;
import com.emprescore.model.Rol;
import com.emprescore.model.Usuario;
import com.emprescore.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
        // Encriptar contraseña con BCrypt
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        // Asigna rol USER automáticamente
        usuario.setRol(Rol.USER);
        return usuarioService.save(usuario);
    }

    @PostMapping("/register-empresa")
    public Usuario registerEmpresa(@RequestBody Usuario usuario) {
        // Encriptar contraseña con BCrypt
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        // Asigna rol EMPRESA automáticamente
        usuario.setRol(Rol.EMPRESA);
        return usuarioService.save(usuario);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody Usuario loginRequest) {
        Usuario usuario = usuarioService.findByEmail(loginRequest.getEmail());
        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return new LoginResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol());
        } else {
            throw new RuntimeException("Contraseña incorrecta");
        }
    }
}
