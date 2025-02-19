package com.nocountry.Urbia.controller;

import com.nocountry.Urbia.model.Usuarios;
import com.nocountry.Urbia.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/usuarios")
public class UsuariosController {

    @Autowired
    private UsuariosService usuariosService; // Servicio que maneja la lógica de negocio


    @GetMapping
    public ResponseEntity<List<Usuarios>> obtenerTodos() {
        List<Usuarios> usuarios = usuariosService.obtenerUsuarios();
        return usuarios.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuarios> obtenerPorId(@PathVariable Long id) {
        return usuariosService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario( @RequestBody Usuarios usuario) {
        if (usuariosService.emailExiste(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("Error: El email ya está en uso.");
        }
        Usuarios nuevoUsuario = usuariosService.crearUsuarios(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuarios usuario) {
        return usuariosService.actualizarUsuarios(id, usuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        return usuariosService.eliminarUsuarios(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}

