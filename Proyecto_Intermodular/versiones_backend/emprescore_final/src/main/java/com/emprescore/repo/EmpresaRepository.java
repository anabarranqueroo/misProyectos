package com.emprescore.repo;

import com.emprescore.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    //Búsqueda por id
    List<Empresa> findByCategoriaId(Long categoriaId);
    //Filtro por categoría
    List<Empresa> findByNombreContainingIgnoreCase(String nombre);
    //Búsqueda y filtro combinados
    List<Empresa> findByNombreContainingIgnoreCaseAndCategoriaId(String nombre,Long categoriaId);
    //Buscar empresa por usuario
    Optional<Empresa> findByUsuarioId(Long usuarioId);
}