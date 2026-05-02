package com.emprescore.controller;

import com.emprescore.model.Empresa;
import com.emprescore.service.EmpresaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Empresa> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Empresa obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Empresa> porCategoria(@PathVariable Long categoriaId) {
        return service.findByCategoria(categoriaId);
    }

    @PostMapping
    public Empresa crear(@RequestBody Empresa empresa) {
        return service.save(empresa);
    }

    @PutMapping("/{id}")
    public Empresa actualizar(@PathVariable Long id, @RequestBody Empresa empresa) {
        return service.update(id, empresa);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}