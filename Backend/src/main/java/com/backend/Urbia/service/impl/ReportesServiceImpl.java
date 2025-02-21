package com.backend.urbia.service.impl;

import com.backend.urbia.dto.request.ReporteRequest;
import com.backend.urbia.dto.response.ReporteResponse;
import com.backend.urbia.exception.ValidacionException;
import com.backend.urbia.model.Reportes;
import com.backend.urbia.repository.ReportesRepository;
import com.backend.urbia.service.integration.AIService;
import com.backend.urbia.service.integration.GoogleCloudStorageService;
import com.backend.urbia.util.GeoUtils;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReporteServiceImpl {

    private final ReportesRepository reportesRepository;
    private final AIService aiService;
    private final GoogleCloudStorageService googleCloudStorageService;

    @Autowired
    public ReporteServiceImpl(ReportesRepository reportesRepository, AIService aiService, GoogleCloudStorageService googleCloudStorageService) {
        this.reportesRepository = reportesRepository;
        this.aiService = aiService;
        this.googleCloudStorageService = googleCloudStorageService;
    }

    public ReporteResponse createReporte(ReporteRequest reporteRequest, MultipartFile[] archivos) {
        // Validaciones básicas
        if (reporteRequest.getTitulo() == null || reporteRequest.getTitulo().isEmpty()) {
            throw new ValidacionException("El título es obligatorio");
        }

        // Convertir coordenadas (lng, lat) a Point
        Point ubicacion = GeoUtils.createPoint(reporteRequest.getLng(), reporteRequest.getLat());

        // Generar resumen mediante el servicio de IA
        String resumenIA = aiService.generateSummary(reporteRequest);

        // Subir archivos a Google Cloud Storage
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile archivo : archivos) {
            String fileUrl = googleCloudStorageService.uploadFileToGCS(archivo);
            fileUrls.add(fileUrl);
        }

        // Crear la entidad Reportes
        Reportes reporte = new Reportes();
        reporte.setTitulo(reporteRequest.getTitulo());
        reporte.setDescripcion(reporteRequest.getDescripcion());
        reporte.setResumenIA(resumenIA);
        reporte.setUbicacion(ubicacion);
        reporte.setFechaCreacion(LocalDateTime.now());
        reporte.setArchivos(fileUrls);  // Suponiendo que tu entidad Reportes tiene un campo para las URLs

        // Guardar en la base de datos
        Reportes savedReporte = reportesRepository.save(reporte);

        // Mapear a DTO de respuesta
        ReporteResponse response = new ReporteResponse();
        response.setId(savedReporte.getId());
        response.setTitulo(savedReporte.getTitulo());
        response.setDescripcion(savedReporte.getDescripcion());
        response.setResumenIA(savedReporte.getResumenIA());
        response.setUbicacion(GeoUtils.convertPointToGeoJSON(savedReporte.getUbicacion()));
        response.setArchivos(savedReporte.getArchivos());  // Incluir las URLs de los archivos en la respuesta

        return response;
    }
}




