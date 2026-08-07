package com.ajsolutions.barber.business.dtos.out;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApontamentoResponseDTO {
    private Long id;
    private String numeroSM;
    private String numeroOS;
    private String trabalhoRealizado;
    private String horarioRegistro;
}
