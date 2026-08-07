package com.ajsolutions.barber.controller;


import com.ajsolutions.barber.business.dtos.in.ApontamentoRequestDTO;
import com.ajsolutions.barber.business.dtos.in.TurnoRequestDTO;
import com.ajsolutions.barber.business.dtos.out.TurnoResponseDTO;
import com.ajsolutions.barber.business.services.ApontamentoService;
import com.ajsolutions.barber.business.services.TarefaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/apontamentos")
@RequiredArgsConstructor
public class ApontamentoController {

    private final ApontamentoService service;
    private final TarefaService tarefaService;

    @GetMapping
    public ResponseEntity<List<TurnoResponseDTO>> listarPorData(
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(service.buscarTurnosPorData(data));
    }

    @PostMapping("/turno")
    public ResponseEntity<TurnoResponseDTO> iniciarTurno(@RequestBody TurnoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.iniciarTurno(dto));
    }

    @GetMapping("/turnos/pdf")
    public ResponseEntity<byte[]> baixarRelatorioTurnos(
            @RequestParam("dataInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam("dataFim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {

        byte[] pdf = service.rotinaDiaria7h(dataInicio, dataFim);

        String nomeArquivo = "Relatorio_Turnos_" + LocalDate.now() + ".pdf";

        return ResponseEntity.ok()
                // Essa linha diz pro navegador: "Faça o download desse arquivo com este nome"
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeArquivo + "\"")
                // Essa linha avisa que o formato é PDF
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/porperiodo")
    public ResponseEntity<List<TurnoResponseDTO>> listarPorPeriodo(
            @RequestParam("dataInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam("dataFim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        return ResponseEntity.ok(service.buscarTurnosPorPeriodo(dataInicio, dataFim));
    }


    @PutMapping("/turno/{id}")
    public ResponseEntity<TurnoResponseDTO> editarTurno(
            @PathVariable Long id,
            @RequestBody TurnoRequestDTO dto) {
        return ResponseEntity.ok(service.editarTurno(id, dto));
    }

    @PostMapping("/turno/{turnoId}/trabalho")
    public ResponseEntity<TurnoResponseDTO> adicionarTrabalho(
            @PathVariable Long turnoId,
            @RequestBody ApontamentoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarTrabalho(turnoId, dto));
    }

    @PutMapping("/turno/{turnoId}/trabalho/{apontamentoId}")
    public ResponseEntity<TurnoResponseDTO> editarTrabalho(
            @PathVariable Long turnoId,
            @PathVariable Long apontamentoId,
            @RequestBody ApontamentoRequestDTO dto) {
        return ResponseEntity.ok(service.editarTrabalho(turnoId, apontamentoId, dto));
    }
}