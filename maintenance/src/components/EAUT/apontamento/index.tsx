import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout';
import {
    FiArrowLeft,
    FiClock,
    FiUsers,
    FiPlus,
    FiChevronDown,
    FiChevronUp,
    FiFileText,
    FiTool,
    FiCalendar,
    FiSearch,
    FiPackage,
    FiLayers,
    FiCheckCircle,
    FiSliders,
    FiAlertCircle,
    FiEdit,
    FiFilter,
    FiX,
    FiPrinter // NOVO: Importando o ícone de impressora
} from 'react-icons/fi';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import { useWorkOrderService } from '@/app/services/maintenance/workOrder.service';
import { Apontamento, TipoTurno, TurnoLog } from '@/app/models/manutencao'; 

const determinarTipoTurno = (horario: string): string => {
    if (!horario) return 'Desconhecido';
    const [horas, minutos] = horario.split(':').map(Number);
    const tempoDecimal = horas + (minutos / 60);

    if (tempoDecimal >= 6 && tempoDecimal < 15) return 'Manhã';
    if (tempoDecimal >= 15 && tempoDecimal < (22 + 50 / 60)) return 'Tarde';
    return 'Noite';
};

export const ApontamentosPage: React.FC = () => {
    const router = useRouter();
    const service = useWorkOrderService();
    const { showSuccess, showError } = useNotifications();

    const hojeFormatoISO = new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/Sao_Paulo'
    });
    
    const [dataInicio, setDataInicio] = useState<string>(hojeFormatoISO);
    const [dataFim, setDataFim] = useState<string>(hojeFormatoISO);
    const [termoBusca, setTermoBusca] = useState<string>('');
    const [filtroEspecial, setFiltroEspecial] = useState<string>('TODOS');

    const [loading, setLoading] = useState<boolean>(false);
    const [modalTurnoAberto, setModalTurnoAberto] = useState<boolean>(false);
    const [modalApontamentoAberto, setModalApontamentoAberto] = useState<boolean>(false);
    const [turnoAtivoId, setTurnoAtivoId] = useState<number | null>(null);
    const [turnoEditando, setTurnoEditando] = useState<TurnoLog | null>(null);
    const [apontamentoEditando, setApontamentoEditando] = useState<Apontamento | null>(null);

    const [turnos, setTurnos] = useState<TurnoLog[]>([]);

    useEffect(() => {
        if (dataInicio && dataFim) {
            carregarTurnosDoPeriodo(dataInicio, dataFim);
        }
    }, [dataInicio, dataFim]);

    const carregarTurnosDoPeriodo = async (inicio: string, fim: string) => {
        try {
            setLoading(true);
            const dadosDoPeriodo = await service.buscarTurnosPorData(inicio, fim);

            const turnosProcessados = dadosDoPeriodo.map((t: any) => ({
                ...t,
                isExpanded: t.isExpanded ?? false,
                tipoTurno: t.tipoTurno || determinarTipoTurno(t.horarioInicio) 
            }));

            setTurnos(turnosProcessados);
        } catch (error) {
            showError('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    };

    // NOVO: Função para imprimir o relatório em PDF
    const handleImprimirRelatorio = async () => {
        try {
            setLoading(true);
            
            // Certifique-se de que o método no seu service (gerarRelatorioPdf) retorne um Blob
            const responseBlob = await service.gerarRelatorioPdf(dataInicio, dataFim);
            
            const url = window.URL.createObjectURL(new Blob([responseBlob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio-apontamentos-${dataInicio}-ate-${dataFim}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            showSuccess('Relatório gerado com sucesso!');
        } catch (error) {
            console.error(error);
            showError('Erro ao gerar o relatório PDF.');
        } finally {
            setLoading(false);
        }
    };

    const toggleTurno = (id: number) => {
        setTurnos(turnos.map(turno =>
            turno.id === id ? { ...turno, isExpanded: !turno.isExpanded } : turno
        ));
    };

    const formatarDataBR = (dataISO: string) => {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const handleDataInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const novaDataInicio = e.target.value;
        setDataInicio(novaDataInicio);
        if (novaDataInicio > dataFim) {
            setDataFim(novaDataInicio);
        }
    };

    const resetarFiltros = () => {
        setDataInicio(hojeFormatoISO);
        setDataFim(hojeFormatoISO);
        setTermoBusca('');
        setFiltroEspecial('TODOS');
    };

    const filtrosAtivos = dataInicio !== hojeFormatoISO || dataFim !== hojeFormatoISO || termoBusca !== '' || filtroEspecial !== 'TODOS';

    const turnosFiltrados = useMemo(() => {
        return turnos.map(turno => {
            const apontamentosFiltrados = turno.apontamentos.filter(ap => {
                const checkSemSM = !ap.numeroSM || ap.numeroSM.trim() === '';
                const checkSemOS = !ap.numeroOS || ap.numeroOS.trim() === '';

                let passaFiltroEspecial = true;
                if (filtroEspecial === 'SEM_SM') passaFiltroEspecial = checkSemSM;
                if (filtroEspecial === 'SEM_OS') passaFiltroEspecial = checkSemOS;

                const termo = termoBusca.toLowerCase();
                const passaFiltroTexto = termo === '' ||
                    (ap.numeroSM && ap.numeroSM.toLowerCase().includes(termo)) ||
                    (ap.numeroOS && ap.numeroOS.toLowerCase().includes(termo)) ||
                    (ap.trabalhoRealizado && ap.trabalhoRealizado.toLowerCase().includes(termo));

                return passaFiltroEspecial && passaFiltroTexto;
            });

            return { ...turno, apontamentos: apontamentosFiltrados };
        }).filter(turno => {
            if (filtroEspecial !== 'TODOS' || termoBusca !== '') {
                return turno.apontamentos.length > 0;
            }
            return true;
        });
    }, [turnos, filtroEspecial, termoBusca]);

    const totalApontamentos = turnosFiltrados.reduce((acc, t) => acc + t.apontamentos.length, 0);
    const metricasSemSM = turnosFiltrados.reduce((acc, t) => acc + t.apontamentos.filter(ap => !ap.numeroSM || ap.numeroSM.trim() === '').length, 0);
    const metricasSemOS = turnosFiltrados.reduce((acc, t) => acc + t.apontamentos.filter(ap => !ap.numeroOS || ap.numeroOS.trim() === '').length, 0);

    const abrirModalNovoTurno = () => {
        setTurnoEditando(null);
        setModalTurnoAberto(true);
    };

    const abrirModalEditarTurno = (turno: TurnoLog, e: React.MouseEvent) => {
        e.stopPropagation();
        setTurnoEditando(turno);
        setModalTurnoAberto(true);
    };

    const isHojeNoPeriodo = hojeFormatoISO >= dataInicio && hojeFormatoISO <= dataFim;

    const handleSalvarTurno = async (dados: DadosModal) => {
        try {
            if (turnoEditando) {
                const payloadEdicao = {
                    nomeTurma: dados.nomeTurma,
                    horarioTurno: dados.horarioTurno,
                    integrantes: dados.integrantes.split(',').map((i: string) => i.trim())
                };
                await service.editarTurno(turnoEditando.id, payloadEdicao);
                showSuccess('Turno atualizado com sucesso!');
            } else {
                if (!isHojeNoPeriodo) {
                    showError('Só é possível iniciar novos turnos para o dia de hoje.');
                    setModalTurnoAberto(false);
                    return;
                }
                const novoTurno = {
                    nomeTurma: dados.nomeTurma,
                       horarioTurno: dados.horarioTurno,
                    integrantes: dados.integrantes.split(',').map((i: string) => i.trim())
                };
                await service.iniciarTurno(novoTurno);
                showSuccess('Novo turno iniciado!');
            }

            const idParaManterAberto = turnoEditando ? turnoEditando.id : null;

            setLoading(true);
            const dadosDoPeriodo = await service.buscarTurnosPorData(dataInicio, dataFim);
            const turnosProcessados = dadosDoPeriodo.map((t: any) => ({
                ...t,
                isExpanded: idParaManterAberto ? t.id === idParaManterAberto : (t.id === dadosDoPeriodo[0]?.id),
                tipoTurno: t.tipoTurno || determinarTipoTurno(t.horarioInicio)
            }));
            setTurnos(turnosProcessados);
            setLoading(false);

            setModalTurnoAberto(false);
            setTurnoEditando(null);
        } catch (error) {
            setLoading(false);
            showError('Erro ao salvar o turno. Verifique a conexão e tente novamente.');
        }
    };

    const abrirModalNovoApontamento = (turnoId: number) => {
        setTurnoAtivoId(turnoId);
        setApontamentoEditando(null);
        setModalApontamentoAberto(true);
    };

    const abrirModalEditarApontamento = (turnoId: number, apontamento: Apontamento, e: React.MouseEvent) => {
        e.stopPropagation();
        setTurnoAtivoId(turnoId);
        setApontamentoEditando(apontamento);
        setModalApontamentoAberto(true);
    };

    const handleSalvarApontamento = async (dados: DadosModal) => {
        try {
            if (!turnoAtivoId) return;

            const payload = {
                numeroSM: dados.numeroSM,
                numeroOS: dados.numeroOS,
                trabalhoRealizado: dados.trabalhoRealizado
            };

            if (apontamentoEditando) {
                await service.editarTrabalho(turnoAtivoId, apontamentoEditando.id, payload);
                showSuccess('Trabalho updated com sucesso!');
            } else {
                await service.adicionarTrabalho(turnoAtivoId, payload);
                showSuccess('Trabalho registrado!');
            }

            setLoading(true);
            const dadosDoPeriodo = await service.buscarTurnosPorData(dataInicio, dataFim);
            const turnosProcessados = dadosDoPeriodo.map((t: any) => ({
                ...t,
                isExpanded: t.id === turnoAtivoId,
                tipoTurno: t.tipoTurno || determinarTipoTurno(t.horarioInicio)
            }));
            setTurnos(turnosProcessados);
            setLoading(false);

            setModalApontamentoAberto(false);
            setTurnoAtivoId(null);
            setApontamentoEditando(null);
        } catch (error) {
            setLoading(false);
            showError('Erro ao salvar o registro de trabalho. Tente novamente.');
        }
    };

    const formatarTipoTurno = (horarioTurno?: TipoTurno) => {
        switch (horarioTurno) {
          case 'MANHA': return 'Manhã';
          case 'TARDE': return 'Tarde';
          case 'NOITE': return 'Noite';
          default: return 'Comercial';
        }
    };

    const opcoesTipoTurno = [
        { valor: 'MANHA', label: 'Manhã' },
        { valor: 'TARDE', label: 'Tarde' },
        { valor: 'NOITE', label: 'Noite' },
    ];

    const camposNovoTurno: CampoModal[] = [
        { tipo: 'text', nome: 'nomeTurma', label: 'Nome da Turma', required: true },    
        { tipo: 'text', nome: 'integrantes', label: 'Integrantes (Separados por vírgula)', required: false },
        { tipo: 'select', nome: 'horarioTurno', label: 'Período do Turno ', required: true, opcoes: opcoesTipoTurno},
    ];

    const camposNovoApontamento: CampoModal[] = [
        { tipo: 'text', nome: 'numeroSM', label: 'Número da SM (Opcional)', required: false },
        { tipo: 'text', nome: 'numeroOS', label: 'Número da OS (Opcional)', required: false },
        { tipo: 'textarea', nome: 'trabalhoRealizado', label: 'Ocorrência', required: true }
    ];

    return (
        <Layout titulo="Painel Operacional">
            <div className="container mt-5 px-4">

                <div className="is-flex is-justify-content-space-between is-align-items-center mb-5 is-flex-wrap-wrap">
                    <button className="button is-text pl-0" onClick={() => router.back()} type="button">
                        <span className="icon"><FiArrowLeft /></span>
                        <span>Voltar</span>
                    </button>

                    <div className="is-flex is-align-items-center is-flex-wrap-wrap" style={{ gap: '10px' }}>

                        <div className="control has-icons-left">
                            <div className="select">
                                <select
                                    value={filtroEspecial}
                                    onChange={(e) => setFiltroEspecial(e.target.value)}
                                    style={{ borderColor: '#dcdcdc', borderRadius: '6px' }}
                                >
                                    <option value="TODOS">Todos os Serviços</option>
                                    <option value="SEM_SM">Apenas Sem SM</option>
                                    <option value="SEM_OS">Apenas Sem OS</option>
                                </select>
                            </div>
                            <span className="icon is-small is-left has-text-grey">
                                <FiFilter />
                            </span>
                        </div>

                        <div className="is-flex is-align-items-center">
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="date"
                                    value={dataInicio}
                                    onChange={handleDataInicioChange}
                                    style={{ borderColor: '#dcdcdc', borderRadius: '6px' }}
                                    title="Data Inicial"
                                />
                                <span className="icon is-small is-left has-text-grey">
                                    <FiCalendar />
                                </span>
                            </div>
                            <span className="has-text-grey mx-2 is-hidden-mobile">até</span>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="date"
                                    value={dataFim}
                                    min={dataInicio}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    style={{ borderColor: '#dcdcdc', borderRadius: '6px' }}
                                    title="Data Final"
                                />
                                <span className="icon is-small is-left has-text-grey">
                                    <FiCalendar />
                                </span>
                            </div>
                        </div>

                        {filtrosAtivos && (
                            <div className="control">
                                <button
                                    className="button is-danger is-light"
                                    onClick={resetarFiltros}
                                    title="Limpar Filtros e voltar para Hoje"
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="icon is-small"><FiX /></span>
                                </button>
                            </div>
                        )}

                        {/* NOVO: Botão de Imprimir */}
                        { dataInicio == dataFim && <div className="control">
                            <button
                                className={`button is-info ${loading ? 'is-loading' : ''}`}
                                onClick={handleImprimirRelatorio}
                                title="Imprimir Relatório de Turmas"
                                style={{ borderRadius: '6px' }}
                                disabled={loading || turnosFiltrados.length === 0}
                            >
                                <span className="icon is-small"><FiPrinter /></span>
                                <span className="is-hidden-mobile">Imprimir</span>
                            </button>
                        </div>
}
                    </div>
                </div>

                <div className="columns is-desktop">
                    <div className="column is-4-desktop">
                        <div className="box pm-4" style={{ borderTop: '4px solid #001078' }}>
                            <div className="is-flex is-align-items-center mb-4">
                                <span
                                    className="icon is-large has-text-white mr-3"
                                    style={{ backgroundColor: '#001078', borderRadius: '8px', padding: '1.5rem' }}
                                >
                                    <FiPackage size={24} />
                                </span>
                                <div>
                                    <h1 className="title is-5 mb-0">Apontamento Diário</h1>
                                    <span className="is-size-7 has-text-grey">Gerenciamento de Trabalhos</span>
                                </div>
                            </div>

                            <hr className="my-3" />

                            <div className="block is-flex is-justify-content-space-between is-align-items-center">
                                <div>
                                    <p className="heading has-text-grey-semibold mb-1">Serviços Atendidos</p>
                                    <p className="subtitle is-5"><strong>{totalApontamentos} registros</strong></p>
                                </div>
                                <span className="icon has-text-grey-light"><FiLayers size={20} /></span>
                            </div>

                            <div className="block is-flex is-justify-content-space-between is-align-items-center">
                                <div>
                                    <p className="heading has-text-grey-semibold mb-1">Serviço Sem SM</p>
                                    <p className={`subtitle is-5 ${metricasSemSM > 0 ? 'has-text-warning-dark' : 'has-text-success'}`}>
                                        <strong>{metricasSemSM} Serviços</strong>
                                    </p>
                                </div>
                                <span className={`icon ${metricasSemSM > 0 ? 'has-text-warning-dark' : 'has-text-success'}`}>
                                    <FiAlertCircle size={20} />
                                </span>
                            </div>

                            <div className="block is-flex is-justify-content-space-between is-align-items-center">
                                <div>
                                    <p className="heading has-text-grey-semibold mb-1">O.S Não preenchidas</p>
                                    <p className={`subtitle is-5 ${metricasSemOS > 0 ? 'has-text-danger' : 'has-text-success'}`}>
                                        <strong>{metricasSemOS} O.S vazias</strong>
                                    </p>
                                </div>
                                <span className={`icon ${metricasSemOS > 0 ? 'has-text-danger' : 'has-text-success'}`}>
                                    <FiSliders size={20} />
                                </span>
                            </div>

                            <hr className="my-4" />
                            {isHojeNoPeriodo && (
                                <CustomButton
                                    text="Iniciar Novo Turno"
                                    icon={<FiPlus />}
                                    onClick={abrirModalNovoTurno}
                                    className="is-link is-fullwidth"
                                    style={{ borderRadius: '6px' }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="column is-8-desktop">
                        {loading ? (
                            <div className="has-text-centered py-6">
                                <p className="has-text-grey">Carregando registros...</p>
                            </div>
                        ) : turnosFiltrados.length > 0 ? (
                            <div>
                                {turnosFiltrados.map((turno) => {
                                    const tipoTurnoExibicao = turno.horarioTurno;

                                    return (
                                        <div key={turno.id} className="card mb-5" style={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                            <header
                                                className="card-header is-clickable"
                                                onClick={() => toggleTurno(turno.id)}
                                                style={{ backgroundColor: turno.isExpanded ? '#f9fbfe' : '#ffffff', borderTop: '4px solid #3273dc', borderRadius: '8px 8px 0 0' }}
                                            >
                                                <div className="card-header-title is-flex is-justify-content-space-between is-align-items-center" style={{ width: '100%' }}>
                                                    <div className="is-flex is-align-items-center">
                                                        <span className="icon is-medium has-text-link mr-3 bg-light" style={{ backgroundColor: '#ebf2fc', borderRadius: '50%', padding: '1.2rem' }}>
                                                            <FiUsers />
                                                        </span>
                                                        <div>
                                                            <div className="is-flex is-align-items-center">
                                                                <h3 className="title is-6 mb-1 mr-2">{turno.nomeTurma}</h3>
                                                                <button
                                                                    className="button is-small is-ghost px-2 has-text-grey"
                                                                    onClick={(e) => abrirModalEditarTurno(turno, e)}
                                                                    title="Editar Turno"
                                                                >
                                                                    <FiEdit />
                                                                </button>
                                                            </div>
                                                            <p className="is-size-7 has-text-grey is-flex is-align-items-center">
                                                                <FiCalendar className="mr-1" /> {formatarDataBR(turno.dataTurno)}
                                                                <span className="mx-2">•</span>
                                                                <FiClock className="mr-1" /> {turno.horarioInicio}

                                                                <span className={`tag is-light is-small ml-2 ${tipoTurnoExibicao === TipoTurno.MANHA ? 'is-info' :
                                                                    tipoTurnoExibicao === TipoTurno.TARDE ? 'is-warning' : 'is-dark'
                                                                    }`}>
                                                                    {formatarTipoTurno(tipoTurnoExibicao)}
                                                                </span>

                                                                <span className="mx-2">•</span>
                                                                {turno.integrantes.length} integrantes
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="is-flex is-align-items-center">
                                                        <span className={`tag ${turno.apontamentos.length > 0 ? 'is-success is-light' : 'is-light'} mr-4 is-hidden-mobile`}>
                                                            {turno.apontamentos.length} registros
                                                        </span>
                                                        <span className="icon has-text-grey">
                                                            {turno.isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                                                        </span>
                                                    </div>
                                                </div>
                                            </header>

                                            {turno.isExpanded && (
                                                <div className="card-content">
                                                    <div className="mb-4 pb-4" style={{ borderBottom: '1px dashed #e0e0e0', marginTop: '14px' }}>
                                                        <p className="is-size-7 has-text-grey-semibold mb-2">Equipe Logada:</p>
                                                        <div className="tags">
                                                            {turno.integrantes.map((integrante, i) => (
                                                                <span key={i} className="tag is-white" style={{ border: '1px solid #dcdcdc' }}>{integrante}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                                        <h4 className="title is-6 mb-0 has-text-grey-dark">Registros de Trabalho</h4>
                                                        {turno.dataTurno === hojeFormatoISO && (
                                                            <CustomButton
                                                                text="Adicionar Trabalho"
                                                                icon={<FiPlus />}
                                                                onClick={() => abrirModalNovoApontamento(turno.id)}
                                                                className="is-small is-light is-info"
                                                                style={{ borderRadius: '4px' }}
                                                            />
                                                        )}
                                                    </div>

                                                    {turno.apontamentos.length > 0 ? (
                                                        <div className="table-container mt-3">
                                                            <table className="table is-fullwidth is-striped is-hoverable" style={{ border: '1px solid #f0f0f0' }}>
                                                                <thead style={{ backgroundColor: '#fafafa' }}>
                                                                    <tr>
                                                                        <th style={{ width: '130px' }}>SM</th>
                                                                        <th style={{ width: '130px' }}>OS</th>
                                                                        <th>Ocorrência</th>
                                                                        <th style={{ width: '60px', textAlign: 'center' }}>Ações</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {turno.apontamentos.map((apontamento) => (
                                                                        <tr key={apontamento.id}>
                                                                            <td className="is-vcentered">
                                                                                {apontamento.numeroSM ? (
                                                                                    <span className="tag is-info is-light has-text-weight-semibold">{apontamento.numeroSM}</span>
                                                                                ) : (
                                                                                    <span className="tag is-danger is-light">Pendente</span>
                                                                                )}
                                                                            </td>
                                                                            <td className="is-vcentered">
                                                                                {apontamento.numeroOS ? (
                                                                                    <span className="tag is-warning is-light has-text-weight-semibold" style={{ color: '#856404' }}><FiTool className="mr-1" /> {apontamento.numeroOS}</span>
                                                                                ) : (
                                                                                    <span className="tag is-danger is-light">Pendente</span>
                                                                                )}
                                                                            </td>
                                                                            <td className="is-vcentered has-text-dark">{apontamento.trabalhoRealizado}</td>
                                                                            <td className="is-vcentered has-text-centered">
                                                                                <button
                                                                                    className="button is-small is-ghost has-text-grey"
                                                                                    onClick={(e) => abrirModalEditarApontamento(turno.id, apontamento, e)}
                                                                                    title="Editar Registro"
                                                                                >
                                                                                    <FiEdit />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="notification is-light has-text-centered py-4 mt-3" style={{ backgroundColor: '#fcfcfc', border: '1px dashed #dbdbdb' }}>
                                                            <FiFileText className="has-text-grey-light mb-2" size={24} />
                                                            <p className="is-size-7 has-text-grey">Nenhum trabalho correspondente aos filtros.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="box has-text-centered py-6 has-text-grey" style={{ backgroundColor: '#fcfcfc', border: '1px dashed #dbdbdb', boxShadow: 'none' }}>
                                <span className="icon is-large mb-3"><FiSearch size={32} color="#ccc" /></span>
                                <p className="is-size-5 mb-2">Nenhum registro encontrado.</p>
                                {(filtroEspecial !== 'TODOS' || termoBusca !== '') ? (
                                    <p className="is-size-7 mt-2">Tente limpar os filtros de pesquisa para ver outros resultados.</p>
                                ) : (
                                    <p className="is-size-7 mt-2">Tente selecionar outro período no calendário.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalGenerico
                isOpen={modalTurnoAberto}
                onClose={() => setModalTurnoAberto(false)}
                dados={turnoEditando ? { nomeTurma: turnoEditando.nomeTurma, horarioTurno: turnoEditando.horarioTurno, integrantes: turnoEditando.integrantes.join(', ') } : { nomeTurma: '', integrantes: '' }}
                onSave={handleSalvarTurno}
                titulo={turnoEditando ? "Editar Turno" : "Iniciar Novo Turno"}
                campos={camposNovoTurno}
                isEdit={!!turnoEditando}
                textoBotaoSalvar={turnoEditando ? "Salvar Alterações" : "Iniciar Turno"}
            />

            <ModalGenerico
                isOpen={modalApontamentoAberto}
                onClose={() => { setModalApontamentoAberto(false); setTurnoAtivoId(null); setApontamentoEditando(null); }}
                dados={apontamentoEditando ? { numeroSM: apontamentoEditando.numeroSM, numeroOS: apontamentoEditando.numeroOS, trabalhoRealizado: apontamentoEditando.trabalhoRealizado } : { numeroSM: '', numeroOS: '', trabalhoRealizado: '' }}
                onSave={(item) => handleSalvarApontamento(item)}
                titulo={apontamentoEditando ? "Editar Trabalho" : "Registrar Trabalho"}
                campos={camposNovoApontamento}
                isEdit={!!apontamentoEditando}
                textoBotaoSalvar="Salvar Registro"
            />
        </Layout>
    );
};

export default ApontamentosPage;