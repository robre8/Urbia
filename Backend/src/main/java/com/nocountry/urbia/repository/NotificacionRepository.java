package com.nocountry.urbia.repository;


import com.nocountry.urbia.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    // Puedes agregar métodos de consulta personalizados
}