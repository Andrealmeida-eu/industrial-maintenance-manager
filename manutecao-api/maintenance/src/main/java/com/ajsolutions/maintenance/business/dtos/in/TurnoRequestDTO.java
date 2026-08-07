package com.ajsolutions.barber.business.dtos.in;

import com.ajsolutions.barber.infra.enums.TipoTurno;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnoRequestDTO {
    private String nomeTurma;
    private TipoTurno horarioTurno;
    private List<String> integrantes;
}
