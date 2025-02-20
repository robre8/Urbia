package com.nocountry.Urbia.repository;


import com.nocountry.Urbia.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
    boolean existsByEmail(String email);
}
