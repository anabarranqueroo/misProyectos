package com.emprescore.controller;

import com.emprescore.model.Categoria;
import com.emprescore.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    // Obtener todas las categorías
    @GetMapping
    public List<Categoria> listar() {
        return service.findAll();
    }

    // Obtener categoría por ID
    @GetMapping("/{id}")
    public Categoria obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    // Crear nueva categoría
    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        return service.save(categoria);
    }

    // Actualizar categoría
    @PutMapping("/{id}")
    public Categoria actualizar(@PathVariable Long id, @RequestBody Categoria categoria) {
        categoria.setId(id);
        return service.save(categoria);
    }

    // Eliminar categoría
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}