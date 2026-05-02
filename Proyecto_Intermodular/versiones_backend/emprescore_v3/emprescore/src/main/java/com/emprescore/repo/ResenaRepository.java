package com.emprescore.repo;

import com.emprescore.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    List<Resena> findByEmpresaId(Long empresaId);

    List<Resena> findByUsuarioId(Long usuarioId);
}