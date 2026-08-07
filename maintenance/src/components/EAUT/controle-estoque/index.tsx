import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout';
import {
  FiSearch,
  FiPlus,
  FiLayers,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiSliders,
  FiPackage,
  FiCheckCircle
} from 'react-icons/fi';
import { CustomButton, ModalGenerico, useNotifications } from '@/components';
import LoadingSpinner from '@/components/common/loading';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { CampoModal, DadosModal } from '@/components/common/modal/modal-generico';
import { useWorkOrderService } from '@/app/services/maintenance/workOrder.service';
import { Inventary, InventaryPayload } from '@/app/models/manutencao';

type TipoMovimentacao = 'entrada' | 'saida';

export const ControleEstoque: React.FC = () => {
  const {
    listarInventario,
    cadastrarItemEstoque,
    atualizarItemEstoque,
    excluirItemEstoque,
    entradaItemEstoque,
    saidaItemEstoque
  } = useWorkOrderService();

  const { notifications, showSuccess, showError, removeNotification } = useNotifications();

  const [itens, setItens] = useState<Inventary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtroNome, setFiltroNome] = useState<string>('');
  const [filtroLocalidade, setFiltroLocalidade] = useState<string>('todos');

  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean | undefined>(false);
  const [modalMovimentoAberto, setModalMovimentoAberto] = useState<boolean>(false);

  const [itemSelecionado, setItemSelecionado] = useState<Inventary | null>(null);
  const [itemMovimentoSelecionado, setItemMovimentoSelecionado] = useState<Inventary | null>(null);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<TipoMovimentacao>('entrada');

  const [formData, setFormData] = useState({
    nome: '',
    localidade: '',
    prateleira: '',
    quantidade: 0
  });

  const [formMovimentoData, setFormMovimentoData] = useState({
    quantidade: 1
  });

  const carregarEstoque = async () => {
    try {
      setLoading(true);
      const response = await listarInventario();
      setItens(response);
    } catch (error) {
      showError('Falha ao carregar inventário de componentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  const itensFiltrados = useMemo(() => {
    return itens.filter((item) => {
      const busca = filtroNome.toLowerCase();

      const matchesNome =
        item.nome.toLowerCase().includes(busca) ||
        item.prateleira.toLowerCase().includes(busca) ||
        item.localidade.toLowerCase().includes(busca);

      const matchesLocalidade =
        filtroLocalidade === 'todos' || item.localidade === filtroLocalidade;

      return matchesNome && matchesLocalidade;
    });
  }, [itens, filtroNome, filtroLocalidade]);

  const totalItensDiferentes = itens.length;
  const totalQuantidade = itens.reduce((acc, item) => acc + item.quantidade, 0);
  const totalLocalidades = new Set(itens.map((item) => item.localidade)).size;
  const itensComBaixoSaldo = itens.filter((item) => item.quantidade <= 3).length;

  const localidadesDisponiveis = useMemo(() => {
    return [...new Set(itens.map((item) => item.localidade))].sort();
  }, [itens]);

  const getStockStatusTag = (quantidade: number): string => {
    if (quantidade === 0) return 'is-danger';
    if (quantidade <= 3) return 'is-warning is-light';
    return 'is-success is-light';
  };

  const abrirModalCadastro = () => {
    setItemSelecionado(null);
    setFormData({
      nome: '',
      localidade: '',
      prateleira: '',
      quantidade: 0
    });
    setModalAberto(true);
  };

  const abrirModalEdicao = (item: Inventary) => {
    setItemSelecionado(item);
    setEditando(true)
    setFormData({
      nome: item.nome,
      localidade: item.localidade,
      prateleira: item.prateleira,
      quantidade: item.quantidade
    });
    setModalAberto(true);
  };

  const abrirModalMovimento = (item: Inventary, tipo: TipoMovimentacao) => {
    setItemMovimentoSelecionado(item);
    setTipoMovimentacao(tipo);
    setFormMovimentoData({ quantidade: 1 });
    setModalMovimentoAberto(true);
  };

  const handleSalvarItem = async (dados: DadosModal) => {
    try {
      setLoading(true);

      const payload: InventaryPayload = {
        nome: String(dados.nome ?? ''),
        localidade: String(dados.localidade ?? ''),
        prateleira: String(dados.prateleira ?? ''),
        quantidade: Number(dados.quantidade ?? 0)
      };

      if (itemSelecionado) {
        await atualizarItemEstoque(itemSelecionado.id, payload);
        showSuccess('Componente atualizado com sucesso no almoxarifado!');
        setEditando(false)
      } else {
        await cadastrarItemEstoque(payload);
        showSuccess('Novo componente registrado no inventário!');
      }

      setModalAberto(false);
      await carregarEstoque();
    } catch (error) {
      showError('Erro ao salvar registro de insumo.');
    } finally {
      setLoading(false);
    }
  };

  const handleMovimentarEstoque = async (dados: DadosModal) => {
    try {
      if (!itemMovimentoSelecionado) return;

      setLoading(true);
      const quantidade = Number(dados.quantidade ?? 0);

      if (tipoMovimentacao === 'entrada') {
        await entradaItemEstoque(itemMovimentoSelecionado.id, quantidade);
        showSuccess('Entrada de estoque registrada com sucesso!');
      } else {
        await saidaItemEstoque(itemMovimentoSelecionado.id, quantidade);
        showSuccess('Saída de estoque registrada com sucesso!');
      }

      setModalMovimentoAberto(false);
      await carregarEstoque();
    } catch (error) {
      showError('Erro ao movimentar estoque.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirItem = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja remover o componente "${nome}" do inventário técnico?`)) {
      try {
        setLoading(true);
        await excluirItemEstoque(id);
        showSuccess('Componente removido do inventário.');
        await carregarEstoque();
      } catch (error) {
        showError('Erro ao deletar componente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const camposModal: CampoModal[] = [
    { tipo: 'text', nome: 'nome', label: 'Nome do Componente / Peça', required: true },
    { tipo: 'text', nome: 'localidade', label: 'Localidade', required: true },
    { tipo: 'text', nome: 'prateleira', label: 'Prateleira', required: true },
    { tipo: 'number', nome: 'quantidade', label: 'Quantidade em Estoque', required: false, disable: editando }
  ];

  const camposMovimento: CampoModal[] = [
    {
      tipo: 'number',
      nome: 'quantidade',
      label: tipoMovimentacao === 'entrada' ? 'Quantidade de Entrada' : 'Quantidade de Saída',
      required: true
    }
  ];

  if (loading) {
    return (
      <div className="section has-text-centered">
        <LoadingSpinner show={loading} isMobile={false} />
      </div>
    );
  }

  return (
    <Layout titulo="Controle de Estoque">
      <div className="container mt-5 px-4">
        <NotificationContainer notifications={notifications} onRemove={removeNotification} />

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
                  <h1 className="title is-5 mb-0">Almoxarifado Industrial</h1>
                  <span className="is-size-7 has-text-grey">Gerenciamento de Sobressalentes</span>
                </div>
              </div>

              <hr className="my-3" />

              <div className="block is-flex is-justify-content-between is-align-items-center">
                <div>
                  <p className="heading has-text-grey-semibold mb-1">Itens Cadastrados</p>
                  <p className="subtitle is-5"><strong>{totalItensDiferentes} referências</strong></p>
                </div>
                <span className="icon has-text-grey-light"><FiLayers size={20} /></span>
              </div>

              <div className="block is-flex is-justify-content-between is-align-items-center">
                <div>
                  <p className="heading has-text-grey-semibold mb-1">Total Itens</p>
                  <p className="subtitle is-5 has-text-link"><strong>{totalQuantidade} unidades</strong></p>
                </div>
                <span className="icon has-text-link"><FiCheckCircle size={20} /></span>
              </div>

              <div className="block is-flex is-justify-content-between is-align-items-center">
                <div>
                  <p className="heading has-text-grey-semibold mb-1">Localidades</p>
                  <p className="subtitle is-5"><strong>{totalLocalidades} áreas</strong></p>
                </div>
                <span className="icon has-text-grey"><FiSliders size={20} /></span>
              </div>

              <div className="block is-flex is-justify-content-between is-align-items-center">
                <div>
                  <p className="heading has-text-grey-semibold mb-1">Baixa Quantidade</p>
                  <p className="subtitle is-5 has-text-warning-dark"><strong>{itensComBaixoSaldo} itens</strong></p>
                </div>
                <span className="icon has-text-warning"><FiAlertCircle size={20} /></span>
              </div>

              <hr className="my-4" />

              <CustomButton
                text="Cadastrar Insumo"
                icon={<FiPlus />}
                onClick={abrirModalCadastro}
                className="is-fullwidth"
                style={{ borderRadius: '6px', backgroundColor: '#001078', color: '#fff' }}
              />
            </div>
          </div>

          <div className="column is-8-desktop">
            <div className="box" style={{ boxShadow: 'none' }}>
              <div className="columns is-mobile is-multiline mb-4">
                <div className="column is-12-mobile is-8-tablet">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Buscar por nome, localidade ou prateleira..."
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                      />
                      <span className="icon is-left"><FiSearch /></span>
                    </div>
                  </div>
                </div>

                <div className="column is-12-mobile is-4-tablet">
                  <div className="field">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={filtroLocalidade}
                          onChange={(e) => setFiltroLocalidade(e.target.value)}
                        >
                          <option value="todos">Todas Localidades</option>
                          {localidadesDisponiveis.map((localidade) => (
                            <option key={localidade} value={localidade}>
                              {localidade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-container">
                {itensFiltrados.length > 0 ? (
                  <table className="table is-fullwidth is-striped is-hoverable" style={{ padding: '1em .5em' }}>
                    <thead>
                      <tr>
                        <th>Componente</th>
                        <th>Localidade</th>
                        <th>Prateleira</th>
                        <th className="has-text-centered">Qtd.</th>
                        <th className="has-text-centered">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensFiltrados.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.nome}</strong>
                          </td>
                          <td>
                            <span className="is-size-7 has-text-grey-dark">{item.localidade}</span>
                          </td>
                          <td>
                            <code>{item.prateleira}</code>
                          </td>
                          <td className="has-text-centered">
                            <span
                              className={`tag ${getStockStatusTag(item.quantidade)} font-weight-bold`}
                              style={{ minWidth: '48px' }}
                            >
                              {item.quantidade}
                            </span>
                          </td>
                          <td className="has-text-centered">
                            <div className="buttons are-small is-justify-content-center">
                              <button
                                className="button is-light is-success"
                                title="Registrar entrada"
                                onClick={() => abrirModalMovimento(item, 'entrada')}
                              >
                                <span className="icon"><FiPlus /></span>
                              </button>

                              <button
                                className="button is-light is-warning"
                                title="Registrar saída"
                                onClick={() => abrirModalMovimento(item, 'saida')}
                              >
                                <span className="icon"><FiSliders /></span>
                              </button>

                              <button
                                className="button is-light is-info"
                                title="Editar Insumo"
                                onClick={() => abrirModalEdicao(item)}
                              >
                                <span className="icon"><FiEdit /></span>
                              </button>

                              <button
                                className="button is-light is-danger"
                                title="Remover do Inventário"
                                onClick={() => handleExcluirItem(item.id, item.nome)}
                              >
                                <span className="icon"><FiTrash2 /></span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="has-text-centered py-6 has-text-grey">
                    <span className="icon is-large"><FiAlertCircle size={32} /></span>
                    <p className="mt-2">Nenhum componente técnico localizado para a pesquisa atual.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalGenerico
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        dados={formData}
        onSave={handleSalvarItem}
        titulo={itemSelecionado ? `Editar Insumo: ${itemSelecionado.nome}` : 'Cadastrar Novo Componente Técnico'}
        campos={camposModal}
        isEdit={!!itemSelecionado}
        textoBotaoSalvar={itemSelecionado ? 'Salvar Alterações' : 'Cadastrar Peça'}
      />

      <ModalGenerico
        isOpen={modalMovimentoAberto}
        onClose={() => setModalMovimentoAberto(false)}
        dados={formMovimentoData}
        onSave={handleMovimentarEstoque}
        titulo={
          tipoMovimentacao === 'entrada'
            ? `Registrar Entrada - ${itemMovimentoSelecionado?.nome ?? ''}`
            : `Registrar Saída - ${itemMovimentoSelecionado?.nome ?? ''}`
        }
        campos={camposMovimento}
        isEdit={false}
        textoBotaoSalvar={tipoMovimentacao === 'entrada' ? 'Confirmar Entrada' : 'Confirmar Saída'}
      />
    </Layout>
  );
};

export default ControleEstoque;