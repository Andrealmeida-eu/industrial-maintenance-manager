package com.ajsolutions.barber.business.dtos.out;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class InventaryResponseDTO {

    private Long id;
    private String nome;
    private String Localidade;
    private String prateleira;
    private Integer quantidade;
}
