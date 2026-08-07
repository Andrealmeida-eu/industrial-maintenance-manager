package com.ajsolutions.barber.business.dtos.out;

import com.ajsolutions.barber.infra.enums.StatusManutencao;
import com.ajsolutions.barber.infra.enums.StatusOperacional;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentInWorkerOrderDTO {

    private Long id;
    private String nome;
    private String numeroSerie;
    private String origem;
    private StatusManutencao status;
    private LocalDateTime dataEntrada;
    private String nomeTecnico;
    private String destinoAtual;
    private StatusOperacional statusOperacionalAtual;
    private LocalDateTime dataUltimoStatusOperacional;
    private List<WorkOrderResponseDTO> ordensServico;
    private  List<HistoricoOperacionalResponseDTO> historicoOperacional;
    private  MetricasEquipamentoDTO metricas;
}
