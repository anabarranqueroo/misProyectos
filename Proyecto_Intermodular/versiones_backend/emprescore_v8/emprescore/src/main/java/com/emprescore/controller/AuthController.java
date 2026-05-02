package com.emprescore.controller;

import com.emprescore.dto.LoginRequest;
import com.emprescore.dto.LoginResponse;
import com.emprescore.dto.RegisterRequest;
import com.emprescore.model.Rol;
import com.emprescore.model.Usuario;
import com.emprescore.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

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
    public Usuario register(@Valid @RequestBody RegisterRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        //Contraseña encriptada con BCrypt
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.USER);
        return usuarioService.save(usuario);
    }

    @PostMapping("/register-empresa")
    public Usuario registerEmpresa(@Valid @RequestBody RegisterRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        //Contraseña encriptada con BCrypt
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.EMPRESA);
        return usuarioService.save(usuario);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.findByEmail(request.getEmail());
        if (passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return new LoginResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol());
        } else {
            throw new RuntimeException("Contraseña incorrecta");
        }
    }
}
