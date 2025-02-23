package com.nocountry.Urbia.Controller;

import com.nocountry.Urbia.dto.ReporteDTO;
import com.nocountry.Urbia.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    // Endpoint para crear un reporte
    @PostMapping
    public ResponseEntity<ReporteDTO> crearReporte(@RequestBody ReporteDTO reporteDTO) {
        ReporteDTO nuevoReporte = reporteService.crearReporte(reporteDTO);
        return new ResponseEntity<>(nuevoReporte, HttpStatus.CREATED);
    }

    // Endpoint para listar todos los reportes
    @GetMapping
    public ResponseEntity<List<ReporteDTO>> listarReportes() {
        List<ReporteDTO> reportes = reporteService.listarReportes();
        return ResponseEntity.ok(reportes);
    }

    // Endpoint para actualizar un reporte
    @PutMapping("/{id}")
    public ResponseEntity<ReporteDTO> actualizarReporte(@PathVariable Long id, @RequestBody ReporteDTO reporteDTO) {
        ReporteDTO actualizado = reporteService.actualizarReporte(id, reporteDTO);
        return ResponseEntity.ok(actualizado);
    }

    // Endpoint para eliminar un reporte
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReporte(@PathVariable Long id) {
        reporteService.eliminarReporte(id);
        return ResponseEntity.noContent().build();
    }
    // Endpoint para obtener reportes por usuarioId
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReporteDTO>> getReportesByUsuario(@PathVariable Long usuarioId) {
        List<ReporteDTO> reportes = reporteService.getReportesByUsuario(usuarioId);
        return ResponseEntity.ok(reportes);
    }
}