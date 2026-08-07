package com.ajsolutions.barber.business.dtos.out;

import com.ajsolutions.barber.infra.enums.TipoTurno;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnoResponseDTO {
    private Long id;
    private String nomeTurma;
    private String dataTurno;
    private TipoTurno horarioTurno;
    private String horarioInicio;
    private List<String> integrantes;
    private List<ApontamentoResponseDTO> apontamentos;
    private boolean isExpanded;
}
