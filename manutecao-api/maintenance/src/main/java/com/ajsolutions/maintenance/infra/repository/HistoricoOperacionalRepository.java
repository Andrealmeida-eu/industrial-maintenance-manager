package com.ajsolutions.barber.infra.repository;


import com.ajsolutions.barber.infra.entities.HistoricoOperacional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoricoOperacionalRepository extends JpaRepository<HistoricoOperacional, Long> {

    @Query("SELECT h FROM HistoricoOperacional h WHERE h.equipamento.id = :equipamentoId " +
            "AND (:dataInicio IS NULL OR h.dataEvento >= :dataInicio) " +
            "AND (:dataFim IS NULL OR h.dataEvento <= :dataFim) " +
            "ORDER BY h.dataEvento DESC")
    List<HistoricoOperacional> findByEquipamentoIdAndFiltros(
            @Param("equipamentoId") Long equipamentoId,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim
    );
}
