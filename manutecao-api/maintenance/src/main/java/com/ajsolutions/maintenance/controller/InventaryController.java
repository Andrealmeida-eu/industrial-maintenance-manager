package com.ajsolutions.barber.controller;


import com.ajsolutions.barber.business.dtos.in.InventaryRequestDTO;
import com.ajsolutions.barber.business.dtos.in.QuantidadeRequestDTO;
import com.ajsolutions.barber.business.dtos.out.InventaryResponseDTO;
import com.ajsolutions.barber.business.services.WorkOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
public class InventaryController {

    private final WorkOrderService inventaryService;

    @PostMapping
    public ResponseEntity<InventaryResponseDTO> create(@RequestBody InventaryRequestDTO inventary) {
        InventaryResponseDTO created = inventaryService.createInventary(inventary);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<InventaryResponseDTO>> findAll(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String localidade,
            @RequestParam(required = false) String prateleira
    ) {
        if (nome != null && localidade != null) {
            return ResponseEntity.ok(inventaryService.findByNomeAndLocalidadeInventary(nome, localidade));
        }

        if (nome != null) {
            return ResponseEntity.ok(inventaryService.findByNomeInventary(nome));
        }

        if (localidade != null) {
            return ResponseEntity.ok(inventaryService.findByLocalidadeInventary(localidade));
        }

        if (prateleira != null) {
            return ResponseEntity.ok(inventaryService.findByPrateleiraInventary(prateleira));
        }

        return ResponseEntity.ok(inventaryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventaryResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(inventaryService.findByInventaryId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventaryResponseDTO> update(@PathVariable Long id, @RequestBody InventaryRequestDTO inventary) {
        return ResponseEntity.ok(inventaryService.updateInventary(id, inventary));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventaryService.deleteInventary(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/entrada")
    public ResponseEntity<InventaryResponseDTO> entradaEstoque(
            @PathVariable Long id,
            @RequestBody QuantidadeRequestDTO request
    ) {
        return ResponseEntity.ok(inventaryService.entradaEstoqueInventary(id, request.getQuantidade()));
    }

    @PatchMapping("/{id}/saida")
    public ResponseEntity<InventaryResponseDTO> saidaEstoque(
            @PathVariable Long id,
            @RequestBody QuantidadeRequestDTO request
    ) {
        return ResponseEntity.ok(inventaryService.saidaEstoqueInventary(id, request.getQuantidade()));
    }

}
