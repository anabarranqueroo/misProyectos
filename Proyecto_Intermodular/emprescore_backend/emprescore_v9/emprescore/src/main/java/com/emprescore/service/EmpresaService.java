package com.emprescore.service;

import com.emprescore.model.Empresa;
import com.emprescore.repo.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
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

        return empresaRepository.save(existente);
    }

    public void delete(Long id) {
        if (!empresaRepository.existsById(id)) {
            throw new RuntimeException("Empresa no encontrada");
        }
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
