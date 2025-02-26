package com.nocountry.urbia.repository;

import com.nocountry.urbia.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    // Método para buscar reportes por usuarioId
    List<Reporte> findByUsuarioId(Long usuarioId);
}
