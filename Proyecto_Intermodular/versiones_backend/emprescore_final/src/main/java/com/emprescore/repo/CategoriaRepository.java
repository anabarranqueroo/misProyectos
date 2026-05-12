package com.emprescore.repo;


import com.emprescore.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    //Verifica si ya existen las categorias antes de crearlas
    boolean existsByNombreIgnoreCase(String nombre);
}
