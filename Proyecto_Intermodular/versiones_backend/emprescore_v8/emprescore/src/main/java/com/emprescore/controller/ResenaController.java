package com.emprescore.controller;

import com.emprescore.model.Resena;
import com.emprescore.service.ResenaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}