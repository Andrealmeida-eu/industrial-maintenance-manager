package com.ajsolutions.barber.controller;

import com.ajsolutions.barber.business.dtos.in.AddWorkOrderHistoryRequestDTO;
import com.ajsolutions.barber.business.dtos.in.CreateWorkOrderRequestDTO;
import com.ajsolutions.barber.business.dtos.out.HistoricoOperacionalResponseDTO;
import com.ajsolutions.barber.business.dtos.out.WorkOrderResponseDTO;
import com.ajsolutions.barber.business.services.WorkOrderService;
import com.ajsolutions.barber.infra.enums.StatusManutencao;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
public class WorkOrderController {

    private final WorkOrderService service;

    @PostMapping
    public ResponseEntity<WorkOrderResponseDTO> criar(@RequestBody CreateWorkOrderRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarOrdemServico(dto));
    }

    @GetMapping
    public ResponseEntity<List<WorkOrderResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodasOrdens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<WorkOrderResponseDTO>> buscarPorStatus(@PathVariable StatusManutencao status) {
        return ResponseEntity.ok(service.buscarPorStatus(status));
    }

    @GetMapping("/{id}/ordens")
    public ResponseEntity<List<WorkOrderResponseDTO>> getOrdensEquipamento(
            @PathVariable("id") Long equipamentoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(required = false) StatusManutencao status) {

        return ResponseEntity.ok(service.buscarPorStatusAndData(equipamentoId, dataInicio, dataFim, status));
    }

    @GetMapping("/{id}/historico-operacional")
    public ResponseEntity<List<HistoricoOperacionalResponseDTO>> getHistoricoEquipamento(
            @PathVariable("id") Long equipamentoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        return ResponseEntity.ok(service.buscarHistoricoEquipamento(equipamentoId, dataInicio, dataFim));
    }


    @PostMapping("/{id}/history")
    public ResponseEntity<WorkOrderResponseDTO> adicionarHistorico(
            @PathVariable Long id,
            @RequestBody AddWorkOrderHistoryRequestDTO dto) {
        return ResponseEntity.ok(service.adicionarHistorico(id, dto));
    }
}
