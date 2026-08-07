package com.ajsolutions.barber.infra.entities;

import com.ajsolutions.barber.infra.enums.StatusManutencao;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


import java.util.*;

@Entity
@Table(name = "tb_ordem_servico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroOs;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipamento;

    @Column(nullable = false)
    private String origem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String defeitoRelatado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusManutencao statusAtual;

    private String tecnicoAtual;

    @Column(nullable = false)
    private LocalDateTime dataAbertura;

    private LocalDateTime dataFechamento;

    @OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dataEvento ASC")
    @Builder.Default
    private Set<WorkOrderHistory> historico = new LinkedHashSet<>();
    }

