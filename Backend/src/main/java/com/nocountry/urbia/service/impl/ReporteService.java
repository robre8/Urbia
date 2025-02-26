package com.nocountry.urbia.service.impl;

import com.nocountry.urbia.dto.request.ReporteDTO;
import com.nocountry.urbia.model.Categoria;
import com.nocountry.urbia.model.Reporte;
import com.nocountry.urbia.model.Usuarios;
import com.nocountry.urbia.repository.CategoriaRepository;
import com.nocountry.urbia.repository.ReporteRepository;
import com.nocountry.urbia.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuariosRepository usuarioRepository;

    // Crear reporte
    public ReporteDTO crearReporte(ReporteDTO reporteDTO) {
        Reporte reporte = new Reporte();
        reporte.setUrlAudio(reporteDTO.getUrlAudio());
        reporte.setUrlImagen(reporteDTO.getUrlImagen());
        reporte.setTitulo(reporteDTO.getTitulo());
        reporte.setDescripcion(reporteDTO.getDescripcion());
        // Se asigna la fecha y hora actuales
        reporte.setFechaHora(LocalDateTime.now());
        reporte.setLatitud(reporteDTO.getLatitud());
        reporte.setLongitud(reporteDTO.getLongitud());

        // Buscar y asignar la categoría
        Categoria categoria = categoriaRepository.findById(reporteDTO.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        reporte.setCategoria(categoria);

        // Buscar y asignar el usuario
        Usuarios usuario = usuarioRepository.findById(reporteDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        reporte.setUsuario(usuario);

        Reporte reporteGuardado = reporteRepository.save(reporte);
        return mapearDTO(reporteGuardado);
    }

    // Listar todos los reportes
    public List<ReporteDTO> listarReportes() {
        List<Reporte> reportes = reporteRepository.findAll();
        return reportes.stream().map(this::mapearDTO).collect(Collectors.toList());
    }

    // Actualizar reporte
    public ReporteDTO actualizarReporte(Long id, ReporteDTO reporteDTO) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));

        reporte.setUrlAudio(reporteDTO.getUrlAudio());
        reporte.setUrlImagen(reporteDTO.getUrlImagen());
        reporte.setDescripcion(reporteDTO.getDescripcion());
        // Se puede actualizar la fecha, o mantener la original según la lógica de negocio
        reporte.setLatitud(reporteDTO.getLatitud());
        reporte.setLongitud(reporteDTO.getLongitud());

        if (reporteDTO.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(reporteDTO.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            reporte.setCategoria(categoria);
        }

        if (reporteDTO.getUsuarioId() != null) {
            Usuarios usuario = usuarioRepository.findById(reporteDTO.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            reporte.setUsuario(usuario);
        }

        Reporte reporteActualizado = reporteRepository.save(reporte);
        return mapearDTO(reporteActualizado);
    }

    // Eliminar reporte
    public void eliminarReporte(Long id) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
        reporteRepository.delete(reporte);
    }

    // Método para obtener reportes por usuarioId
    public List<ReporteDTO> getReportesByUsuario(Long usuarioId) {
        List<Reporte> reportes = reporteRepository.findByUsuarioId(usuarioId);
        return reportes.stream().map(this::mapearDTO).collect(Collectors.toList());
    }

    // Método para mapear la entidad Reporte a ReporteDTO

    private ReporteDTO mapearDTO(Reporte reporte) {
        ReporteDTO dto = new ReporteDTO();
        dto.setId(reporte.getId());
        dto.setUrlAudio(reporte.getUrlAudio());
        dto.setUrlImagen(reporte.getUrlImagen());
        dto.setTitulo(reporte.getTitulo());
        dto.setDescripcion(reporte.getDescripcion());
        dto.setFechaHora(reporte.getFechaHora());
        dto.setLatitud(reporte.getLatitud());
        dto.setLongitud(reporte.getLongitud());
        dto.setCategoriaId(reporte.getCategoria().getId());
        dto.setUsuarioId(reporte.getUsuario().getId());
        return dto;
    }
}
