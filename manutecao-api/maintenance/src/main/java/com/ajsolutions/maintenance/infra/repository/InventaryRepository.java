package com.ajsolutions.barber.infra.repository;

import com.ajsolutions.barber.infra.entities.Inventary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventaryRepository extends JpaRepository<Inventary, Long> {

    List<Inventary> findByNomeContainingIgnoreCase(String nome);

    List<Inventary> findByLocalidadeContainingIgnoreCase(String localidade);

    List<Inventary> findByPrateleiraContainingIgnoreCase(String prateleira);

    List<Inventary> findByNomeContainingIgnoreCaseAndLocalidadeContainingIgnoreCase(
            String nome,
            String localidade
    );
}
