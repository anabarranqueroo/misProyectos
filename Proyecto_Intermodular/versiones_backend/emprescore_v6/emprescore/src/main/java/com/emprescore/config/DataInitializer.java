package com.emprescore.config;

import com.emprescore.model.Categoria;
import com.emprescore.model.Rol;
import com.emprescore.model.Usuario;
import com.emprescore.repo.CategoriaRepository;
import com.emprescore.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UsuarioService usuarioService, PasswordEncoder passwordEncoder, CategoriaRepository categoriaRepository) {
        return args -> {
            //ADMIN
            try {
                usuarioService.findByEmail("admin@emprescore.com");
                System.out.println(">>> Admin ya existe");
            } catch (RuntimeException e) {
                Usuario admin = new Usuario();
                admin.setNombre("Admin");
                admin.setEmail("admin@emprescore.com");
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setRol(Rol.ADMIN);
                usuarioService.save(admin);
                System.out.println("Admin creado correctamente");
            }
            
            ///CATEGORÍAS
            List<String[]> categorias = List.of(
                new String[]{"Restaurantes y Comida", "Restaurantes, bares, cafeterías y delivery"},
                new String[]{"Tecnología", "Tiendas de electrónica, software y servicios tech"},
                new String[]{"Salud y Bienestar", "Clínicas, farmacias, gimnasios y spas"},
                new String[]{"Moda y Ropa", "Tiendas de ropa, calzado y accesorios"},
                new String[]{"Hogar y Construcción", "Muebles, reformas y servicios del hogar"},
                new String[]{"Educación", "Academias, cursos y formación"},
                new String[]{"Viajes y Turismo", "Hoteles, agencias de viaje y alojamientos"},
                new String[]{"Servicios Financieros", "Bancos, seguros y asesorías"},
                new String[]{"Transporte y Logística", "Mensajería, mudanzas y transporte"},
                new String[]{"Comercio Online", "Tiendas online y marketplaces"}
            );
            for (String[] cat : categorias) {
                if (!categoriaRepository.existsByNombreIgnoreCase(cat[0])) {
                    Categoria categoria = new Categoria();
                    categoria.setNombre(cat[0]);
                    categoria.setDescripcion(cat[1]);
                    categoriaRepository.save(categoria);
                    System.out.println(">>> Categoría creada: " + cat[0]);
                }
            }
            System.out.println(">>> Categorías inicializadas correctamente");
        };
    }
}