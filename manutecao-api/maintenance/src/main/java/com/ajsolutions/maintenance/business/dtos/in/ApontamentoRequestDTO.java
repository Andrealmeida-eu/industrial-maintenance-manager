package com.ajsolutions.barber.business.dtos.in;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApontamentoRequestDTO {
    private String numeroSM;
    private String numeroOS;
    private String trabalhoRealizado;

}
