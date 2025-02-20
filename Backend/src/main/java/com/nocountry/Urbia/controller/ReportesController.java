package com.nocountry.Urbia.controller;

import com.nocountry.Urbia.model.Reportes;
import com.nocountry.Urbia.model.Usuarios;
import com.nocountry.Urbia.service.ReportesService;
import com.nocountry.Urbia.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    @Autowired
    private ReportesService reportesService;

    @Autowired
    private UsuariosService usuariosService;

    @PostMapping
    public ResponseEntity<?> crearReportes(@RequestBody Reportes reportes, @RequestParam Long usuarioId) {
        try {
            Optional<Usuarios> usuarioOpt = usuariosService.obtenerPorId(usuarioId);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }

            Usuarios usuario = usuarioOpt.get();
            usuario.agregarReporte(reportes);
            Reportes nuevoReporte = reportesService.guardarReportes(reportes);
            return ResponseEntity.ok(nuevoReporte);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Reportes>> obtenerReportes() {
        List<Reportes> reportes = reportesService.obtenerReportes();
        if (reportes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reportes> obtenerReportePorId(@PathVariable Long id) {
        return reportesService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
