package com.nocountry.Urbia.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reportes")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // URL de la imagen o audio
    @Column(name = "url_medio")
    private String urlMedio;

    // Descripción original del incidente
    @Column(length = 500)
    private String descripcion;

    // Fecha y hora del reporte
    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    // Coordenadas: latitud y longitud
    private Double latitud;
    private Double longitud;

    // Relación con Categoría
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    // Relación con Usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Getters & Setters

    public Reporte() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrlMedio() {
        return urlMedio;
    }

    public void setUrlMedio(String urlMedio) {
        this.urlMedio = urlMedio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }





    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }



}
