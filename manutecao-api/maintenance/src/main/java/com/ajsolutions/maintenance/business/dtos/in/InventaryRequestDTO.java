package com.ajsolutions.barber.business.dtos.in;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventaryRequestDTO {

    private Long id;
    private String nome;
    private String Localidade;
    private String prateleira;
    private Integer quantidade;
}



