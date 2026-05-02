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

    @PostMapping
    public Resena crear(@RequestBody Resena resena) {
        return service.save(resena);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}