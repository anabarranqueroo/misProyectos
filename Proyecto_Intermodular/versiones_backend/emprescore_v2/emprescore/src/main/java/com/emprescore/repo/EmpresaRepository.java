package com.emprescore.repo;

import com.emprescore.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    List<Empresa> findByCategoriaId(Long categoriaId);
}