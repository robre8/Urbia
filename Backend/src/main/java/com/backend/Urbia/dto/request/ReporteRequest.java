package com.backend.urbia.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReporteRequest {
    private String titulo;
    private String descripcion;
    private String categoria;
    private double latitud;
    private double longitud;
    private String imagenUrl;
}
