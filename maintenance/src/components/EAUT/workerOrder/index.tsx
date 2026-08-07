import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiTrash2, FiEdit, FiChevronUp, FiChevronRight, FiChevronDown, FiBarChart2, FiMoreVertical, FiX, FiPlus, FiTool, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { WorkOrder, StatusManutencao, DetailedEquipmentResponse } from '@/app/models/manutencao'; // Ajustado para seu novo modelo
import { useWorkOrderService } from '@/app/services/maintenance/workOrder.service'; // Ajustado para seu novo service
import { FaCalendar, FaClock, FaTools } from 'react-icons/fa';
import CardList from '@/components/common/tableMobile';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import LoadingSpinner from '@/components/common/loading';


export const GerenciamentoOs: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const service = useWorkOrderService();
  const router = useRouter();
  const {
    notifications,
    showSuccess,
    showError,
    showWarning,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [equips, setEquips] = useState<DetailedEquipmentResponse[]>([]);
  const [EquipsOptions, setEquipsOptions] = useState<DetailedEquipmentResponse[]>([]);

  const [osExpandidas, setOsExpandidas] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [osIdStatus, setOsIdStatus] = useState<number>();

  const [formData, setFormData] = useState({
    nome: '',
    numeroSerie: ''
  });

  // ========== ESTADOS DE FILTROS E ORDENAÇÃO ==========
  const [filtroEquipamento, setFiltroEquipamento] = useState<string>('');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [ordem, setOrdem] = useState<{ campo: keyof DetailedEquipmentResponse; direcao: 'asc' | 'desc' }>({ campo: 'statusOperacionalAtual', direcao: 'desc' });

  // ========== EFEITOS ==========
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    carregarOrdensServico();
    carregarEquips()
  }, []);

  const carregarOrdensServico = async () => {
    try {
      setLoading(true);

      const resposta: DetailedEquipmentResponse[] = await service.getEquip();
      console.log("-------> " + resposta)
      setEquips(Array.isArray(resposta) ? resposta : [resposta]);
    } catch (error) {
      showError('Falha ao carregar ordens de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const carregarEquips = async () => {
    try {
      setLoading(true);

      const resposta: DetailedEquipmentResponse[] = await service.getEquips();
      console.log("-------> " + resposta)
      setEquipsOptions(Array.isArray(resposta) ? resposta : [resposta]);
    } catch (error) {
      showError('Falha ao carregar ordens de serviço.');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES DE CONTROLE DE UI ==========
  const getColorTag = (status: StatusManutencao): string => {
    switch (status) {
      case 'RECEBIDO': return 'is-info is-light';
      case 'EM_MANUTENCAO': return 'is-warning is-light';
      case 'AGUARDANDO_PECA': return 'is-danger is-light';
      case 'MANUTENCAO_EXTERNA': return 'is-link is-light';
      case 'FINALIZADO': return 'is-primary';
      default: return 'is-light';
    }
  };


  const fecharModal = () => {
    setModalAberto(false);
    setFormData({ nome: '', numeroSerie: '' });
  };

  const fecharModalAcao = async () => {
    setModalAberto(false);
    setFormData({ nome: '', numeroSerie: '' });
    await carregarOrdensServico();
  };

  const abrirModalStatus = (os: WorkOrder) => {
    setModalAberto(true);
    setOsIdStatus(os.id);
    setFormData({
      nome: os.statusAtual,
      numeroSerie: os.trabalhoExecutado || ''
    });
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const getDetailerEquip = (id: Number) => {
    router.push(`/eaut/detailed-equipment/${id}`)
  }


  // ========== FILTRO E ORDENAÇÃO LOGIC ==========
  const osFiltradasOrdenadas = equips
    .filter(os => {
      const origemMatch =
        os.origem
          ?.toLowerCase()
          .includes(filtroOrigem.toLowerCase()) ?? false;

      const statusMatch =
        filtroStatus === 'todos' ||
        os.statusOperacionalAtual?.toLowerCase() === filtroStatus.toLowerCase();
      console.log("ORIGEM ", statusMatch + filtroStatus + "=======>> " + os.statusOperacionalAtual)
      return origemMatch && statusMatch;
    })
    .sort((a, b) => {
      const valorA = a[ordem.campo] ?? '';
      const valorB = b[ordem.campo] ?? '';

      if (valorA < valorB) return ordem.direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordem.direcao === 'asc' ? 1 : -1;
      return 0;
    });


  // ========== CONFIGURAÇÕES DO MODAL (MUDANÇA DE STATUS) ==========


  const optionsEquipamento = EquipsOptions.map((equip) => ({
    valor: String(equip.id),
    label: equip.nome
  }));

  const camposNovaOS: CampoModal[] = [
    {
      tipo: 'text',
      nome: 'nomeTecnico',
      label: 'Técnico',
      required: false
    },
    {
      tipo: 'select',
      nome: 'equipamentoId',
      label: 'Equipamento',
      opcoes: optionsEquipamento,
      required: true
    },
    {
      tipo: 'text',
      nome: 'origem',
      label: 'Origem',
      required: false
    },
    {
      tipo: 'textarea',
      nome: 'defeitoRelatado',
      label: 'Sintomas / Defeito Relatado',
      required: true
    }
  ];

  // ========== FUNÇÕES DE CRUD ==========


  const addEquipment = async (dados: DadosModal) => {
    try {
      setLoading(true);
      await service.cadastrarOS({
        nomeTecnico: dados.nomeTecnico,
        equipamentoId: dados.equipamentoId,
        defeitoRelatado: dados.defeitoRelatado,
        origem: dados.origem

      });
      showSuccess('Status atualizado com sucesso!');
      fecharModalAcao();
    } catch (error) {
      showError('Erro ao atualizar status da OS.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <LoadingSpinner show={loading} isMobile={isMobile} />
        </div>
      </div>
    );
  }

  return (
    <Layout titulo="Controle de Manutenção de Bancada">
      <div className="container mt-6">
        <NotificationContainer notifications={notifications} onRemove={removeNotification} />

        <div className="box" style={{ boxShadow: 'none' }}>


          {/* Filtros customizados para o nicho de Manutenção */}
          <div className="columns is-multiline is-mobile">
            <div className="column is-12-mobile is-4-tablet">
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                      <option value="todos">Todos os Status</option>
                      <option value="RECEBIDO">Recebido</option>
                      <option value="EM_TESTE">Em Teste</option>
                      <option value="AGUARDANDO_PECA">Aguardando Peça</option>
                      <option value="EM_MANUTENCAO">Em Manutenção</option>
                      <option value="MANUTENCAO_EXTERNA">Manutenção Externa</option>
                      <option value="FINALIZADO">Finalizado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-12-mobile is-4-tablet">
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input is-fullwidth" type="text" placeholder="Filtrar por Equipamento" value={filtroEquipamento} onChange={e => setFiltroEquipamento(e.target.value)} />
                  <span className="icon is-left"><FiSearch /></span>
                </div>
              </div>
            </div>

            <div className="column is-12-mobile is-4-tablet">
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input is-fullwidth" type="text" placeholder="Filtrar por Origem/Setor" value={filtroOrigem} onChange={e => setFiltroOrigem(e.target.value)} />
                  <span className="icon is-left"><FiSearch /></span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de OS Desktop */}
          <div className="table-container" style={{ overflow: 'hidden' }}>


            {/* Lista Mobile baseada no CardList original */}

            <CardList
              data={osFiltradasOrdenadas}
              titleField="nome"
              icon={<FaTools />}
              hiddenBreakpoint='none'
              iconColor="is-primary-custom"
              subtitleField="origem"
              fields={[
                { label: 'Série:', key: 'numeroSerie' },
              ]}
              tags={[
                {
                  label: 'Status',
                  key: 'status',
                  color: (item: any) => getColorTag(item.status),
                  format: (status: string) => status
                }
              ]}
              actions={[
                { label: '', color: 'is-primary is-light', onClick: (item) => getDetailerEquip(item.id), icon: <FiPlus />, itemAtivo: true },
              ]}
            />

          </div>
        </div>
      </div>



      <ModalGenerico
        isOpen={modalAberto}
        onClose={() => fecharModal()}
        dados={formData}
        onSave={addEquipment}
        titulo={'Equipamento'}
        campos={camposNovaOS}
        isEdit={false}
        textoBotaoSalvar="Salvar"
      />
    </Layout>
  );
};

export default GerenciamentoOs;
