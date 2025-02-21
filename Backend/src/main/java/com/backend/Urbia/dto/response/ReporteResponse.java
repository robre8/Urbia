package com.backend.urbia.dto.response;

public class ReporteResponse {

    private Long id;
    private String titulo;
    private String descripcion;
    private String resumenIA;
    // Se espera que este campo contenga un objeto GeoJSON en formato String
    private String ubicacion;

    public ReporteResponse() {}

    public ReporteResponse(Long id, String titulo, String descripcion, String resumenIA, String ubicacion) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.resumenIA = resumenIA;
        this.ubicacion = ubicacion;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getResumenIA() {
        return resumenIA;
    }

    public void setResumenIA(String resumenIA) {
        this.resumenIA = resumenIA;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }
}
