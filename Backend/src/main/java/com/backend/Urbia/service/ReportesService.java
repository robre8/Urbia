package com.nocountry.Urbia.service;

import com.nocountry.Urbia.model.Reportes;
import com.nocountry.Urbia.repository.ReportesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportesService {

    @Autowired
    private ReportesRepository reportesRepository;

    public List<Reportes> obtenerReportes() {
        return reportesRepository.findAll();
    }

    public Optional<Reportes> obtenerPorId(Long id) {
        return reportesRepository.findById(id);
    }

    public Reportes guardarReportes(Reportes reportes) {
        if (reportes.getTitulo() == null || reportes.getTitulo().isEmpty()) {
            throw new IllegalArgumentException("El título no puede estar vacío");
        }
        if (reportes.getDescripcion() == null || reportes.getDescripcion().isEmpty()) {
            throw new IllegalArgumentException("La descripción no puede estar vacía");
        }
        return reportesRepository.save(reportes);
    }
}



