package com.ajsolutions.barber.business.dtos.in;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentRequestDTO {


    private Long id;
    private String nome;
    private String numeroSerie;
    private List<WorkOrderRequestDTO> ordensServico;
}
