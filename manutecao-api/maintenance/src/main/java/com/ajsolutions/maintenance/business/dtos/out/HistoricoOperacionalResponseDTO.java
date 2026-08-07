package com.ajsolutions.barber.business.dtos.out;

import com.ajsolutions.barber.infra.enums.StatusOperacional;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoOperacionalResponseDTO {

    private Long id;
    private StatusOperacional status;
    private LocalDateTime dataEvento;
    private String nomeTecnico;
    private String observacao;
    private Long workOrderId;
    private String destino;
}