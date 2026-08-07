package com.ajsolutions.barber.business.services;

import com.ajsolutions.barber.business.dtos.in.*;
import com.ajsolutions.barber.business.dtos.out.*;
import com.ajsolutions.barber.business.mappers.EquipmentMapper;
import com.ajsolutions.barber.business.mappers.InventaryMapper;
import com.ajsolutions.barber.business.mappers.WorkOrderMapper;
import com.ajsolutions.barber.infra.entities.*;
import com.ajsolutions.barber.infra.enums.StatusManutencao;
import com.ajsolutions.barber.infra.enums.StatusOperacional;
import com.ajsolutions.barber.infra.exceptions.ConflitException;
import com.ajsolutions.barber.infra.exceptions.ResourceNotFoundException;
import com.ajsolutions.barber.infra.repository.EquipmentRepository;
import com.ajsolutions.barber.infra.repository.HistoricoOperacionalRepository;
import com.ajsolutions.barber.infra.repository.InventaryRepository;
import com.ajsolutions.barber.infra.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository repository;
    private final WorkOrderMapper mapper;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;
    private final HistoricoOperacionalRepository historicoOperacionalRepository;
    private final StatusOperacionalService statusOperacionalService;
    private final InventaryRepository inventaryRepository;
    private final InventaryMapper inventaryMapper;

    @Transactional
    public WorkOrderResponseDTO criarOrdemServico(CreateWorkOrderRequestDTO dto) {
        Equipment equipamento = equipmentRepository.findById(dto.getEquipamentoId())
                .orElseThrow(() -> new RuntimeException(
                        "Equipamento não encontrado com o ID: " + dto.getEquipamentoId()));

        boolean os = equipamento.getOrdensServico().stream()
                .anyMatch(
                        wo -> wo.getStatusAtual() != StatusManutencao.FINALIZADO);

        if (os) {
            throw new ConflitException("Existe Ordem aberta para este Equipamento");
        }

        StatusManutencao statusInicial = dto.getStatusInicial() != null
                ? dto.getStatusInicial()
                : StatusManutencao.RECEBIDO;

        LocalDateTime agora = LocalDateTime.now();

        WorkOrder novaOrdem = WorkOrder.builder()
                .numeroOs(gerarNumeroOs())
                .equipamento(equipamento)
                .origem(dto.getOrigem())
                .defeitoRelatado(dto.getDefeitoRelatado())
                .statusAtual(statusInicial)
                .tecnicoAtual(dto.getNomeTecnico())
                .dataAbertura(agora)
                .build();

        WorkOrderHistory primeiroHistorico = WorkOrderHistory.builder()
                .workOrder(novaOrdem)
                .status(statusInicial)
                .nomeTecnico(dto.getNomeTecnico())
                .observacao("Entrada inicial do equipamento na bancada")
                .dataEvento(agora)
                .build();

        String destinoInicial = "Bancada - Seção Elétrica";

        HistoricoOperacional primeiroOperacional = HistoricoOperacional.builder()
                .equipamento(equipamento)
                .status(StatusOperacional.ENTRADA_EM_BANCADA)
                .destino(destinoInicial)
                .dataEvento(LocalDateTime.now())
                .nomeTecnico(dto.getNomeTecnico())
                .observacao("Entrada inicial do equipamento")
                .build();

        historicoOperacionalRepository.save(primeiroOperacional);
        equipamento.setDataUltimoStatusOperacional(primeiroOperacional.getDataEvento());
        equipamento.setStatusOperacionalAtual(primeiroOperacional.getStatus());
        equipamento.setDestinoAtual(destinoInicial);
        equipamento.getHistoricoOperacional().add(primeiroOperacional);

        novaOrdem.getHistorico().add(primeiroHistorico);

        equipmentRepository.save(equipamento);
        WorkOrder salvo = repository.save(novaOrdem);

        return mapper.toResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<HistoricoOperacionalResponseDTO> buscarHistoricoEquipamento(Long equipamentoId, LocalDate dataInicio,
            LocalDate dataFim) {

        
        LocalDateTime inicioQuery = null;
        LocalDateTime fimQuery = null;

        if (dataInicio != null) {
            inicioQuery = dataInicio.atStartOfDay();
        }

        if (dataFim != null) {
            fimQuery = dataFim.atTime(LocalTime.MAX);
        }

        List<HistoricoOperacional> historico = historicoOperacionalRepository
                .findByEquipamentoIdAndFiltros(equipamentoId, inicioQuery, fimQuery);

        return equipmentMapper.toResponseHODTOList(historico);
    }

    @Transactional
    public WorkOrderResponseDTO adicionarHistorico(Long workOrderId, AddWorkOrderHistoryRequestDTO dto) {
        WorkOrder os = repository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException(
                        "Ordem de Serviço id " + workOrderId + " não encontrada."));

        LocalDateTime agora = LocalDateTime.now();

        WorkOrderHistory historico = WorkOrderHistory.builder()
                .workOrder(os)
                .status(dto.getStatus())
                .nomeTecnico(dto.getNomeTecnico())
                .trabalhoExecutado(dto.getTrabalhoExecutado())
                .dataEvento(agora)
                .build();

        os.getHistorico().add(historico);

        if (dto.getStatus() != null) {
            os.setStatusAtual(dto.getStatus());
        }

        if (dto.getNomeTecnico() != null && !dto.getNomeTecnico().isBlank()) {
            os.setTecnicoAtual(dto.getNomeTecnico());
        }

        if (dto.getStatus() == StatusManutencao.FINALIZADO) {
            os.setDataFechamento(agora);
        }

        if (dto.getStatus() == StatusManutencao.EM_MANUTENCAO) {
            AtualizarStatusOperacionalRequestDTO reques = AtualizarStatusOperacionalRequestDTO.builder()
                    .equipamentoId(dto.getEquipamentoId())
                    .status(StatusOperacional.EM_MANUTENCAO)
                    .nomeTecnico(dto.getNomeTecnico())
                    .observacao(dto.getTrabalhoExecutado())
                    .build();

            statusOperacionalService.atualizarStatusOperacional(reques);

        }

        WorkOrder salvo = repository.save(os);

        return mapper.toResponseDTO(salvo);
    }

    @Transactional
    public EquipamentoDetalhadoResponseDTO buscarDetalhe(Long equipamentoId) {

        Equipment equipamento = equipmentRepository.buscarDetalhadoPorId(equipamentoId)
                .orElseThrow(() -> new RuntimeException(
                        "Equipamento id " + equipamentoId + " não encontrado."));

        List<WorkOrderHistory> os = equipamento.getOrdensServico().stream()
                .map(WorkOrder::getHistorico)
                .filter(Objects::nonNull)
                .flatMap(Set::stream)
                .toList();

        MetricasEquipamentoDTO metricas = calcularMetricas(os, equipamento);

        return equipmentMapper.toDetalhadoResponseDTO(metricas, equipamento);
    }

    @Transactional
    public EquipmentResponseDTO criarEquip(EquipmentRequestDTO dto) {
        Equipment equipment = equipmentMapper.toEntity(dto);
        Equipment salvo = equipmentRepository.save(equipment);
        return equipmentMapper.toResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<WorkOrderResponseDTO> listarTodasOrdens() {
        return mapper.toResponseDTOListCustom(repository.findAll());
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> listarTodosEquipamentos() {
        return equipmentMapper.toResponseDTOList(equipmentRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<EquipmentInWorkerOrderDTO> equipamentosEmBancada() {
        return equipmentMapper.toResponseEqWoDTOList(equipmentRepository.findAll());
    }

    @Transactional(readOnly = true)
    public WorkOrderResponseDTO buscarPorId(Long id) {
        WorkOrder os = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de Serviço id " + id + " não encontrada."));
        return mapper.toResponseDTO(os);
    }

    @Transactional(readOnly = true)
    public List<WorkOrderResponseDTO> buscarPorStatus(StatusManutencao status) {
        return mapper.toResponseDTOList(repository.findByStatusAtual(status));
    }

    @Transactional(readOnly = true)
    public List<WorkOrderResponseDTO> buscarPorStatusAndData(Long equipamentoId, LocalDate dataInicio,
            LocalDate dataFim, StatusManutencao status) {

        LocalDateTime inicioQuery = null;
        LocalDateTime fimQuery = null;

        if (dataInicio != null) {
            inicioQuery = dataInicio.atStartOfDay();
        }

        if (dataFim != null) {
            fimQuery = dataFim.atTime(LocalTime.MAX);
        }

        Set<WorkOrder> ordens = repository.findByEquipamentoIdAndFiltros(equipamentoId, inicioQuery, fimQuery, status);

        return mapper.toResponseDTOList(ordens);
    }

    @Transactional(readOnly = true)
    public EquipmentResponseDTO buscarEquipamentoComHistorico(Long id) {
        Equipment equipamento = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
        return equipmentMapper.toResponseDTO(equipamento);
    }

    @Transactional
    public InventaryResponseDTO createInventary(InventaryRequestDTO inventary) {
        validarQuantidade(inventary.getQuantidade());

        Inventary invent = inventaryMapper.toInventary(inventary);
        return inventaryMapper.toInventaryResponseDTO(inventaryRepository.save(invent));
    }

    public List<InventaryResponseDTO> findAll() {
        return inventaryMapper.toInventaryResponseDTOList(inventaryRepository.findAll());
    }

    public InventaryResponseDTO findByInventaryId(Long id) {
        Inventary inventary = inventaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque não encontrado com id: " + id));
        return inventaryMapper.toInventaryResponseDTO(inventary);
    }

    public List<InventaryResponseDTO> findByNomeInventary(String nome) {
        List<Inventary> inventary = inventaryRepository.findByNomeContainingIgnoreCase(nome);
        return inventaryMapper.toInventaryResponseDTOList(inventary);
    }

    public List<InventaryResponseDTO> findByLocalidadeInventary(String localidade) {
        List<Inventary> inventary = inventaryRepository.findByLocalidadeContainingIgnoreCase(localidade);
        return inventaryMapper.toInventaryResponseDTOList(inventary);
    }

    public List<InventaryResponseDTO> findByPrateleiraInventary(String prateleira) {
        List<Inventary> inventary = inventaryRepository.findByPrateleiraContainingIgnoreCase(prateleira);
        return inventaryMapper.toInventaryResponseDTOList(inventary);
    }

    public List<InventaryResponseDTO> findByNomeAndLocalidadeInventary(String nome, String localidade) {
        List<Inventary> inventary = inventaryRepository
                .findByNomeContainingIgnoreCaseAndLocalidadeContainingIgnoreCase(nome, localidade);
        return inventaryMapper.toInventaryResponseDTOList(inventary);
    }

    public InventaryResponseDTO updateInventary(Long id, InventaryRequestDTO inventary) {
        inventaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque não encontrado com id: " + id));

        Inventary invent = inventaryMapper.toInventaryUpdate(id, inventary);
        Inventary inventSalvo = inventaryRepository.save(invent);
        return inventaryMapper.toInventaryResponseDTO(inventSalvo);
    }

    public EquipmentResponseDTO equipmentUpdate(Long id, EquipmentRequestDTO dto) {
        equipmentRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Equipamento não encontrado com id: " + id));

        Equipment equip = equipmentMapper.equipmentUpdate(id, dto);
        Equipment equipSalvo = equipmentRepository.save(equip);

        return equipmentMapper.toResponseDTO(equipSalvo);

    }

    public void deleteInventary(Long id) {
        Inventary entity = inventaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque não encontrado com id: " + id));
        inventaryRepository.delete(entity);
    }

    public InventaryResponseDTO entradaEstoqueInventary(Long id, Integer quantidadeEntrada) {
        if (quantidadeEntrada == null || quantidadeEntrada <= 0) {
            throw new IllegalArgumentException("A quantidade de entrada deve ser maior que zero.");
        }

        Inventary entity = inventaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque não encontrado com id: " + id));
        entity.setQuantidade(entity.getQuantidade() + quantidadeEntrada);

        Inventary salvo = inventaryRepository.save(entity);
        return inventaryMapper.toInventaryResponseDTO(salvo);
    }

    public InventaryResponseDTO saidaEstoqueInventary(Long id, Integer quantidadeSaida) {
        System.out.println("quantidade saida: " + quantidadeSaida);
        if (quantidadeSaida == null || quantidadeSaida <= 0) {
            throw new IllegalArgumentException("A quantidade de saída deve ser maior que zero.");
        }

        Inventary entity = inventaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque não encontrado com id: " + id));

        if (entity.getQuantidade() < quantidadeSaida) {
            throw new IllegalArgumentException("Estoque insuficiente para realizar a saída.");
        }

        entity.setQuantidade(entity.getQuantidade() - quantidadeSaida);

        Inventary salvo = inventaryRepository.save(entity);
        return inventaryMapper.toInventaryResponseDTO(salvo);
    }

    public MetricasEquipamentoDTO calcularMetricas(List<WorkOrderHistory> historicoOs, Equipment equipamento) {
        long totalPassagensBancada = equipamento.getOrdensServico() == null
                ? 0
                : equipamento.getOrdensServico().size();

        long totalOrdensEmAberto = equipamento.getOrdensServico() == null
                ? 0
                : equipamento.getOrdensServico().stream()
                        .filter(os -> os.getDataFechamento() == null)
                        .count();

        long totalEventosHistorico = equipamento.getOrdensServico() == null
                ? 0
                : equipamento.getOrdensServico().stream()
                        .mapToLong(os -> os.getHistorico() == null ? 0 : os.getHistorico().size())
                        .sum();

        List<HistoricoOperacional> historicoOperacional = equipamento.getHistoricoOperacional() == null
                ? List.of()
                : equipamento.getHistoricoOperacional().stream()
                        .sorted(Comparator.comparing(HistoricoOperacional::getDataEvento))
                        .toList();

        long totalMudancasOperacionais = historicoOperacional.size();

        long totalRetornosParaManutencao = historicoOperacional.stream()
                .filter(h -> h.getStatus() == StatusOperacional.EM_MANUTENCAO)
                .count();

        Long tempoMedioHorasPrateleira = 0L;
        Long tempoMedioHorasOperacao = calcularTempoMedioOperacaoAteEntradaBancada(historicoOperacional);
        Long tempoMedioHorasManutencao = calcularTempoMedioPorStatus(historicoOs, StatusManutencao.EM_MANUTENCAO);

        return new MetricasEquipamentoDTO(
                totalPassagensBancada,
                totalOrdensEmAberto,
                totalEventosHistorico,
                totalMudancasOperacionais,
                totalRetornosParaManutencao,
                tempoMedioHorasPrateleira,
                tempoMedioHorasOperacao,
                tempoMedioHorasManutencao);
    }

    private Long calcularTempoMedioOperacaoAteEntradaBancada(List<HistoricoOperacional> historico) {
        if (historico == null || historico.isEmpty()) {
            return null;
        }

        List<Long> duracoes = extrairDuracoesDosCiclos(historico);

        return duracoes.isEmpty() ? null : calcularMedia(duracoes);
    }

    private List<Long> extrairDuracoesDosCiclos(List<HistoricoOperacional> historico) {
        List<HistoricoOperacional> eventosOrdenados = ordenarPorDataOp(historico);
        List<Long> duracoes = new ArrayList<>();
        LocalDateTime inicioOperacao = null;

        for (HistoricoOperacional evento : eventosOrdenados) {
            if (isInicioDeOperacao(evento) && inicioOperacao == null) {
                inicioOperacao = evento.getDataEvento();
                continue;
            }
            if (isEntradaEmBancada(evento) && inicioOperacao != null) {
                adicionarDuracaoSePositiva(duracoes, inicioOperacao, evento.getDataEvento());
                inicioOperacao = null;
            }
        }

        if (inicioOperacao != null) {
            adicionarDuracaoSePositiva(duracoes, inicioOperacao, LocalDateTime.now());
        }

        return duracoes;
    }

    private List<HistoricoOperacional> ordenarPorDataOp(List<HistoricoOperacional> historico) {
        return historico.stream()
                .sorted(Comparator.comparing(HistoricoOperacional::getDataEvento))
                .toList();
    }

    private boolean isInicioDeOperacao(HistoricoOperacional evento) {
        return evento.getStatus() == StatusOperacional.EM_OPERACAO;
    }

    private boolean isEntradaEmBancada(HistoricoOperacional evento) {
        return evento.getStatus() == StatusOperacional.ENTRADA_EM_BANCADA;
    }

    private void adicionarDuracaoSePositiva(List<Long> duracoes, LocalDateTime inicio, LocalDateTime fim) {
        long minutos = Duration.between(inicio, fim).toMinutes();
        if (minutos > 0) {
            duracoes.add(minutos);
        }
    }

    private Long calcularMedia(List<Long> duracoes) {
        return Math.round(duracoes.stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0));
    }

    private Long calcularTempoMedioPorStatus(List<WorkOrderHistory> historico, StatusManutencao status) {
        if (historico == null || historico.isEmpty()) {
            return null;
        }

        List<WorkOrderHistory> eventosOrdenados = ordenarPorData(historico);

        List<Long> duracoes = (status == StatusManutencao.EM_MANUTENCAO)
                ? extrairDuracoesEmManutencao(eventosOrdenados)
                : extrairDuracoesPorStatusGenerico(eventosOrdenados, status);

        return duracoes.isEmpty() ? null : calcularMedia(duracoes);
    }

    private List<WorkOrderHistory> ordenarPorData(List<WorkOrderHistory> historico) {
        return historico.stream()
                .sorted(Comparator.comparing(WorkOrderHistory::getDataEvento))
                .toList();
    }

    private List<Long> extrairDuracoesEmManutencao(List<WorkOrderHistory> eventosOrdenados) {
        List<Long> duracoes = new ArrayList<>();
        LocalDateTime inicioManutencao = null;

        for (WorkOrderHistory evento : eventosOrdenados) {
            if (evento.getStatus() == StatusManutencao.EM_MANUTENCAO && inicioManutencao == null) {
                inicioManutencao = evento.getDataEvento();
                continue;
            }
            if (evento.getStatus() == StatusManutencao.FINALIZADO && inicioManutencao != null) {
                adicionarDuracaoSePositiva(duracoes, inicioManutencao, evento.getDataEvento());
                inicioManutencao = null;
            }
        }

        if (inicioManutencao != null) {
            adicionarDuracaoSePositiva(duracoes, inicioManutencao, LocalDateTime.now());
        }

        return duracoes;
    }

    private List<Long> extrairDuracoesPorStatusGenerico(List<WorkOrderHistory> eventosOrdenados,
            StatusManutencao status) {
        List<Long> duracoes = new ArrayList<>();

        for (int i = 0; i < eventosOrdenados.size(); i++) {
            WorkOrderHistory atual = eventosOrdenados.get(i);
            if (atual.getStatus() != status) {
                continue;
            }

            LocalDateTime inicio = atual.getDataEvento();
            LocalDateTime fim = obterProximoTimestamp(eventosOrdenados, i);
            adicionarDuracaoSePositiva(duracoes, inicio, fim);
        }

        return duracoes;
    }

    private LocalDateTime obterProximoTimestamp(List<WorkOrderHistory> eventosOrdenados, int indiceAtual) {
        boolean existeProximoEvento = indiceAtual + 1 < eventosOrdenados.size();
        return existeProximoEvento
                ? eventosOrdenados.get(indiceAtual + 1).getDataEvento()
                : LocalDateTime.now();
    }

    private void validarQuantidade(Integer quantidade) {
        if (quantidade == null || quantidade < 0) {
            throw new IllegalArgumentException("A quantidade não pode ser nula ou negativa.");
        }
    }

    private String gerarNumeroOs() {
        return "OS-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
    }
}