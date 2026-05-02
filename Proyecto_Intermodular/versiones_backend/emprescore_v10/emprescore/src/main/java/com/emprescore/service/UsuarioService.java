package com.emprescore.service;

import com.emprescore.model.Usuario;
import com.emprescore.repo.ResenaRepository;
import com.emprescore.repo.ReporteResenaRepository;
import com.emprescore.repo.EmpresaRepository;
import com.emprescore.repo.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ResenaRepository resenaRepository;
    private final ReporteResenaRepository reporteRepository;
    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, ResenaRepository resenaRepository, ReporteResenaRepository reporteRepository, EmpresaRepository empresaRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.resenaRepository = resenaRepository;
        this.reporteRepository = reporteRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, Usuario cambios) {
        Usuario existente = findById(id);

        existente.setNombre(cambios.getNombre());
        existente.setEmail(cambios.getEmail());
        existente.setRol(cambios.getRol());

        if (cambios.getPassword() != null && !cambios.getPassword().isBlank()) {
            existente.setPassword(cambios.getPassword());
        }
        return usuarioRepository.save(existente);
    }

    public Usuario editarPerfil(Long id, String nombre, String email) {
        Usuario existente = findById(id);
        existente.setNombre(nombre);
        existente.setEmail(email);
        return usuarioRepository.save(existente);
    }

    public void cambiarPassword(Long id, String passwordActual, String passwordNueva) {
        Usuario usuario = findById(id);
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }
        usuario.setPassword(passwordEncoder.encode(passwordNueva));
        usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        //Borrar reportes hechos por el usuario
        reporteRepository.findByUsuarioId(id).forEach(r -> reporteRepository.deleteById(r.getId()));
        // Borrar reportes sobre reseñas del usuario
        resenaRepository.findByUsuarioId(id).forEach(resena -> {
            reporteRepository.findByResenaId(resena.getId()).forEach(r -> reporteRepository.deleteById(r.getId()));
        });
        //Borrar reseñas del usuario
        resenaRepository.findByUsuarioId(id).forEach(r -> resenaRepository.deleteById(r.getId()));
        //Borrar empresa del usuario si tiene
        empresaRepository.findByUsuarioId(id).ifPresent(e -> empresaRepository.deleteById(e.getId()));
        //Borrar el usuario
        usuarioRepository.deleteById(id);
    }

}
