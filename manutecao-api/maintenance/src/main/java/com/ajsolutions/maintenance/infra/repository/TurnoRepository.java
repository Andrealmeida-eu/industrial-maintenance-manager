package com.ajsolutions.barber.infra.repository;

import com.ajsolutions.barber.infra.entities.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

    @Query("SELECT DISTINCT t FROM Turno t LEFT JOIN FETCH t.apontamentos WHERE t.dataFiltro = :data ORDER BY t.horarioInicio DESC")
    List<Turno> findByDataFiltroWithApontamentos(@Param("data") LocalDate data);

    @Query("SELECT DISTINCT t FROM Turno t LEFT JOIN FETCH t.apontamentos " +
            "WHERE t.dataFiltro BETWEEN :dataInicio AND :dataFim " +
            "ORDER BY t.dataFiltro DESC, t.horarioInicio DESC")
    List<Turno> findByDataFiltroBetweenWithApontamentos(
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim);
}
