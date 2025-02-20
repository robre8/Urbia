package com.nocountry.Urbia.service;

import com.nocountry.Urbia.model.Usuarios;
import com.nocountry.Urbia.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    public List<Usuarios> obtenerUsuarios() {
        return usuariosRepository.findAll();
    }

    public Optional<Usuarios> obtenerPorId(Long id) {
        return usuariosRepository.findById(id);
    }

    public Usuarios crearUsuarios(Usuarios usuario) {
        return usuariosRepository.save(usuario);
    }


    public boolean emailExiste(String email) {
        return usuariosRepository.existsByEmail(email);
    }

    public Optional<Usuarios> actualizarUsuarios(Long id, Usuarios usuario) {
        return usuariosRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setNombre(usuario.getNombre());
                    existingUser.setEmail(usuario.getEmail());
                    return usuariosRepository.save(existingUser);
                });
    }

    public boolean eliminarUsuarios(Long id) {
        if (usuariosRepository.existsById(id)) {
            usuariosRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
