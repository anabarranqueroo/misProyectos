package com.emprescore.controller;

import com.emprescore.model.ReporteResena;
import com.emprescore.service.ReporteResenaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteResenaController {

    private final ReporteResenaService service;

    public ReporteResenaController(ReporteResenaService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReporteResena> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ReporteResena obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ReporteResena crear(@RequestBody ReporteResena reporte) {
        return service.save(reporte);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}