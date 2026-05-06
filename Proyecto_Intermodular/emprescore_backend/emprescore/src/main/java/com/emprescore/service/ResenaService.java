package com.emprescore.service;

import com.emprescore.model.EstadoReporte;
import com.emprescore.model.Resena;
import com.emprescore.repo.ReporteResenaRepository;
import com.emprescore.repo.ResenaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Timestamp;
import java.util.List;

@Service
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final ReporteResenaRepository reporteRepository;

    public ResenaService(ResenaRepository resenaRepository, ReporteResenaRepository reporteRepository) {
        this.resenaRepository = resenaRepository;
        this.reporteRepository = reporteRepository;
    }

    public List<Resena> findAll() {
        return resenaRepository.findAll();
    }

    public Resena findById(Long id) {
        return resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
    }

    public List<Resena> findByEmpresa(Long empresaId) {
        return resenaRepository.findByEmpresaIdAndEstado(empresaId, EstadoReporte.APROBADA);
    }

    public List<Resena> findByUsuario(Long usuarioId) {
        return resenaRepository.findByUsuarioId(usuarioId);
    }

    public Resena save(Resena resena) {
        return resenaRepository.save(resena);
    }

    // Borra primero los reportes asociados antes de borrar la reseña
    @Transactional
    public void delete(Long id) {
        reporteRepository.findByResenaId(id).forEach(r -> reporteRepository.deleteById(r.getId()));
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