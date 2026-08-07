package com.ajsolutions.barber.infra.entities;

import com.ajsolutions.barber.infra.enums.TipoTurno;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_turnos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeTurma;

    @Column(nullable = false)
    private TipoTurno horarioTurno;

    @Column(nullable = false)
    private LocalTime horarioInicio;

    @Column(nullable = false)
    private LocalDate dataFiltro;

    @ElementCollection
    @CollectionTable(name = "tb_turno_integrantes", joinColumns = @JoinColumn(name = "turno_id"))
    @Column(name = "integrante")
    @Builder.Default
    private List<String> integrantes = new ArrayList<>();

    @OneToMany(mappedBy = "turno", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Apontamento> apontamentos = new ArrayList<>();
}
