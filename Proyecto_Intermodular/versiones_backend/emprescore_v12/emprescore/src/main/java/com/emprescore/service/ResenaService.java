package com.emprescore.service;

import com.emprescore.model.Resena;
import com.emprescore.repo.ResenaRepository;
import org.springframework.stereotype.Service;
import com.emprescore.model.EstadoReporte;
import java.sql.Timestamp;
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

    public List<Resena> findByUsuario(Long usuarioId) {
        return resenaRepository.findByUsuarioId(usuarioId);
    }

    public Resena save(Resena resena) {
        return resenaRepository.save(resena);
    }

    public void delete(Long id) {
        resenaRepository.deleteById(id);
    }

    public List<Resena> findPendientes() {
        return resenaRepository.findByEstado(EstadoReporte.PENDIENTE);
    }

    public Double mediaEstrellas(Long empresaId) {
        Double media = resenaRepository.calcularMediaEstrellas(empresaId);
        return media != null ? media : 0.0;
    }

    public Resena aprobar(Long id) {
        Resena resena = findById(id);
        resena.setEstado(EstadoReporte.APROBADA);
        resena.setFecha_actualizacion(new Timestamp(System.currentTimeMillis()));
        return resenaRepository.save(resena);
    }

    public Resena rechazar(Long id) {
        Resena resena = findById(id);
        resena.setEstado(EstadoReporte.RECHAZADA);
        resena.setFecha_actualizacion(new Timestamp(System.currentTimeMillis()));
        return resenaRepository.save(resena);
    }

    public Resena responder(Long id, String respuesta) {
        Resena resena = findById(id);
        resena.setRespuesta(respuesta);
        resena.setFecha_actualizacion(new Timestamp(System.currentTimeMillis()));
        return resenaRepository.save(resena);
    }
}
