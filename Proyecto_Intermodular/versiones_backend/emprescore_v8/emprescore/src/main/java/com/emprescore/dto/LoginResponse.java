package com.emprescore.dto;

import com.emprescore.model.Rol;

public class LoginResponse {

    private Long id;
    private String nombre;
    private String email;
    private Rol rol;

    public LoginResponse(Long id, String nombre, String email, Rol rol) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public Rol getRol() {
        return rol;
    }
}
