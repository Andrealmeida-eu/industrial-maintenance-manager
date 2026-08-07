package com.ajsolutions.barber.business.services;

import com.ajsolutions.barber.business.dtos.in.AtualizarStatusOperacionalRequestDTO;
import com.ajsolutions.barber.business.dtos.out.HistoricoOperacionalResponseDTO;
import com.ajsolutions.barber.business.mappers.EquipmentMapper;
import com.ajsolutions.barber.infra.entities.Equipment;
import com.ajsolutions.barber.infra.entities.HistoricoOperacional;
import com.ajsolutions.barber.infra.enums.StatusOperacional;
import com.ajsolutions.barber.infra.exceptions.ResourceNotFoundException;
import com.ajsolutions.barber.infra.repository.EquipmentRepository;
import com.ajsolutions.barber.infra.repository.HistoricoOperacionalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class StatusOperacionalService {

    private final EquipmentRepository equipamentoRepository;
    private final EquipmentMapper equipmentMapper;
    private final HistoricoOperacionalRepository historicoOperacionalRepository;

    public HistoricoOperacionalResponseDTO atualizarStatusOperacional(AtualizarStatusOperacionalRequestDTO request) {
        Equipment equipamento = equipamentoRepository.findById(request.getEquipamentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipamento não encontrado"));

        HistoricoOperacional evento = new HistoricoOperacional();
        evento.setEquipamento(equipamento);
        evento.setStatus(request.getStatus());
        evento.setDataEvento(LocalDateTime.now());
        evento.setDestino(request.getDestino());
        evento.setNomeTecnico(request.getNomeTecnico());
        evento.setObservacao(request.getObservacao());

        historicoOperacionalRepository.save(evento);

        equipamento.setStatusOperacionalAtual(request.getStatus());
        equipamento.setDataUltimoStatusOperacional(evento.getDataEvento());

        if (request.getStatus() == StatusOperacional.EM_OPERACAO){
            log.warn("destino: {}", request.getDestino());
            equipamento.setDestinoAtual(request.getDestino());
        }
        equipamentoRepository.save(equipamento);

        return equipmentMapper.toHistoricoOperacionalResponseDTO(evento);
    }
}