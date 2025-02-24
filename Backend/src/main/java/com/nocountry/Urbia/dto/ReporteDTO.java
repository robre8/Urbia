package com.nocountry.Urbia.dto;

import java.time.LocalDateTime;

public class ReporteDTO {

    private Long id;
    private String urlMedio;
    private String descripcion;
    private String descripcionDespuesDeIa;  // Nuevo campo para la descripción mejorada por IA
    private LocalDateTime fechaHora;
    private Double latitud;
    private Double longitud;
    private Long categoriaId;
    private Long usuarioId;

    public ReporteDTO() {
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

    public String getDescripcionDespuesDeIa() {
        return descripcionDespuesDeIa;
    }

    public void setDescripcionDespuesDeIa(String descripcionDespuesDeIa) {
        this.descripcionDespuesDeIa = descripcionDespuesDeIa;
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

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}
