package com.emprescore.service;

import com.emprescore.model.Resena;
import com.emprescore.repo.ResenaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResenaService {

    private final ResenaRepository resenaRepository;

    public ResenaService(ResenaRepository resenaRepository) {
        this.resenaRepository = resenaRepository;
    }

    public List<Resena> findAll() {
        return resenaRepository.findAll();
    }

    public Resena findById(Long id) {
        return resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
    }

    public List<Resena> findByEmpresa(Long empresaId) {
        return resenaRepository.findByEmpresaId(empresaId);
    }

    public Resena save(Resena resena) {
        return resenaRepository.save(resena);
    }

    public void delete(Long id) {
        resenaRepository.deleteById(id);
    }
}