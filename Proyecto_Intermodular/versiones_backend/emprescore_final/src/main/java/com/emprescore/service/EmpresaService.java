package com.emprescore.service;

import com.emprescore.model.Empresa;
import com.emprescore.repo.EmpresaRepository;
import com.emprescore.repo.ResenaRepository;
import com.emprescore.repo.ReporteResenaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final ResenaRepository resenaRepository;
    private final ReporteResenaRepository reporteRepository;

    public EmpresaService(EmpresaRepository empresaRepository, ResenaRepository resenaRepository, ReporteResenaRepository reporteRepository) {
        this.empresaRepository = empresaRepository;
        this.resenaRepository = resenaRepository;
        this.reporteRepository = reporteRepository;
    }

    public List<Empresa> findAll() {
        return empresaRepository.findAll();
    }

    public Empresa findById(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }

    public List<Empresa> findByCategoria(Long categoriaId) {
        return empresaRepository.findByCategoriaId(categoriaId);
    }

    public Empresa save(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    public Empresa update(Long id, Empresa cambios) {
        Empresa existente = findById(id);

        existente.setNombre(cambios.getNombre());
        existente.setDescripcion(cambios.getDescripcion());
        existente.setCategoria(cambios.getCategoria());
        existente.setTelefono(cambios.getTelefono());
        existente.setEmailContacto(cambios.getEmailContacto());
        existente.setWeb(cambios.getWeb());
        return empresaRepository.save(existente);
    }

    @Transactional
    public void delete(Long id) {
        if (!empresaRepository.existsById(id)) {
            throw new RuntimeException("Empresa no encontrada");
        }
        // 1. Borrar reportes de las reseñas de la empresa
        resenaRepository.findByEmpresaId(id).forEach(resena -> {
            reporteRepository.findByResenaId(resena.getId())
                .forEach(r -> reporteRepository.deleteById(r.getId()));
        });
        // 2. Borrar reseñas de la empresa
        resenaRepository.findByEmpresaId(id)
            .forEach(r -> resenaRepository.deleteById(r.getId()));
        // 3. Borrar la empresa
        empresaRepository.deleteById(id);
    }

    public List<Empresa> buscar(String nombre, Long categoriaId) {
        if (nombre != null && categoriaId != null) {
            return empresaRepository.findByNombreContainingIgnoreCaseAndCategoriaId(nombre, categoriaId);
        } else if (nombre != null && !nombre.isBlank()) {
            return empresaRepository.findByNombreContainingIgnoreCase(nombre);
        } else if (categoriaId != null) {
            return empresaRepository.findByCategoriaId(categoriaId);
        }
        return empresaRepository.findAll();
    }
}
