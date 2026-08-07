package com.ajsolutions.barber.business.dtos.in;

import com.ajsolutions.barber.infra.enums.StatusManutencao;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateWorkOrderRequestDTO {
    private Long equipamentoId;
    private String origem;
    private String defeitoRelatado;
    private String nomeTecnico;
    private StatusManutencao statusInicial;
}

