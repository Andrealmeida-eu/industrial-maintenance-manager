package com.ajsolutions.barber.business.dtos.in;
import com.ajsolutions.barber.infra.enums.StatusManutencao;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddWorkOrderHistoryRequestDTO {
    private StatusManutencao status;
    private String nomeTecnico;
    private Long equipamentoId;
    private String trabalhoExecutado;
}