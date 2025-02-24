package com.nocountry.Urbia.repository;


import com.nocountry.Urbia.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    // Método para buscar reportes por usuarioId
    List<Reporte> findByUsuarioId(Long usuarioId);
}