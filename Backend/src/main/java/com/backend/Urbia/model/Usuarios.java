package com.nocountry.Urbia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@Entity
public class Usuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "El correo es obligatorio")
    private String email;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reportes> reportes;

    public void agregarReporte(Reportes reporte) {
        reportes.add(reporte);
        reporte.setUsuario(this);
    }

    public Usuarios() {
    }


    public Usuarios(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Reportes> getReportes() {
        return reportes;
    }

    public void setReportes(List<Reportes> reportes) {
        this.reportes = reportes;
    }
}
