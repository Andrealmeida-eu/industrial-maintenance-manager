package com.ajsolutions.barber.business.dtos.in;

import com.ajsolutions.barber.business.dtos.out.WorkOrderHistoryResponseDTO;
import com.ajsolutions.barber.infra.enums.StatusManutencao;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderRequestDTO {

    private Long id;
    private String numeroOs;
    private Long equipamentoId;
    private String equipamentoNome;
    private String numeroSerie;
    private String origem;
    private String defeitoRelatado;
    private StatusManutencao statusAtual;
    private String tecnicoAtual;
    private LocalDateTime dataAbertura;
    private LocalDateTime dataFechamento;
    private List<WorkOrderHistoryResponseDTO> historico;
}
