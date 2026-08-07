package com.ajsolutions.barber.business.dtos.out;


import com.ajsolutions.barber.infra.enums.StatusOperacional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipamentoDetalhadoResponseDTO {

    private Long id;
    private String nome;
    private String numeroSerie;
    private String origem;
    private String destinoAtual;
    private StatusOperacional statusOperacionalAtual;
    private LocalDateTime dataUltimoStatusOperacional;
    private MetricasEquipamentoDTO metricas;
}