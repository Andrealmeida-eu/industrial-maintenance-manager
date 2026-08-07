package com.ajsolutions.barber.business.dtos.out;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentResponseDTO {

    private Long id;
    private String nome;
    private String numeroSerie;
    private List<WorkOrderResponseDTO> ordensServico;
}
