package com.ajsolutions.barber.infra.entities;
import com.ajsolutions.barber.infra.enums.StatusOperacional;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "tb_equipment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true)
    private String numeroSerie;
    @Column(name = "destino_atual")
    private String destinoAtual;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_operacional_atual")
    private StatusOperacional statusOperacionalAtual;

    @Column(name = "data_ultimo_status_operacional")
    private LocalDateTime dataUltimoStatusOperacional;

    @OneToMany(mappedBy = "equipamento", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dataEvento DESC")
    @Builder.Default
    private Set<HistoricoOperacional> historicoOperacional = new LinkedHashSet<>();


    @OneToMany(mappedBy = "equipamento", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<WorkOrder> ordensServico = new LinkedHashSet<>();
}


