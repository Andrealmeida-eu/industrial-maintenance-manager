import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiLayers,
  FiPlus,
  FiRefreshCw,
  FiTool,
  FiX,
  FiFilter
} from 'react-icons/fi';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import {
  DetailedEquipmentResponse,
  OperationalHistory,
  StatusManutencao,
  StatusOperacional,
  WorkOrder
} from '@/app/models/manutencao';
import { useWorkOrderService } from '@/app/services/maintenance/workOrder.service';
import LoadingSpinner from '@/components/common/loading';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import { FaArrowsRotate, FaClockRotateLeft } from 'react-icons/fa6';
import { formatarTempo } from '@/util/Datas';

export const DetalheEquipamento: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const service = useWorkOrderService();
  const { notifications, showSuccess, showError, removeNotification } = useNotifications();

  const [equipamento, setEquipamento] = useState<DetailedEquipmentResponse>();
  const [ordensServico, setOrdensServico] = useState<WorkOrder[]>([]);
  const [historicoOperacional, setHistoricoOperacional] = useState<OperationalHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [abaPrincipal, setAbaPrincipal] = useState<'ordens' | 'historico'>('ordens');

  const hojeFormatoISO = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const [dataInicio, setDataInicio] = useState<string>(hojeFormatoISO);
  const [dataFim, setDataFim] = useState<string>(hojeFormatoISO);
  const [statusFiltro, setStatusFiltro] = useState<string>('');

  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [modalStatusAberto, setModalStatusAberto] = useState<boolean>(false);
  const [modalOperacaoAberto, setModalOperacaoAberto] = useState<boolean>(false);

  const [ordensAbertas, setOrdensAbertas] = useState<number[]>([]);
  const [osIdSelecionada, setOsIdSelecionada] = useState<number>(0);

  const [formData] = useState({
    status: 'RECEBIDO',
    defeitoRelatado: '',
    nomeTecnico: '',
    origem: ''
  });

  const [formStatusData, setFormStatusData] = useState({
    status: 'RECEBIDO',
    nomeTecnico: '',
    diagnosticoTecnico: '',
    destinoEquipamento: ''
  });

  const [formOperacaoData, setFormOperacaoData] = useState({
    status: 'EM_OPERACAO',
    nomeTecnico: '',
    destino: '',
    observacao: ''
  });

  const getQueryId = (): number | null => {
    const rawId = Array.isArray(id) ? id[0] : id;
    const parsedId = Number(rawId);
    return Number.isNaN(parsedId) ? null : parsedId;
  };

  useEffect(() => {
    if (!router.isReady) return;
    const queryId = getQueryId();
    if (queryId) {
      buscarEquipamento(queryId);
    }
  }, [router.isReady, id]);

  useEffect(() => {
    if (!router.isReady) return;
    const queryId = getQueryId();
    if (queryId) {
      buscarListas(queryId);
    }
  }, [router.isReady, id, dataInicio, dataFim, statusFiltro]);

  const buscarEquipamento = async (equipId: number) => {
    try {
      const resposta = await service.getEquipDetailed(equipId);
      setEquipamento(resposta);
    } catch (error) {
      showError('Erro ao carregar dados do equipamento.');
    }
  };

  const buscarListas = async (equipId: number) => {
    try {
      setLoading(true);
      const [ordens, historico] = await Promise.all([
        service.getOrdensEquipamento(equipId, { dataInicio, dataFim, status: statusFiltro }),
        service.getHistoricoEquipamento(equipId, { dataInicio, dataFim })
      ]);
      setOrdensServico(ordens);
      setHistoricoOperacional(historico);
      if (ordens.length > 0 && ordensAbertas.length === 0) {
        setOrdensAbertas([ordens[0].id]);
      }
    } catch (error) {
      showError('Erro ao carregar listas filtradas.');
    } finally {
      setLoading(false);
    }
  };

  const recarregarTudo = async () => {
    const queryId = getQueryId();
    if (queryId) {
      await Promise.all([buscarEquipamento(queryId), buscarListas(queryId)]);
    }
  };

  const handleDataInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaDataInicio = e.target.value;
    setDataInicio(novaDataInicio);
    if (novaDataInicio > dataFim) {
      setDataFim(novaDataInicio);
    }
  };

  const limparFiltrosData = () => {
    setDataInicio(hojeFormatoISO);
    setDataFim(hojeFormatoISO);
    setStatusFiltro('');
  };

  const toggleOrdemServico = (osId: number) => {
    setOrdensAbertas((prev) =>
      prev.includes(osId)
        ? prev.filter((idAtual) => idAtual !== osId)
        : [...prev, osId]
    );
  };

  const isOrdemAberta = (osId: number) => ordensAbertas.includes(osId);

  const formatarData = (data?: string | null) => {
    if (!data) return 'Em aberto';
    return new Date(data).toLocaleString('pt-BR');
  };

  const getColorTag = (status?: string): string => {
    switch (status) {
      case 'RECEBIDO': return 'is-info is-light';
      case 'EM_ANALISE': return 'is-warning is-light';
      case 'EM_MANUTENCAO': return 'is-warning';
      case 'AGUARDANDO_PECA': return 'is-danger is-light';
      case 'EM_REPARO': return 'is-link is-light';
      case 'PRONTO': return 'is-success';
      case 'ENTREGUE': return 'is-primary';
      default: return 'is-light';
    }
  };

  const getColorTagOperacional = (status?: StatusOperacional): string => {
    switch (status) {
      case 'EM_OPERACAO': return 'is-success';
      case 'DISPONIVEL_PRATELEIRA': return 'is-link is-light';
      case 'EM_MANUTENCAO': return 'is-warning';
      case 'ENTRADA_EM_BANCADA': return 'is-dark is-light';
      default: return 'is-light';
    }
  };

  const formatarStatusOperacional = (status?: StatusOperacional) => {
    switch (status) {
      case 'EM_OPERACAO': return 'Em Operação';
      case 'DISPONIVEL_PRATELEIRA': return 'Disponível em Prateleira';
      case 'EM_MANUTENCAO': return 'Em Manutenção';
      case 'ENTRADA_EM_BANCADA': return 'Entrada em Bancada';
      default: return 'Sem status';
    }
  };

  const abrirModalStatus = (id: number) => {
    setOsIdSelecionada(id);
    setFormStatusData({
      status: 'RECEBIDO',
      nomeTecnico: '',
      diagnosticoTecnico: '',
      destinoEquipamento: ''
    });
    setModalStatusAberto(true);
  };

  const abrirModalOperacao = (status: StatusOperacional) => {
    setFormOperacaoData({
      status,
      destino: '',
      nomeTecnico: '',
      observacao: ''
    });
    setModalOperacaoAberto(true);
  };

  const handleAbrirOrdem = async (dados: DadosModal) => {
    try {
      setLoading(true);
      await service.cadastrarOS({
        equipamentoId: getQueryId(),
        origem: dados.origem,
        nomeTecnico: dados.nomeTecnico,
        status: dados.status,
        defeitoRelatado: dados.defeitoRelatado
      });
      showSuccess('Nova entrada de bancada registrada!');
      setModalAberto(false);
      await recarregarTudo();
    } catch (error) {
      setLoading(false);
      showError('Falha ao abrir ordem de serviço.');
    }
  };

  const handleAtualizarStatusOS = async (dados: DadosModal) => {
    try {
      setLoading(true);
      await service.atualizarHistoricoOS(osIdSelecionada, {
        status: dados.status,
        equipamentoId: equipamento?.id,
        nomeTecnico: dados.nomeTecnico,
        trabalhoExecutado: dados.diagnosticoTecnico
      });
      showSuccess('Registro da ordem de serviço atualizado com sucesso!');
      setModalStatusAberto(false);
      await recarregarTudo();
    } catch (error) {
      setLoading(false);
      showError('Erro ao atualizar registro.');
    }
  };

  const handleAtualizarStatusOperacional = async (dados: DadosModal) => {
    try {
      setLoading(true);
      await service.atualizarStatusOperacional({
        equipamentoId: getQueryId(),
        status: dados.status,
        destino: dados.destino || null,
        nomeTecnico: dados.nomeTecnico,
      });
      showSuccess('Status operacional atualizado com sucesso!');
      setModalOperacaoAberto(false);
      await recarregarTudo();
    } catch (error) {
      setLoading(false);
      showError('Erro ao atualizar status operacional.');
    }
  };

  const camposNovaOS: CampoModal[] = [
    { tipo: 'text', nome: 'nomeTecnico', label: 'Técnico', required: false },
    { tipo: 'text', nome: 'origem', label: 'Origem', required: false },
    {
      tipo: 'select',
      nome: 'status',
      label: 'Status de Entrada',
      opcoes: [
        { valor: 'RECEBIDO', label: 'Recebido' },
        { valor: 'EM_ANALISE', label: 'Em Análise' }
      ],
      required: true
    },
    { tipo: 'textarea', nome: 'defeitoRelatado', label: 'Sintomas / Defeito Relatado', required: true }
  ];

  const camposStatusOS: CampoModal[] = [
    { tipo: 'text', nome: 'nomeTecnico', label: 'Técnico', required: false },
    {
      tipo: 'select',
      nome: 'status',
      label: 'Alterar Status Atual',
      opcoes: [
        { valor: 'RECEBIDO', label: 'Recebido' },
        { valor: 'MANUTENCAO_EXTERNA', label: 'Manutenção Externa' },
        { valor: 'EM_MANUTENCAO', label: 'Em Manutenção' },
        { valor: 'AGUARDANDO_PECA', label: 'Aguardando Peça' },
        { valor: 'FINALIZADO', label: 'Finalizado' }
      ],
      required: true
    },
    { tipo: 'textarea', nome: 'diagnosticoTecnico', label: 'Laudo Técnico / Evolução do Reparo', required: false },

  ];

  const camposStatusOperacional: CampoModal[] = [
    {
      tipo: 'select',
      nome: 'status',
      label: 'Novo status operacional',
      opcoes: [
        { valor: 'EM_OPERACAO', label: 'Em Operação' },
        { valor: 'DISPONIVEL_PRATELEIRA', label: 'Disponível em Prateleira' },
        { valor: 'EM_MANUTENCAO', label: 'Em Manutenção' },
        { valor: 'INATIVO', label: 'Inativo' }
      ],
      required: true
    },
    { tipo: 'text', nome: 'nomeTecnico', label: 'Responsável', required: false },
    { tipo: 'text', nome: 'destino', label: 'Destino', required: false },
  ];

  if (loading && !equipamento) {
    return (
      <div className="section has-text-centered">
        <LoadingSpinner show={true} isMobile={false} />
      </div>
    );
  }

  if (!equipamento) {
    return (
      <Layout titulo="Erro">
        <div className="container mt-6">
          <div className="notification is-danger">Equipamento não localizado.</div>
        </div>
      </Layout>
    );
  }

  const metric = equipamento.metricas;
  const filtrosAtivos = dataInicio !== hojeFormatoISO || dataFim !== hojeFormatoISO || statusFiltro !== '';

  return (
    <Layout titulo="Painel do Equipamento">
      <div className="container mt-5 px-4">
        <NotificationContainer notifications={notifications} onRemove={removeNotification} />

        <button className="button is-text pl-0 mb-4" onClick={() => router.back()} type="button">
          <span className="icon"><FiArrowLeft /></span>
          <span>Voltar para a lista geral</span>
        </button>

        <div className="columns is-desktop">
          <div className="column is-4-desktop">
            <div className="box pm-4 mb-4" style={{ borderTop: '4px solid #3273dc' }}>
              <div className="is-flex is-align-items-center mb-4">
                <span className="icon is-large has-text-link bg-light mr-3" style={{ backgroundColor: '#ebf2fc', borderRadius: '8px', padding: '1.5rem' }}>
                  <FiTool size={24} />
                </span>
                <div>
                  <h1 className="title is-5 mb-0">{equipamento.nome}</h1>

                </div>
              </div>

              <hr className="my-3" />

              <div className="block">
                <p className="heading has-text-grey-semibold mb-1">Número de Série / Tag</p>
                <p className="subtitle is-6"><strong>{equipamento.numeroSerie}</strong></p>
              </div>

              <div className="block">
                <p className="heading has-text-grey-semibold mb-1">Métrica de Confiabilidade</p>
                <span className="icon-text text-dark is-flex mb-2">
                  <span className="icon has-text-grey"><FiLayers /></span>
                  <span>{ordensServico.length} passagens por bancada</span>
                </span>
                <span className="icon-text text-dark is-flex mb-2">
                  <span className="icon has-text-grey"><FaArrowsRotate /></span>
                  <span>Em Operação: {formatarTempo(metric?.tempoMedioHorasOperacao)}</span>
                </span>
                <span className="icon-text text-dark is-flex">
                  <span className="icon has-text-grey"><FaClockRotateLeft /></span>
                  <span>Em Manutenção: {formatarTempo(metric?.tempoMedioHorasManutencao)}</span>
                </span>
              </div>

              <hr className="my-4" />

              <CustomButton text="Entrada em Bancada" icon={<FiPlus />} onClick={() => setModalAberto(true)} className="is-fullwidth" style={{ borderRadius: '6px' }} />
            </div>

            <div className="box mb-4" style={{ borderTop: '4px solid #48c78e' }}>
              <div className="is-flex is-justify-content-between is-align-items-center mb-2 is-flex-wrap-wrap">
                <div className="mr-3">
                  <p className="heading has-text-grey-semibold mb-1">Status Operacional Atual</p>
                  <p className="subtitle is-6 mb-1"><strong>{formatarStatusOperacional(equipamento.statusOperacionalAtual)}</strong></p>
                  <p className="is-size-7 mb-2 has-text-grey">Última atualização: {formatarData(equipamento.dataUltimoStatusOperacional)}</p>
                </div>
                <span className={`tag ${getColorTagOperacional(equipamento.statusOperacionalAtual)}`}>
                  {formatarStatusOperacional(equipamento.statusOperacionalAtual)}
                </span>
              </div>

              <div className="buttons is-flex-wrap-wrap">
                <CustomButton text="Marcar em Operação" onClick={() => abrirModalOperacao(StatusOperacional.EM_OPERACAO)} className="is-small" style={{ borderRadius: '6px' }} />
                <CustomButton text="Enviar p/ Prateleira" onClick={() => abrirModalOperacao(StatusOperacional.DISPONIVEL_PRATELEIRA)} className="is-small is-light" style={{ borderRadius: '6px' }} />
                <CustomButton text="Em Manutenção" onClick={() => abrirModalOperacao(StatusOperacional.EM_MANUTENCAO)} className="is-small is-warning" style={{ borderRadius: '6px' }} />
              </div>
            </div>

            <div className="box">
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <h2 className="title is-6 mb-0 is-flex is-align-items-center">
                  <span className="icon mr-2 has-text-success">
                    <FiRefreshCw />
                  </span>
                  Recentes
                </h2>
                <button
                  onClick={() => setAbaPrincipal('historico')}
                  className="button is-small is-link is-light"
                  style={{ borderRadius: '6px' }}
                >
                  Ver Completo
                </button>
              </div>

              {historicoOperacional.length ? (
                <div className="pl-4 ml-2" style={{ borderLeft: '2px solid #dbdbdb' }}>
                  {historicoOperacional.slice(0, 5).map((evento) => (
                    <div key={evento.id} className="mb-5" style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '-23px',
                          top: '4px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#48c78e',
                          border: '2px solid #fff'
                        }}
                      />
                      <div className="notification is-light px-4 py-3" style={{ backgroundColor: '#fcfcfc', border: '1px solid #f0f0f0' }}>
                        <p className="is-size-6 mb-1"><strong>Status:</strong> {formatarStatusOperacional(evento.status)}</p>
                        <p className="is-size-7 has-text-grey mb-1"><strong>Data:</strong> {formatarData(evento.dataEvento)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="has-text-centered py-4 has-text-grey">
                  Nenhum status operacional registrado.
                </div>
              )}
            </div>
          </div>

          <div className="column is-8-desktop">
            <div className="box" style={{ boxShadow: 'none' }}>

              <div className="tabs is-boxed mb-5">
                <ul>
                  <li className={abaPrincipal === 'ordens' ? 'is-active' : ''}>
                    <a onClick={() => setAbaPrincipal('ordens')} className="has-text-weight-medium">
                      <span className="icon is-small mr-2"><FiActivity /></span>
                      <span>Ordens de Serviço</span>
                    </a>
                  </li>
                  <li className={abaPrincipal === 'historico' ? 'is-active' : ''}>
                    <a onClick={() => setAbaPrincipal('historico')} className="has-text-weight-medium">
                      <span className="icon is-small mr-2"><FiRefreshCw /></span>
                      <span>Histórico Operacional Completo</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="notification is-light py-3 px-4 mb-5" style={{ backgroundColor: 'rgb(255, 255, 255)', borderRadius: '0px', border: '0px' }}>
                <div className="columns is-mobile is-multiline is-vcentered">
                  <div className={`column is-12-mobile ${abaPrincipal === 'ordens' ? 'is-3-tablet' : 'is-5-tablet'}`}>
                    <div className="field">
                      <label className="label is-small">Data Inicial</label>
                      <div className="control has-icons-left">
                        <input className="input is-small" type="date" value={dataInicio} onChange={handleDataInicioChange} />
                        <span className="icon is-small is-left"><FiCalendar /></span>
                      </div>
                    </div>
                  </div>

                  <div className={`column is-12-mobile ${abaPrincipal === 'ordens' ? 'is-3-tablet' : 'is-5-tablet'}`}>
                    <div className="field">
                      <label className="label is-small">Data Final</label>
                      <div className="control has-icons-left">
                        <input className="input is-small" type="date" value={dataFim} min={dataInicio} onChange={(e) => setDataFim(e.target.value)} />
                        <span className="icon is-small is-left"><FiCalendar /></span>
                      </div>
                    </div>
                  </div>

                  {abaPrincipal === 'ordens' && (
                    <div className="column is-12-mobile is-4-tablet">
                      <div className="field">
                        <label className="label is-small">Status da OS</label>
                        <div className="control has-icons-left">
                          <div className="select is-small is-fullwidth">
                            <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                              <option value="">Todos os Status</option>
                              <option value="RECEBIDO">Recebido</option>
                              <option value="MANUTENCAO_EXTERNA">Manutenção Externa</option>
                              <option value="EM_MANUTENCAO">Em Manutenção</option>
                              <option value="AGUARDANDO_PECA">Aguardando Peça</option>
                              <option value="EM_TESTE">Em Teste</option>
                              <option value="FINALIZADO">Pronto / Concluído</option>
                            </select>
                          </div>
                          <span className="icon is-small is-left">
                            <FiFilter />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="column is-12-mobile is-2-tablet has-text-right-tablet mt-4">
                    {filtrosAtivos && (
                      <button type="button" className="button is-small is-danger is-light is-fullwidth-mobile" onClick={limparFiltrosData} title="Limpar filtros">
                        <span className="icon"><FiX /></span>
                        <span className="is-hidden-tablet">Limpar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {abaPrincipal === 'ordens' && (
                <div>
                  {loading ? (
                    <div className="has-text-centered py-6">
                      <LoadingSpinner show={true} isMobile={false} />
                    </div>
                  ) : ordensServico.length > 0 ? (
                    <div>
                      {ordensServico.map((os) => {
                        const aberta = isOrdemAberta(os.id);

                        return (
                          <div key={os.id}
                            className="card mb-4"
                            style={{
                              borderRadius: '8px',
                              boxShadow: '0 1px 3px rgba(10,10,10,0.05)',
                              overflow: 'hidden'
                            }}
                          >
                            <div className="card"
                              style={{
                                border: '1px solid #ececec',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(10,10,10,0.05)',
                                overflow: 'hidden'
                              }}
                            >
                              <div role="button"
                                tabIndex={0}
                                className="is-white is-fullwidth"
                                onClick={() => toggleOrdemServico(os.id)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOrdemServico(os.id); } }}
                                style={{
                                  height: 'auto',
                                  justifyContent: 'space-between',
                                  padding: '1.25rem',
                                  borderRadius: 0,
                                  cursor: 'pointer'
                                }}
                              >
                                <div className="has-text-left" style={{ width: '100%' }}>
                                  <div className="is-flex is-justify-content-between is-align-items-flex-start is-flex-wrap-wrap">
                                    <div className="mr-4" style={{ flex: 1 }}>
                                      <div className="is-flex is-align-items-center is-flex-wrap-wrap mb-3">
                                        <span className={`tag ${getColorTag(os.statusAtual)} mr-2`}>{os.statusAtual}</span>
                                        <span className="has-text-weight-semibold has-text-dark mr-3">{os.numeroOs}</span>
                                        {os.tecnicoAtual && <span className="is-size-7 has-text-grey">Técnico atual: <strong>{os.tecnicoAtual}</strong></span>}
                                      </div>

                                      <div className="columns is-multiline is-mobile mb-1">
                                        <div className="column is-12-mobile is-6-tablet"><p className="is-size-7 has-text-grey mb-1"><strong>Abertura:</strong> {formatarData(os.dataAbertura)}</p></div>
                                        <div className="column is-12-mobile is-6-tablet"><p className="is-size-7 has-text-grey mb-1"><strong>Fechamento:</strong> {formatarData(os.dataFechamento)}</p></div>
                                      </div>

                                      <p className="heading has-text-grey-semibold mb-1">Equipamento/Setor de Origem</p>
                                      <p className="subtitle is-6"><strong>{os.origem}</strong></p>
                                      <p className="is-size-6 mt-2 mb-0 has-text-grey-dark"><strong>Defeito relatado:</strong> {os.defeitoRelatado}</p>

                                    </div>

                                    <div className="ml-3 mt-2">
                                      {os.statusAtual !== StatusManutencao.FINALIZADO && (
                                        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                          <CustomButton text="Atualizar Registro" icon={<FiPlus />} onClick={() => abrirModalStatus(os.id)} className="is-white is-small" style={{ borderRadius: '6px' }} />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {aberta && (
                              <div className="card-content pt-0" style={{ paddingTop: 0, backgroundColor: '#fff', marginTop: '15px' }}>
                                <div className="pl-4 ml-2" style={{ borderLeft: '2px solid #dbdbdb' }}>
                                  {os.historico && os.historico.length > 0 ? (
                                    os.historico.map((evento: any) => (
                                      <div key={evento.id} className="mb-5" style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-23px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3273dc', border: '2px solid #fff' }} />
                                        <div className="is-flex is-align-items-center is-justify-content-between is-flex-wrap-wrap mb-2">
                                          <div className="is-flex is-align-items-center is-flex-wrap-wrap">
                                            <span className={`tag ${getColorTag(evento.status)} mr-3`}>{evento.status}</span>
                                            <span className="is-size-6 has-text-grey"><strong>{evento.nomeTecnico || 'Técnico não informado'}</strong> | {formatarData(evento.dataEvento)}</span>
                                          </div>
                                        </div>

                                        <div className="notification is-light px-4 py-3" style={{ backgroundColor: '#fcfcfc', border: '1px solid #f0f0f0' }}>
                                          <p className="is-size-6 mb-2"><strong className="has-text-grey-dark">Trabalho executado:</strong> {evento.trabalhoExecutado || <span className="has-text-grey italic">Sem laudo informado para esta etapa.</span>}</p>
                                          {evento.observacao && <p className="is-size-6 mb-2"><strong className="has-text-grey-dark">Observação:</strong> {evento.observacao}</p>}
                                          {evento.defeitoRelatado && <p className="is-size-6 mb-2"><strong className="has-text-grey-dark">Defeito complementar:</strong> {evento.defeitoRelatado}</p>}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="has-text-centered py-4 has-text-grey">Nenhum evento de histórico encontrado para esta OS.</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="has-text-centered py-6 has-text-grey">
                      <span className="icon is-large"><FiAlertCircle size={32} /></span>
                      <p className="mt-2">Nenhuma ordem de serviço encontrada para os filtros selecionados.</p>
                    </div>
                  )}
                </div>
              )}

              {abaPrincipal === 'historico' && (
                <div>
                  {loading ? (
                    <div className="has-text-centered py-6">
                      <LoadingSpinner show={true} isMobile={false} />
                    </div>
                  ) : historicoOperacional.length > 0 ? (
                    <div className="pl-4 ml-2" style={{ borderLeft: '2px solid #dbdbdb' }}>
                      {historicoOperacional.map((evento) => (
                        <div key={evento.id} className="mb-5" style={{ position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-23px',
                              top: '4px',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#48c78e',
                              border: '2px solid #fff'
                            }}
                          />

                          <div
                            className="notification is-light px-4 py-3"
                            style={{
                              backgroundColor: '#fcfcfc',
                              border: '1px solid #f0f0f0'
                            }}
                          >
                            <div className="columns is-vcentered">
                              <div className="column is-7">
                                <p className="is-size-6 mb-1">
                                  <strong>Status:</strong> {formatarStatusOperacional(evento.status)}
                                </p>
                                <p className="is-size-7 has-text-grey mb-1">
                                  <strong>Responsável:</strong> {evento.nomeTecnico || 'Não informado'}
                                </p>
                                <p className="is-size-7 has-text-grey mb-0">
                                  <strong>Destino:</strong> {evento.destino || 'Sem observação'}
                                </p>
                              </div>
                              <div className="column is-5 has-text-right-tablet">
                                <p className="is-size-7 has-text-grey">
                                  <strong>Data:</strong> {formatarData(evento.dataEvento)}
                                </p>
                              </div>
                            </div>

                            {evento.observacao && (
                              <div className="mt-3 pt-3" style={{ borderTop: '1px dashed #e0e0e0' }}>
                                <p className="is-size-7 has-text-grey">
                                  <strong>Observação:</strong> {evento.observacao}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="has-text-centered py-6 has-text-grey">
                      <span className="icon is-large"><FiAlertCircle size={32} /></span>
                      <p className="mt-2">Nenhum status operacional registrado para o período selecionado.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalGenerico 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        dados={formData} 
        onSave={handleAbrirOrdem} 
        titulo="Nova Entrada de Equipamento em Bancada" 
        campos={camposNovaOS} 
        isEdit={false} 
        textoBotaoSalvar="Abrir OS" />


      <ModalGenerico
        isOpen={modalStatusAberto}
        onClose={() => setModalStatusAberto(false)}
        dados={formStatusData}
        onSave={handleAtualizarStatusOS}
        titulo={`Atualizar Registro da OS #${osIdSelecionada}`}
        campos={camposStatusOS}
        isEdit={false}
        textoBotaoSalvar="Salvar Alterações"
      />
      <ModalGenerico 
        isOpen={modalOperacaoAberto} 
        onClose={() => setModalOperacaoAberto(false)} 
        dados={formOperacaoData} 
        onSave={handleAtualizarStatusOperacional} 
        titulo="Atualizar Status Operacional" 
        campos={camposStatusOperacional} 
        isEdit={false} 
        textoBotaoSalvar="Salvar Status" 
        />
    </Layout>
  );
};

export default DetalheEquipamento;