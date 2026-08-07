package com.ajsolutions.barber.business.mappers;

import com.ajsolutions.barber.business.dtos.in.InventaryRequestDTO;
import com.ajsolutions.barber.business.dtos.out.InventaryResponseDTO;
import com.ajsolutions.barber.infra.entities.Inventary;
import com.ajsolutions.barber.infra.exceptions.ResourceNotFoundException;
import com.ajsolutions.barber.infra.repository.InventaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InventaryMapper {

    private final InventaryRepository inventaryRepository;

    public InventaryResponseDTO toInventaryResponseDTO(Inventary inventary) {
        if(inventary == null) return null;
        return InventaryResponseDTO.builder()
                .id(inventary.getId())
                .nome(inventary.getNome())
                .Localidade(inventary.getLocalidade())
                .prateleira(inventary.getPrateleira())
                .quantidade(inventary.getQuantidade())
                .build();
    }

    public Inventary toInventary(InventaryRequestDTO inventaryRequestDTO) {
        if(inventaryRequestDTO == null) return null;
        return Inventary.builder()
                .id(inventaryRequestDTO.getId())
                .nome(inventaryRequestDTO.getNome())
                .localidade(inventaryRequestDTO.getLocalidade())
                .prateleira(inventaryRequestDTO.getPrateleira())
                .quantidade(inventaryRequestDTO.getQuantidade())
                .build();
    }

    public List<InventaryResponseDTO> toInventaryResponseDTOList(List<Inventary> inventaries) {
        if(inventaries == null) return Collections.emptyList();
        return inventaries.stream()
                .map(this::toInventaryResponseDTO)
                .collect(Collectors.toList());


    }

    public Inventary toInventaryUpdate(Long id, InventaryRequestDTO dto) {
        if(dto == null) return null;

        Inventary inventary = inventaryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("nao encontrado id: " + id));
        return Inventary.builder()
                .id(dto.getId() != null ? dto.getId() : id)
                .nome(dto.getNome() != null ? dto.getNome() : inventary.getNome())
                .localidade(dto.getLocalidade() != null ? dto.getLocalidade(): inventary.getLocalidade())
                .prateleira(dto.getPrateleira() != null ? dto.getPrateleira() : inventary.getPrateleira())
                .quantidade(dto.getQuantidade() != null ? dto.getQuantidade() : inventary.getQuantidade())
                .build();
    }
}
