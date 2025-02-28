package com.nocountry.urbia.controller;

import com.nocountry.urbia.model.Categoria;
import com.nocountry.urbia.repository.CategoriaRepository;
import com.nocountry.urbia.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ReporteRepository reporteRepository;

    // Endpoint para obtener todas las categorías
    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }


    // Endpoint para crear una nueva categoría
    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody Categoria categoria) {
        Categoria nuevaCategoria = categoriaRepository.save(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
    }

    // Endpoint para actualizar una categoría existente
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(@PathVariable Long id,
                                                     @RequestBody Categoria categoriaDetails) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (categoriaOptional.isPresent()) {
            Categoria categoria = categoriaOptional.get();
            categoria.setNombre(categoriaDetails.getNombre());
            Categoria updatedCategoria = categoriaRepository.save(categoria);
            return ResponseEntity.ok(updatedCategoria);
        }
        return ResponseEntity.notFound().build();
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategoria(@PathVariable Long id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (categoriaOptional.isPresent()) {
            if (reporteRepository.existsByCategoriaId(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("La categoría no se puede eliminar porque tiene reportes asociados");
            }
            categoriaRepository.delete(categoriaOptional.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
