package com.ajsolutions.barber.business.mappers;

import com.ajsolutions.barber.business.dtos.out.ApontamentoResponseDTO;
import com.ajsolutions.barber.business.dtos.out.TurnoResponseDTO;
import com.ajsolutions.barber.infra.entities.Apontamento;
import com.ajsolutions.barber.infra.entities.Turno;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;


@Component
public class ApontamentoMapper {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public TurnoResponseDTO toTurnoDTO(Turno entity) {
        if (entity == null) return null;

        List<ApontamentoResponseDTO> apontamentosDTO = entity.getApontamentos().stream()
                .map(this::toApontamentoDTO)
                .toList();

        return TurnoResponseDTO.builder()
                .id(entity.getId())
                .nomeTurma(entity.getNomeTurma())
                .horarioTurno(entity.getHorarioTurno())
                .horarioInicio(entity.getHorarioInicio().format(TIME_FORMATTER))
                .dataTurno(entity.getDataFiltro().toString())
                .integrantes(entity.getIntegrantes())
                .apontamentos(apontamentosDTO)
                .isExpanded(false)
                .build();
    }


    public ApontamentoResponseDTO toApontamentoDTO(Apontamento entity) {
        if (entity == null) return null;

        return ApontamentoResponseDTO.builder()
                .id(entity.getId())
                .numeroSM(entity.getNumeroSM())
                .numeroOS(entity.getNumeroOS())
                .trabalhoRealizado(entity.getTrabalhoRealizado())
                .horarioRegistro(entity.getHorarioRegistro().format(TIME_FORMATTER))
                .build();
    }
}
