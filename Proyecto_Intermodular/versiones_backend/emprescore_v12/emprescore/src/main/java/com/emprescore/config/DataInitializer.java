package com.emprescore.config;

import com.emprescore.model.*;
import com.emprescore.repo.*;
import com.emprescore.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UsuarioService usuarioService,
            PasswordEncoder passwordEncoder,
            CategoriaRepository categoriaRepository,
            EmpresaRepository empresaRepository,
            ResenaRepository resenaRepository,
            ReporteResenaRepository reporteRepository
    ) {
        return args -> {

            // ADMIN 
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
                System.out.println(">>> Admin creado correctamente");
            }

            // USUARIO USER 
            Usuario user1 = null;
            try {
                user1 = usuarioService.findByEmail("anaestbar30@gmail.com");
                System.out.println(">>> Usuario Ana ya existe");
            } catch (RuntimeException e) {
                user1 = new Usuario();
                user1.setNombre("Ana Esteban");
                user1.setEmail("anaestbar30@gmail.com");
                user1.setPassword(passwordEncoder.encode("ana1234"));
                user1.setRol(Rol.USER);
                user1 = usuarioService.save(user1);
                System.out.println(">>> Usuario Ana creado correctamente");
            }

            // USUARIO EMPRESA 
            Usuario empresaUser = null;
            try {
                empresaUser = usuarioService.findByEmail("pepe@gmail.com");
                System.out.println(">>> Usuario Pepe ya existe");
            } catch (RuntimeException e) {
                empresaUser = new Usuario();
                empresaUser.setNombre("Pepe");
                empresaUser.setEmail("pepe@gmail.com");
                empresaUser.setPassword(passwordEncoder.encode("pepe1234"));
                empresaUser.setRol(Rol.EMPRESA);
                empresaUser = usuarioService.save(empresaUser);
                System.out.println(">>> Usuario Empresa Pepe creado correctamente");
            }

            // CATEGORIAS 
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

            // EMPRESAS 
            if (empresaRepository.count() == 0) {
                List<Categoria> cats = categoriaRepository.findAll();
                Usuario admin = usuarioService.findByEmail("admin@emprescore.com");

                List<String[]> empresasData = List.of(
                    new String[]{"Restaurante El Rincón", "Cocina mediterránea tradicional con ambiente acogedor y productos frescos de temporada", "0", ""},
                    new String[]{"La Taberna del Puerto", "Especialistas en mariscos y pescados frescos directos del puerto", "0", ""},
                    new String[]{"TechSolutions", "Empresa líder en desarrollo de software a medida y consultoría tecnológica", "1", "pepe@gmail.com"},
                    new String[]{"InnovaCode", "Startup especializada en aplicaciones móviles e inteligencia artificial", "1", ""},
                    new String[]{"Clínica Salud Plus", "Centro médico multiespecialidad con los mejores profesionales sanitarios", "2", ""},
                    new String[]{"FisioVida", "Centro de fisioterapia y rehabilitación deportiva con tecnología avanzada", "2", ""},
                    new String[]{"Moda Urban", "Tienda de ropa urbana y accesorios de las mejores marcas nacionales e internacionales", "3", ""},
                    new String[]{"Eleganza Boutique", "Moda exclusiva para mujer con diseños únicos y personalizados", "3", ""},
                    new String[]{"Construye Fácil", "Empresa de reformas integrales y construcción con más de 20 años de experiencia", "4", ""},
                    new String[]{"AcademiaPlus", "Centro de formación online y presencial con cursos certificados", "5", ""},
                    new String[]{"Viajes Aventura", "Agencia de viajes especializada en turismo de aventura y experiencias únicas", "6", ""},
                    new String[]{"FinanzasPro", "Asesoría financiera y contable para empresas y autónomos", "7", ""},
                    new String[]{"TransLog", "Empresa de transporte y logística con cobertura nacional e internacional", "8", ""},
                    new String[]{"ShopOnline", "Marketplace con miles de productos de todas las categorías con envío rápido", "9", ""}
                );

                for (String[] data : empresasData) {
                    Empresa empresa = new Empresa();
                    empresa.setNombre(data[0]);
                    empresa.setDescripcion(data[1]);
                    empresa.setCategoria(cats.get(Integer.parseInt(data[2])));
                    if (!data[3].isEmpty()) {
                        empresa.setUsuario(empresaUser);
                    } else {
                        empresa.setUsuario(admin);
                    }
                    empresaRepository.save(empresa);
                }
                System.out.println(">>> Empresas creadas correctamente");

                // RESEÑAS 
                if (resenaRepository.count() == 0 && user1 != null) {
                    List<Empresa> empresas = empresaRepository.findAll();

                    List<String[]> resenasData = List.of(
                        new String[]{"Excelente servicio", "Una experiencia increíble, el personal muy amable y la comida deliciosa. Totalmente recomendable.", "5", "0"},
                        new String[]{"Muy buen restaurante", "La comida estaba muy buena y el servicio fue rápido y atento. Volvería sin duda.", "4", "1"},
                        new String[]{"Mejorable", "El local estaba bien pero la atención podría mejorar bastante. Esperaba más.", "3", "3"},
                        new String[]{"Gran empresa tech", "Nos desarrollaron una app excelente, muy profesionales y puntuales.", "5", "2"},
                        new String[]{"Buenos desarrolladores", "Cumplieron con los plazos y el resultado fue muy bueno. Recomendables.", "4", "8"},
                        new String[]{"Recomendable", "Servicio de fisioterapia excelente, mejoré en pocas sesiones.", "5", "5"},
                        new String[]{"Muy profesionales", "Los médicos son muy atentos y el diagnóstico fue acertado.", "5", "4"},
                        new String[]{"Buena ropa", "Encuentras ropa de calidad a buen precio y muy buen trato.", "4", "6"},
                        new String[]{"Gran academia", "Los cursos son muy completos y los profesores excelentes.", "5", "9"},
                        new String[]{"Viaje increíble", "Organizaron un viaje de aventura que superó todas mis expectativas.", "5", "10"}
                    );

                    for (String[] data : resenasData) {
                        Resena resena = new Resena();
                        resena.setTitulo(data[0]);
                        resena.setContenido(data[1]);
                        resena.setEstrella(Integer.parseInt(data[2]));
                        resena.setEmpresa(empresas.get(Integer.parseInt(data[3])));
                        resena.setUsuario(user1);
                        resena.setEstado(EstadoReporte.APROBADA);
                        resenaRepository.save(resena);
                    }
                    System.out.println(">>> Reseñas creadas correctamente");

                    // REPORTES
                    if (reporteRepository.count() == 0) {
                        List<Resena> resenas = resenaRepository.findAll();

                        ReporteResena reporte1 = new ReporteResena();
                        reporte1.setMotivo("Esta reseña parece falsa y no refleja la realidad del servicio");
                        reporte1.setResena(resenas.get(2));
                        reporte1.setUsuario(user1);
                        reporte1.setEstado(EstadoReporte.PENDIENTE);
                        reporteRepository.save(reporte1);

                        System.out.println(">>> Reportes creados correctamente");
                    }
                }
            }
        };
    }
}