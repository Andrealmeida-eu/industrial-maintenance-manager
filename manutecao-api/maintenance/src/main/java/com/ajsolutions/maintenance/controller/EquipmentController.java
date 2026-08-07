package com.ajsolutions.barber.controller;

import com.ajsolutions.barber.business.dtos.in.AtualizarStatusOperacionalRequestDTO;
import com.ajsolutions.barber.business.dtos.in.EquipmentRequestDTO;
import com.ajsolutions.barber.business.dtos.out.*;
import com.ajsolutions.barber.business.services.StatusOperacionalService;
import com.ajsolutions.barber.business.services.WorkOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
public class EquipmentController {

    private final WorkOrderService service;
    private final StatusOperacionalService statusService;

    @PostMapping
    public ResponseEntity<EquipmentResponseDTO> criar(@RequestBody EquipmentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarEquip(dto));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<EquipmentResponseDTO> update(@PathVariable Long id, @RequestBody EquipmentRequestDTO dto) {
        return ResponseEntity.ok(service.equipmentUpdate(id, dto));
    }

    @GetMapping("/{id}/detalhe")
    public ResponseEntity<EquipamentoDetalhadoResponseDTO> buscarDetalhe(@PathVariable Long id) {
            return ResponseEntity.ok(service.buscarDetalhe(id));
    }

    @PatchMapping("/status-operacional")
    public ResponseEntity<HistoricoOperacionalResponseDTO> atualizarStatusOperacional(
            @RequestBody AtualizarStatusOperacionalRequestDTO request
    ) {
        HistoricoOperacionalResponseDTO historico = statusService.atualizarStatusOperacional(request);
        return ResponseEntity.ok(historico);
    }

    @GetMapping
    public ResponseEntity<List<EquipmentResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodosEquipamentos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarEquipamentoComHistorico(id));
    }

    @GetMapping("/em-bancada")
    public ResponseEntity<List<EquipmentInWorkerOrderDTO>> listarEmBancada() {
        return ResponseEntity.ok(service.equipamentosEmBancada());
    }
}
