package com.ajsolutions.barber.infra.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_estoque")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String localidade;

    @Column(nullable = false)
    private String prateleira;

    @Column(nullable = false)
    private Integer quantidade;
}
