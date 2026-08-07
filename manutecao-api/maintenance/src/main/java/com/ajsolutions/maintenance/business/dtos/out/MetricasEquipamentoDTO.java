package com.ajsolutions.barber.business.dtos.out;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricasEquipamentoDTO {

        private long totalPassagensBancada;
        private long totalOrdensEmAberto;
        private long totalEventosHistorico;
        private long totalMudancasOperacionais;
        private long totalRetornosParaManutencao;
        private Long tempoMedioHorasPrateleira;
        private Long tempoMedioHorasOperacao;
        private Long tempoMedioHorasManutencao;
}
