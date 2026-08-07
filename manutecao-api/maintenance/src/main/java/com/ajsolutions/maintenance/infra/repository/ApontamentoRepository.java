package com.ajsolutions.barber.infra.repository;

import com.ajsolutions.barber.infra.entities.Apontamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApontamentoRepository extends JpaRepository<Apontamento, Long> {
}
