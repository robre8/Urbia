package com.nocountry.urbia.model;


import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre o identificador del usuario
    private String nombre;

    public Usuario() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
