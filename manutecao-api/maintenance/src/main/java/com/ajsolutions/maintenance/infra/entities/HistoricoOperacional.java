package com.ajsolutions.barber.infra.entities;

import com.ajsolutions.barber.infra.enums.StatusOperacional;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historico_operacional")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoOperacional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusOperacional status;

    @Column(nullable = false)
    private LocalDateTime dataEvento;

    @Column(length = 120)
    private String nomeTecnico;

    @Column(length = 2000)
    private String observacao;

    @Column(name = "work_order_id")
    private Long workOrderId;

    @Column(length = 120)
    private String destino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipamento_id", nullable = false)
    private Equipment equipamento;
}
