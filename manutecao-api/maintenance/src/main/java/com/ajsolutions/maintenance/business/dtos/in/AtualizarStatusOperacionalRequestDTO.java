package com.ajsolutions.barber.business.dtos.in;

import com.ajsolutions.barber.infra.enums.StatusOperacional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AtualizarStatusOperacionalRequestDTO {

    private Long equipamentoId;
    private StatusOperacional status;
    private String nomeTecnico;
    private String observacao;
    private String destino;
}