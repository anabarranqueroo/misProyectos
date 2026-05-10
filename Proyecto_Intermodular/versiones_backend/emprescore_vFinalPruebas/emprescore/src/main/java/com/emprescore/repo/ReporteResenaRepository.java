package com.emprescore.repo;

import com.emprescore.model.ReporteResena;
import com.emprescore.model.EstadoReporte;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReporteResenaRepository extends JpaRepository<ReporteResena, Long>{
    //Busca reportes por estado
    List<ReporteResena> findByEstado(EstadoReporte estado);
    //Busca reportes por reseña
    List<ReporteResena> findByResenaId(Long resenaId);
    //Busca reportes por usuario
    List<ReporteResena> findByUsuarioId(Long usuarioId);
}
