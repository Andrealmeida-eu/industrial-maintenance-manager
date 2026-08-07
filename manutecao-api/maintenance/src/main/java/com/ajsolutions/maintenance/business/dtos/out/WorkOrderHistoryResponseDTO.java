package com.ajsolutions.barber.business.dtos.out;


import com.ajsolutions.barber.infra.enums.StatusManutencao;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderHistoryResponseDTO {
    private Long id;
    private StatusManutencao status;
    private String nomeTecnico;
    private String defeitoRelatado;
    private String observacao;
    private String trabalhoExecutado;
    private LocalDateTime dataEvento;
}
