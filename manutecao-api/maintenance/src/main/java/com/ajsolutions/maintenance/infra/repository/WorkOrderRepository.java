package com.ajsolutions.barber.infra.repository;

import com.ajsolutions.barber.infra.entities.WorkOrder;
import com.ajsolutions.barber.infra.enums.StatusManutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.Set;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

        Set<WorkOrder> findByStatusAtual(StatusManutencao statusAtual);

        @Query("SELECT w FROM WorkOrder w WHERE w.equipamento.id = :equipamentoId " +
                        "AND (:status IS NULL OR w.statusAtual = :status) " +
                        "AND (:dataInicio IS NULL OR w.dataAbertura >= :dataInicio) " +
                        "AND (:dataFim IS NULL OR w.dataAbertura <= :dataFim) " +
                        "ORDER BY w.dataAbertura DESC")
        Set<WorkOrder> findByEquipamentoIdAndFiltros(
                        @Param("equipamentoId") Long equipamentoId,
                        @Param("dataInicio") LocalDateTime dataInicio, 
                        @Param("dataFim") LocalDateTime dataFim, 
                        @Param("status") StatusManutencao status);

}
