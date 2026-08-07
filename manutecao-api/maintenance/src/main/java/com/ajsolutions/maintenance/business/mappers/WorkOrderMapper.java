package com.ajsolutions.barber.business.mappers;


import com.ajsolutions.barber.business.dtos.in.EquipmentRequestDTO;
import com.ajsolutions.barber.business.dtos.in.WorkOrderRequestDTO;
import com.ajsolutions.barber.business.dtos.out.EquipmentResponseDTO;
import com.ajsolutions.barber.business.dtos.out.WorkOrderHistoryResponseDTO;
import com.ajsolutions.barber.business.dtos.out.WorkOrderResponseDTO;
import com.ajsolutions.barber.infra.entities.Equipment;
import com.ajsolutions.barber.infra.entities.WorkOrder;

import com.ajsolutions.barber.infra.entities.WorkOrderHistory;
import com.ajsolutions.barber.infra.enums.StatusManutencao;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;


import static java.util.stream.Collectors.toList;

@Component
public class WorkOrderMapper {

    /**
     * Converte um RequestDTO (entrada) para a Entidade JPA que vai pro banco.
     * Define o status inicial como RECEBIDO e a data de entrada atual.
     */
    public WorkOrder toEntity(WorkOrderRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return WorkOrder.builder()
                .origem(dto.getOrigem())
                .tecnicoAtual(dto.getTecnicoAtual())
                .defeitoRelatado(dto.getDefeitoRelatado())
                .statusAtual(StatusManutencao.RECEBIDO)
                .dataAbertura(LocalDateTime.now())
                .build();
    }

    /**
     * Converte a Entidade JPA (banco) para o ResponseDTO (saída).
     */
    public WorkOrderResponseDTO toResponseDTO(WorkOrder entity) {
        if (entity == null) {
            return null;
        }

        return WorkOrderResponseDTO.builder()
                .id(entity.getId())
                .equipamentoNome(entity.getEquipamento().getNome())
                .origem(entity.getOrigem())
                .numeroOs(entity.getNumeroOs())
                .tecnicoAtual(entity.getTecnicoAtual())
                .defeitoRelatado(entity.getDefeitoRelatado())
                .statusAtual(entity.getStatusAtual())
                .dataAbertura(entity.getDataAbertura())
                .dataFechamento(entity.getDataFechamento())
                .historico(wokhToResponseDTOList(entity.getHistorico()))
                .build();
    }

    /**
     * Converte uma lista de Entidades para uma lista de ResponseDTOs (útil para o Listar Todos).
     */
    public List<WorkOrderResponseDTO> toResponseDTOList(Set<WorkOrder> entities) {
        if (entities == null) {
            return null;
        }
        return entities.stream()
                .map(this::toResponseDTO)
                .collect(toList());
    }

    public List<WorkOrderResponseDTO> toResponseDTOListCustom(List<WorkOrder> entities) {
        if (entities == null) {
            return null;
        }
        return entities.stream()
                .map(this::toResponseDTO)
                .collect(toList());
    }

    public Equipment toEntityeq(EquipmentRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Equipment.builder()
                .nome(dto.getNome())
                .numeroSerie(dto.getNumeroSerie())
                .ordensServico(new LinkedHashSet<>()) // Inicializa a lista vazia
                .build();
    }

    public EquipmentResponseDTO toResponseDTOeq(Equipment entity) {
        if (entity == null) {
            return null;
        }

        return EquipmentResponseDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .numeroSerie(entity.getNumeroSerie())
                .build();
    }

    public WorkOrderHistoryResponseDTO wokhToResponseDTO(WorkOrderHistory entity) {
        if (entity == null) {
            return null;
        }

        return WorkOrderHistoryResponseDTO.builder()
                .id(entity.getId())
                .status(entity.getStatus())
                .nomeTecnico(entity.getNomeTecnico())
                .trabalhoExecutado(entity.getTrabalhoExecutado())
                .dataEvento(entity.getDataEvento())
                .build();
    }

    public List<WorkOrderHistoryResponseDTO> wokhToResponseDTOList(Set<WorkOrderHistory> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::wokhToResponseDTO)
                .toList();
    }
}

