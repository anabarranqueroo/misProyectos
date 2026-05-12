package com.emprescore.service;

import com.emprescore.model.EstadoReporte;
import com.emprescore.model.ReporteResena;
import com.emprescore.repo.ReporteResenaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReporteResenaService {

    private final ReporteResenaRepository reporteRepository;

    public ReporteResenaService(ReporteResenaRepository reporteRepository) {
        this.reporteRepository = reporteRepository;
    }

    public List<ReporteResena> findAll() {
        return reporteRepository.findAll();
    }

    public ReporteResena findById(Long id) {
        return reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
    }

    public ReporteResena save(ReporteResena reporte) {
        return reporteRepository.save(reporte);
    }

    public ReporteResena aprobar(Long id) {
        ReporteResena reporte = findById(id);
        reporte.setEstado(EstadoReporte.APROBADA);
        return reporteRepository.save(reporte);
    }

    public ReporteResena rechazar(Long id) {
        ReporteResena reporte = findById(id);
        reporte.setEstado(EstadoReporte.RECHAZADA);
        return reporteRepository.save(reporte);
    }

    public void delete(Long id) {
        reporteRepository.deleteById(id);
    }
}
