package com.nocountry.urbia.controller;


import com.nocountry.urbia.dto.request.ReporteDTO;
import com.nocountry.urbia.service.integration.S3Service;
import com.nocountry.urbia.service.impl.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/reporte")
public class ReporteControllerFinal {

    @Autowired
    private ReporteService reporteService;

    @Autowired
    private S3Service s3Service;  // Se agrega la inyección de S3Service

    @Autowired
    private WebSocketController webSocketController;

    // Endpoint para crear un reporte
    @PostMapping
    public ResponseEntity<ReporteDTO> crearReporte(@RequestBody ReporteDTO reporteDTO) {
        ReporteDTO nuevoReporte = reporteService.crearReporte(reporteDTO);
        // En caso de que no se elimine este endpoint agregar:
        // webSocketController.notificarNuevoReporte("Nuevo reporte creado");

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

    // Endpoint combinado para cargar imagen y crear reporte
    @PostMapping("/combinado")
    public ResponseEntity<ReporteDTO> crearReporteConImagen(
            @RequestPart("audio") MultipartFile audio,
            @RequestPart("imagen") MultipartFile imagen,
            @RequestPart("reporte") ReporteDTO reporteDTO) {
        // Sube el audio a S3 y obtiene la URL
        String audioUrl = s3Service.uploadFile(audio);
        // Sube la imagen
        String imageUrl = s3Service.uploadFile(imagen);
        // Asigna la URL al reporte
        reporteDTO.setUrlAudio(audioUrl);
        reporteDTO.setUrlImagen(imageUrl);
        // Crea el reporte con los datos actualizados
        ReporteDTO nuevoReporte = reporteService.crearReporte(reporteDTO);

        webSocketController.notificarNuevoReporte("Nuevo reporte con imagen/audio creado ");

        return new ResponseEntity<>(nuevoReporte, HttpStatus.CREATED);
    }
}
