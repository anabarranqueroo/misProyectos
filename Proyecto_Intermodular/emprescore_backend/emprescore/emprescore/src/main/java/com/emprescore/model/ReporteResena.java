package com.emprescore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.sql.Timestamp;

@Entity
@Table(name = "reportes_resenas")
public class ReporteResena {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_resena", nullable = false)
    private Resena resena;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @NotBlank
    private String motivo;

    @Column(nullable = false, updatable = false)
    private Timestamp fecha_creacion = new Timestamp(System.currentTimeMillis());

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReporte estado = EstadoReporte.PENDIENTE;

    public Long getId() {
        return id;
    }

    public Resena getResena() {
        return resena;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public String getMotivo() {
        return motivo;
    }

    public Timestamp getFecha_creacion() {
        return fecha_creacion;
    }

    public EstadoReporte getEstado() {
        return estado;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setResena(Resena resena) {
        this.resena = resena;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public void setFecha_creacion(Timestamp fecha_creacion) {
        this.fecha_creacion = fecha_creacion;
    }

    public void setEstado(EstadoReporte estado) {
        this.estado = estado;
    }
    
    
}
