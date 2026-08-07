import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { FiSearch, FiTrash2, FiEdit, FiChevronUp, FiChevronRight, FiChevronDown, FiBarChart2, FiMoreVertical, FiX, FiPlus, FiTool } from 'react-icons/fi';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import { useRouter } from 'next/router';
import { WorkOrder, StatusManutencao, DetailedEquipmentResponse, StatusOperacional } from '@/app/models/manutencao';
import { useWorkOrderService } from '@/app/services/maintenance/workOrder.service';
import { FaCalendar, FaClock, FaTools } from 'react-icons/fa';
import CardList from '@/components/common/tableMobile';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import LoadingSpinner from '@/components/common/loading';


export const GerenciamentoEquips: React.FC = () => {
  // ========== SERVICES E HOOKS ==========
  const service = useWorkOrderService();
  const router = useRouter();
  const {
    notifications,
    showSuccess,
    showError,
    removeNotification
  } = useNotifications();

  // ========== ESTADOS DE DADOS ==========
  const [equips, setEquips] = useState<DetailedEquipmentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [equipId, setEquipId] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    nome: '',
    numeroSerie: ''
  });

  // ========== ESTADOS DE FILTROS E ORDENAÇÃO ==========
  const [filtroEquipamento, setFiltroEquipamento] = useState<string>('');

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

  // ========== FUNÇÕES DE CONTROLE DE UI ==========


  const getColorTagOperacional = (status?: StatusOperacional): string => {
    switch (status) {
      case 'EM_OPERACAO': return 'is-success';
      case 'DISPONIVEL_PRATELEIRA': return 'is-link is-light';
      case 'EM_MANUTENCAO': return 'is-warning';
      case 'ENTRADA_EM_BANCADA': return 'is-info is-light';
      default: return 'is-light';
    }
  };

  const formatarStatusOperacional = (status?: StatusOperacional) => {
    console.log("na funa", status)
    switch (status) {
      case 'EM_OPERACAO': return 'Em Operação';
      case 'DISPONIVEL_PRATELEIRA': return 'Disponível em Prateleira';
      case 'EM_MANUTENCAO': return 'Em Manutenção';
      case 'ENTRADA_EM_BANCADA': return 'Entrada em Bancada';
      default: return 'Sem status';
    }
  };


  const fecharModal = () => {
    setModalAberto(false);
    setFormData({ nome: '', numeroSerie: '' });
  };

  const fecharModalAcao = async () => {
    setModalAberto(false);
    setIsEdit(false)
    setEquipId(null)
    setFormData({ nome: '', numeroSerie: '' });
    await carregarOrdensServico();
  };

  const editarEquip = (equip: DetailedEquipmentResponse) => {
    setModalAberto(true);
    setIsEdit(true)
    setEquipId(equip.id);
    setFormData({
      nome: equip.nome,
      numeroSerie: equip.numeroSerie || ''
    });
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const getDetailerEquip = (id: Number) => {
    router.push(`/eaut/detailed-equipment/${id}`)
  }

  // ========== CONFIGURAÇÕES DO MODAL (MUDANÇA DE STATUS) ==========
  const opcoesStatus = [
    { valor: 'RECEBIDO', label: 'Recebido' },
    { valor: 'EM_ANALISE', label: 'Em Análise' },
    { valor: 'AGUARDANDO_PECA', label: 'Aguardando Peça' },
    { valor: 'EM_REPARO', label: 'Em Reparo' },
    { valor: 'PRONTO', label: 'Pronto / Concluído' },
    { valor: 'ENTREGUE', label: 'Entregue' }
  ];

  const camposStatus: CampoModal[] = [
    { tipo: 'select', nome: 'status', label: 'Status da Manutenção', opcoes: opcoesStatus, required: true },
    { tipo: 'textarea', nome: 'diagnosticoTecnico', label: 'Diagnóstico Técnico / Observações', required: false }
  ];

  const camposEquipamento: CampoModal[] = [
    { tipo: 'text', nome: 'nome', label: 'Nome Equipamento', required: true },
    { tipo: 'text', nome: 'numeroSerie', label: 'Numero de Série', required: true }
  ];

  // ========== FUNÇÕES DE CRUD ==========
  const handleExcluirOS = async (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este registro de OS?')) {
      try {
        setLoading(true);
        await service.excluir(id);
        showSuccess('Ordem de serviço removida com sucesso!');
      } catch (error) {
        showError('Erro ao excluir ordem de serviço.');
      } finally {
        await carregarOrdensServico();
      }
    }
  };

  const addEquipment = async (dados: DadosModal) => {
    try {
      setLoading(true);
      if (!isEdit) {
        await service.cadastrarEquip({
          nome: dados.nome,
          numeroSerie: dados.numeroSerie
        });
        showSuccess('Salvo com sucesso!');
      } else {
        if (!equipId) return
        await service.atualizarEquip(equipId, dados)
        showSuccess('Atualizado com sucesso!');
      }
      fecharModalAcao();
    } catch (error) {
      showError('Erro ao atualizar Equipamento.');
    } finally {
      setLoading(false);
    }
  };


  // ========== LÓGICA DE FILTRAGEM (NOVO) ==========
  const equipsFiltrados = equips.filter((equip) => {
    if (!filtroEquipamento) return true;

    const termoBusca = filtroEquipamento.toLowerCase();

    // Tratamos com fallback (|| '') para evitar erros caso os valores venham null/undefined da API
    const nome = (equip.nome || '').toLowerCase();
    const numeroSerie = (equip.numeroSerie || '').toLowerCase();

    return nome.includes(termoBusca) || numeroSerie.includes(termoBusca);
  });

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
    <Layout titulo="Equipamentos Cadastrados">
      <div className="container mt-6">
        <NotificationContainer notifications={notifications} onRemove={removeNotification} />

        <div className="box" style={{ boxShadow: 'none' }}>
          <div className="level is-mobile">
            <div className="level-left"></div>
            <div className="level-right">
              {isMobile ? (
                
                <button className="button is-primary-custom has-secundary-custom" style={{ boxShadow: 'none' }} onClick={() => abrirModal()}>
                  <span className="icon"><FiTool size={14} /></span>
                </button>
              ) : (
                <CustomButton text="Novo Equipamento" icon={<FiPlus />} onClick={() => abrirModal()} style={{ borderRadius: '6px' }} />
              )}
            </div>
          </div>

          <div className="columns is-multiline is-mobile">
            <div className="column is-12-mobile is-4-tablet">
              <div className="field">
                <div className="control has-icons-left">
                  <input
                    className="input is-fullwidth"
                    type="text"
                    placeholder="Filtrar por Nome ou Nº de Série"
                    value={filtroEquipamento}
                    onChange={e => setFiltroEquipamento(e.target.value)}
                  />
                  <span className="icon is-left"><FiSearch /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="table-container" style={{ overflow: 'hidden' }}>
            <CardList
              data={equipsFiltrados} /* ARRAY FILTRADO APLICADO AQUI */
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
                  key: 'statusOperacionalAtual',
                  color: (item: any) => getColorTagOperacional(item.statusOperacionalAtual),
                  format: (statusOperacionalAtual: StatusOperacional) => formatarStatusOperacional(statusOperacionalAtual)
                },
                {
                  label: 'Destino Atual',
                  key: 'destinoAtual',
                  color: 'is-link is-light',
                }]}
              actions={[
                { label: '', color: 'is-primary is-light', onClick: (item) => editarEquip(item), icon: <FiEdit />, itemAtivo: true },
                { label: '', color: 'is-success is-light', onClick: (item) => getDetailerEquip(item.id), icon: <FiPlus />, itemAtivo: true },
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
        campos={camposEquipamento}
        isEdit={true}
        textoBotaoSalvar="Salvar"
      />
    </Layout>
  );
};

export default GerenciamentoEquips;