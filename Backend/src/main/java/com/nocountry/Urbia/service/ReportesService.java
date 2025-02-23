package com.nocountry.Urbia.service;

import com.nocountry.Urbia.model.Reportesv1;
import com.nocountry.Urbia.repository.ReportesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportesService {

    @Autowired
    private ReportesRepository reportesRepository;

    public List<Reportesv1> obtenerReportes() {
        return reportesRepository.findAll();
    }

    public Optional<Reportesv1> obtenerPorId(Long id) {
        return reportesRepository.findById(id);
    }

    public Reportesv1 guardarReportes(Reportesv1 reportes) {
        if (reportes.getTitulo() == null || reportes.getTitulo().isEmpty()) {
            throw new IllegalArgumentException("El título no puede estar vacío");
        }
        if (reportes.getDescripcion() == null || reportes.getDescripcion().isEmpty()) {
            throw new IllegalArgumentException("La descripción no puede estar vacía");
        }
        return reportesRepository.save(reportes);
    }
}



