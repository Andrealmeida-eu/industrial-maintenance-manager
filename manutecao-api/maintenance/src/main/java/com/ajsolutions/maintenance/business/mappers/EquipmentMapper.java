package com.ajsolutions.barber.business.mappers;


import com.ajsolutions.barber.business.dtos.in.EquipmentRequestDTO;
import com.ajsolutions.barber.business.dtos.out.*;
import com.ajsolutions.barber.infra.entities.Equipment;

import com.ajsolutions.barber.infra.entities.HistoricoOperacional;
import com.ajsolutions.barber.infra.entities.WorkOrder;
import com.ajsolutions.barber.infra.entities.WorkOrderHistory;
import com.ajsolutions.barber.infra.enums.StatusManutencao;
import com.ajsolutions.barber.infra.exceptions.ResourceNotFoundException;
import com.ajsolutions.barber.infra.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;


@Component
@RequiredArgsConstructor
public class EquipmentMapper {


    private final WorkOrderMapper ordemServicoMapper; 
    private final EquipmentRepository equipmentRepository;
  

    /**
     * Converte o DTO de criação para a Entidade de Banco.
     */
    public Equipment toEntity(EquipmentRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Equipment.builder()
                .nome(dto.getNome())
                .numeroSerie(dto.getNumeroSerie())
                .ordensServico(new LinkedHashSet<>()) // Inicializa a lista vazia
                .build();
    }

    /**
     * Converte a Entidade para o DTO de saída, incluindo toda a árvore de histórico mapeada.
     */
    public EquipmentResponseDTO toResponseDTO(Equipment entity) {
        if (entity == null) {
            return null;
        }

        return EquipmentResponseDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .numeroSerie(entity.getNumeroSerie())
                .ordensServico(
                        entity.getOrdensServico() != null
                                ? ordemServicoMapper.toResponseDTOList(entity.getOrdensServico())
                                : new ArrayList<>()
                )
                .build();
    }

    /**
     * Converte uma lista de Equipamentos (útil para listagens gerais na tela)
     */
    public List<EquipmentResponseDTO> toResponseDTOList(List<Equipment> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<EquipmentInWorkerOrderDTO> toResponseEqWoDTOList(List<Equipment> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::toEqWoDTO)
                .toList();
    }


    public EquipmentInWorkerOrderDTO toEqWoDTO(Equipment entity) {
        if (entity == null) {
            return null;
        }

        WorkOrder lastWorker = entity.getOrdensServico().stream()
                .filter(
                        a ->
                                a.getStatusAtual() != StatusManutencao.FINALIZADO
                ).findFirst()
                .orElse(null);

        WorkOrderResponseDTO lastWorkerdto = ordemServicoMapper.toResponseDTO(lastWorker);

        EquipmentInWorkerOrderDTO.EquipmentInWorkerOrderDTOBuilder builder = EquipmentInWorkerOrderDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .destinoAtual(entity.getDestinoAtual())
                .statusOperacionalAtual(entity.getStatusOperacionalAtual())
                .numeroSerie(entity.getNumeroSerie());


        if (lastWorkerdto != null) {
            builder
                    .dataEntrada(lastWorkerdto.getDataAbertura())

                    .nomeTecnico(lastWorkerdto.getTecnicoAtual())
                    .origem(lastWorkerdto.getOrigem())
                    .status(lastWorkerdto.getStatusAtual());
        }


        return builder.build();
    }

    public Equipment equipmentUpdate(Long id, EquipmentRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Equipment equipmentBefore = equipmentRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Não foi encontrado equip com esse id:" + id));

        return Equipment.builder()
                .id(dto.getId() != null ? dto.getId() : id)
                .nome(dto.getNome() != null ? dto.getNome() : equipmentBefore.getNome())
                .numeroSerie(dto.getNumeroSerie() != null ? dto.getNumeroSerie() : equipmentBefore.getNumeroSerie())
                .build();

    }

    public EquipamentoDetalhadoResponseDTO toDetalhadoResponseDTO(MetricasEquipamentoDTO metricas, Equipment equipamento) {

        return EquipamentoDetalhadoResponseDTO.builder()
                .id(equipamento.getId())
                .nome(equipamento.getNome())
                .numeroSerie(equipamento.getNumeroSerie())
                .statusOperacionalAtual(equipamento.getStatusOperacionalAtual())
                .dataUltimoStatusOperacional(equipamento.getDataUltimoStatusOperacional())
                .metricas(metricas)
                .build();
    }


    public WorkOrderResponseDTO toOrdemServicoResponseDTO(WorkOrder os) {
        return WorkOrderResponseDTO.builder()
                .id(os.getId())
                .numeroOs(os.getNumeroOs())
                .origem(os.getOrigem())
                .statusAtual(os.getStatusAtual())
                .tecnicoAtual(os.getTecnicoAtual())
                .dataAbertura(os.getDataAbertura())
                .dataFechamento(os.getDataFechamento())
                .defeitoRelatado(os.getDefeitoRelatado())
                .historico(
                        os.getHistorico().stream()
                                .map(this::toHistoricoResponseDTO)
                                .toList()
                )
                .build();
    }

    public WorkOrderHistoryResponseDTO toHistoricoResponseDTO(WorkOrderHistory historico) {
        return WorkOrderHistoryResponseDTO.builder()
                .id(historico.getId())
                .dataEvento(historico.getDataEvento())
                .nomeTecnico(historico.getNomeTecnico())
                .status(historico.getStatus())
                .trabalhoExecutado(historico.getTrabalhoExecutado())
                .observacao(historico.getObservacao())
                .build();
    }

    public HistoricoOperacionalResponseDTO toHistoricoOperacionalResponseDTO(HistoricoOperacional historico) {
        return HistoricoOperacionalResponseDTO.builder()
                .id(historico.getId())
                .status(historico.getStatus())
                .destino(historico.getDestino())
                .dataEvento(historico.getDataEvento())
                .nomeTecnico(historico.getNomeTecnico())
                .observacao(historico.getObservacao())
                .workOrderId(historico.getWorkOrderId())
                .build();
    }

    public List<HistoricoOperacionalResponseDTO> toResponseHODTOList(List<HistoricoOperacional> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::toHistoricoOperacionalResponseDTO)
                .toList();
    }


}

