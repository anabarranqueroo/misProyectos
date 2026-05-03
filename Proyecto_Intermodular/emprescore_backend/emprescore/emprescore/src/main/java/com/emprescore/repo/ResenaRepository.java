package com.emprescore.repo;

import com.emprescore.model.EstadoReporte;
import com.emprescore.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    //Reseñas de la empresa
    List<Resena> findByEmpresaId(Long empresaId);
    //Reseñas del usuario
    List<Resena> findByUsuarioId(Long usuarioId);
    // Reseñas por empresa y estado (mostrar solo aprobadas al público)
    List<Resena> findByEmpresaIdAndEstado(Long empresaId, EstadoReporte estado);
    // Reseñas pendientes para el admin
    List<Resena> findByEstado(EstadoReporte estado);
    // Media de estrellas de una empresa (solo reseñas aprobadas)
    @Query("SELECT AVG(r.estrella) FROM Resena r WHERE r.empresa.id = :empresaId AND r.estado = 'APROBADA'")
    Double calcularMediaEstrellas(Long empresaId);
}