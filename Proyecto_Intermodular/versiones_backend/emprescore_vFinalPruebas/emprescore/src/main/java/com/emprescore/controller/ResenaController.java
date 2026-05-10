package com.emprescore.controller;

import com.emprescore.model.Resena;
import com.emprescore.service.ResenaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    private final ResenaService service;

    public ResenaController(ResenaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Resena> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Resena obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/empresa/{empresaId}")
    public List<Resena> porEmpresa(@PathVariable Long empresaId) {
        return service.findByEmpresa(empresaId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Resena> porUsuario(@PathVariable Long usuarioId) {
        return service.findByUsuario(usuarioId);
    }

    @GetMapping("/empresa/{empresaId}/valoracion")
    public Double valoracion(@PathVariable Long empresaId) {
        return service.mediaEstrellas(empresaId);
    }

    @PostMapping
    public Resena crear(@RequestBody Resena resena) {
        return service.save(resena);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }

    //ADMIN
    @GetMapping("/pendientes")
    public List<Resena> pendientes() {
        return service.findPendientes();
    }

    @PutMapping("/{id}/aprobar")
    public Resena aprobar(@PathVariable Long id) {
        return service.aprobar(id);
    }

    @PutMapping("/{id}/rechazar")
    public Resena rechazar(@PathVariable Long id) {
        return service.rechazar(id);
    }

    @PutMapping("/{id}/responder")
    public Resena responder(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        return service.responder(id, datos.get("respuesta"));
    }
}
