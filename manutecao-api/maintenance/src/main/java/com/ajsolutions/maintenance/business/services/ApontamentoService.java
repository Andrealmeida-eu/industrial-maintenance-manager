package com.ajsolutions.barber.business.services;


import com.ajsolutions.barber.business.dtos.in.ApontamentoRequestDTO;
import com.ajsolutions.barber.business.dtos.in.TurnoRequestDTO;
import com.ajsolutions.barber.business.dtos.out.TurnoResponseDTO;
import com.ajsolutions.barber.business.mappers.ApontamentoMapper;
import com.ajsolutions.barber.infra.entities.Apontamento;
import com.ajsolutions.barber.infra.entities.Turno;
import com.ajsolutions.barber.infra.repository.ApontamentoRepository;
import com.ajsolutions.barber.infra.repository.TurnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApontamentoService {

    private final TurnoRepository turnoRepository;
    private final ApontamentoRepository apontamentoRepository;
    private final ApontamentoMapper mapper;
    private final TarefaService pdfService;

    @Transactional(readOnly = true)
    public List<TurnoResponseDTO> buscarTurnosPorData(LocalDate data) {
        return turnoRepository.findByDataFiltroWithApontamentos(data).stream()
                .map(mapper::toTurnoDTO)
                .toList();
    }


    @Transactional(readOnly = true)
    public List<TurnoResponseDTO> buscarTurnosPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return turnoRepository.findByDataFiltroBetweenWithApontamentos(dataInicio, dataFim).stream()
                .map(mapper::toTurnoDTO)
                .toList();
    }


    @Transactional
    public TurnoResponseDTO iniciarTurno(TurnoRequestDTO dto) {
        Turno turno = Turno.builder()
                .nomeTurma(dto.getNomeTurma())
                .horarioTurno(dto.getHorarioTurno())
                .horarioInicio(LocalTime.now())
                .dataFiltro(LocalDate.now())
                .integrantes(dto.getIntegrantes())
                .build();

        return mapper.toTurnoDTO(turnoRepository.save(turno));
    }

    @Transactional
    public TurnoResponseDTO editarTurno(Long id, TurnoRequestDTO dto) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno não encontrado"));

        turno.setNomeTurma(dto.getNomeTurma());
        turno.setIntegrantes(dto.getIntegrantes());

        return mapper.toTurnoDTO(turnoRepository.save(turno));
    }

    @Transactional
    public TurnoResponseDTO adicionarTrabalho(Long turnoId, ApontamentoRequestDTO dto) {
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new RuntimeException("Turno não encontrado"));

        Apontamento apontamento = Apontamento.builder()
                .numeroSM(dto.getNumeroSM())
                .numeroOS(dto.getNumeroOS())
                .trabalhoRealizado(dto.getTrabalhoRealizado())
                .horarioRegistro(LocalTime.now())
                .turno(turno)
                .build();

        turno.getApontamentos().add(apontamento);
        turnoRepository.save(turno);

        return mapper.toTurnoDTO(turno);
    }

    @Transactional
    public TurnoResponseDTO editarTrabalho(Long turnoId, Long apontamentoId, ApontamentoRequestDTO dto) {
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new RuntimeException("Turno não encontrado"));

        Apontamento apontamento = apontamentoRepository.findById(apontamentoId)
                .orElseThrow(() -> new RuntimeException("Registro de trabalho não encontrado"));

        apontamento.setNumeroSM(dto.getNumeroSM());
        apontamento.setNumeroOS(dto.getNumeroOS());
        apontamento.setTrabalhoRealizado(dto.getTrabalhoRealizado());

        apontamentoRepository.save(apontamento);
        return mapper.toTurnoDTO(turno);
    }

    @Transactional
    public byte[] rotinaDiaria7h(LocalDate dataInicio, LocalDate dataFim) {
        List<TurnoResponseDTO> turmas = buscarTurnosPorPeriodo(dataInicio, dataFim);

        // 2. Mande gerar e salvar na pasta
        return pdfService.gerarRelatorioTurmasPdf(turmas);
    }
}
