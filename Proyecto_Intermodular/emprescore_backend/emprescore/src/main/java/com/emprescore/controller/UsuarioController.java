package com.emprescore.controller;

import com.emprescore.model.Usuario;
import com.emprescore.service.UsuarioService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // GET /api/usuarios - Solo ADMIN
    @GetMapping
    public List<Usuario> listar() {
        return service.findAll();
    }

    // GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public Usuario obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    // POST /api/usuarios - Crear un nuevo usuario
    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return service.save(usuario);
    }

    // PUT /api/usuarios/{id} - Editar usuario completo (ADMIN)
    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return service.update(id, usuario);
    }

    // PUT /api/usuarios/{id}/perfil - Editar solo nombre y email
    @PutMapping("/{id}/perfil")
    public Usuario editarPerfil(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        return service.editarPerfil(id, datos.get("nombre"), datos.get("email"));
    }

    // PUT /api/usuarios/{id}/cambiar-password - Cambiar contraseña
    @PutMapping("/{id}/cambiar-password")
    public void cambiarPassword(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        service.cambiarPassword(id, datos.get("passwordActual"), datos.get("passwordNueva"));
    }
    
    // PUT /api/usuarios/reset-password - Resetea la contraseña del usuario dado su email
    @PutMapping("/reset-password")
    public void resetPassword(@RequestBody Map<String, String> datos) {
        service.resetPassword(datos.get("email"), datos.get("passwordNueva"));
    }

    // DELETE /api/usuarios/{id} - Eliminar con cascade
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}
