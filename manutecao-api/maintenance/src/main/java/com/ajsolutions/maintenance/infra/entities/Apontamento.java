package com.ajsolutions.barber.infra.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "tb_apontamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Apontamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String numeroSM;

    @Column(nullable = true)
    private String numeroOS;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String trabalhoRealizado;

    @Column(nullable = false)
    private LocalTime horarioRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;
}