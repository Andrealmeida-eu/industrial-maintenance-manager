import { httpClient } from '@/app/http'
import {
  WorkOrder,
  StatusManutencao,
  DetailedEquipmentResponse,
  TurnoLog
} from '@/app/models/manutencao'
import {
  Inventary,
  InventaryPayload,
  InventaryFiltro,
  QuantidadeMovimentacaoRequest
} from '@/app/models/manutencao'
import { AxiosResponse } from 'axios'
import { DadosModal } from '@/components/common/modal/modal-generico'

const resourceURL: string = 'api/work-orders'
const resourceURLEquip: string = 'api/equipments'
const resourceURLInventory: string = 'api/estoque'
const resourceURLApontamentos: string = 'api/apontamentos' // <-- Nova URL base para os apontamentos

export const useWorkOrderService = () => {
  // =========================================================================
  // OPERAÇÕES CRUD DE ORDENS DE SERVIÇO (OS)
  // =========================================================================

  const cadastrarOS = async (workOrder: any): Promise<WorkOrder> => {
    console.log(workOrder.origem)
    const response: AxiosResponse<WorkOrder> = await httpClient.post<WorkOrder>(
      resourceURL,
      workOrder
    )
    return response.data
  }

  const cadastrarEquip = async (equip: any): Promise<DetailedEquipmentResponse> => {
    const response: AxiosResponse<DetailedEquipmentResponse> = await httpClient.post<DetailedEquipmentResponse>(
      resourceURLEquip,
      equip
    )
    console.log(response.data)
    return response.data
  }

  const listarTodas = async (): Promise<WorkOrder[]> => {
    const response: AxiosResponse<WorkOrder[]> = await httpClient.get<WorkOrder[]>(
      resourceURL
    )
    return response.data
  }

  const getEquipDetailed = async (id: number): Promise<DetailedEquipmentResponse> => {
    const response: AxiosResponse<DetailedEquipmentResponse> = await httpClient.get<DetailedEquipmentResponse>(
      `${resourceURLEquip}/${id}/detalhe`
    )
    console.log("detalhe ----> ", response.data)
    return response.data
  }

  const getEquip = async (): Promise<DetailedEquipmentResponse[]> => {
    const response: AxiosResponse<DetailedEquipmentResponse[]> = await httpClient.get<DetailedEquipmentResponse[]>(
      `${resourceURLEquip}/em-bancada`
    )
    console.log("em-bancada", response.data)
    return response.data
  }

  const getEquips = async (): Promise<DetailedEquipmentResponse[]> => {
    const response: AxiosResponse<DetailedEquipmentResponse[]> = await httpClient.get<DetailedEquipmentResponse[]>(
      `${resourceURLEquip}`
    )
    console.log("todos", response.data)
    return response.data
  }

  const atualizarEquip = async (id: number, payload: any): Promise<DetailedEquipmentResponse> => {
    const response: AxiosResponse<DetailedEquipmentResponse> = await httpClient.put<DetailedEquipmentResponse>(
      `${resourceURLEquip}/atualizar/${id}`,
      payload
    )
    return response.data
  }

  const buscarPorId = async (id: number): Promise<WorkOrder> => {
    const response: AxiosResponse<WorkOrder> = await httpClient.get<WorkOrder>(
      `${resourceURL}/${id}`
    )
    return response.data
  }

  const atualizarDadosParciais = async (id: number, workOrder: any): Promise<WorkOrder> => {
    const response: AxiosResponse<WorkOrder> = await httpClient.patch(
      `${resourceURL}/${id}/parcial`,
      workOrder
    )
    return response.data
  }

  const atualizarStatusOperacional = async (workOrder: any): Promise<WorkOrder> => {
    console.log(workOrder.equipamentoId)
    const response: AxiosResponse<WorkOrder> = await httpClient.patch(
      `${resourceURLEquip}/status-operacional`,
      workOrder
    )
    console.log(response.data)
    return response.data
  }

  const excluir = async (id: number): Promise<void> => {
    await httpClient.delete(`${resourceURL}/${id}`)
  }

  const getOrdensEquipamento = async (
    equipamentoId: number,
    filtros?: { dataInicio?: string; dataFim?: string; status?: string }
  ): Promise<WorkOrder[]> => {
    const response: AxiosResponse<WorkOrder[]> = await httpClient.get(
      `${resourceURL}/${equipamentoId}/ordens`,
      { params: filtros }
    );
    console.log("ordens__>>", response.data, filtros?.dataInicio, filtros?.dataFim)
    return response.data;
  };

  const getHistoricoEquipamento = async (
    equipamentoId: number,
    filtros?: { dataInicio?: string; dataFim?: string }
  ): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await httpClient.get(
      `${resourceURL}/${equipamentoId}/historico-operacional`,
      { params: filtros }
    );
    console.log(response.data)
    return response.data;
  };

  // =========================================================================
  // OPERAÇÕES DE FLUXO DE BANCADA (STATUS E FILTROS)
  // =========================================================================

  const buscarPorStatus = async (status: StatusManutencao): Promise<WorkOrder[]> => {
    const response: AxiosResponse<WorkOrder[]> = await httpClient.get<WorkOrder[]>(
      `${resourceURL}/status/${status}`
    )
    return response.data
  }

  const atualizarStatus = async (id: number, dados: DadosModal): Promise<WorkOrder> => {
    const payload = {
      status: dados.status,
      diagnosticoTecnico: dados.diagnosticoTecnico
    }

    const response: AxiosResponse<WorkOrder> = await httpClient.patch(
      `${resourceURL}/${id}/status`,
      payload
    )
    return response.data
  }

  const atualizarHistoricoOS = async (id: number, dados: DadosModal): Promise<WorkOrder> => {
    const response: AxiosResponse<WorkOrder> = await httpClient.post<WorkOrder>(
      `${resourceURL}/${id}/history`,
      dados
    )
    return response.data
  }

  // =========================================================================
  // INVENTÁRIO / ESTOQUE
  // =========================================================================

  const listarInventario = async (filtros?: InventaryFiltro): Promise<Inventary[]> => {
    const response: AxiosResponse<Inventary[]> = await httpClient.get<Inventary[]>(
      resourceURLInventory,
      { params: filtros }
    )
    return response.data
  }

  const buscarItemEstoquePorId = async (id: number): Promise<Inventary> => {
    const response: AxiosResponse<Inventary> = await httpClient.get<Inventary>(
      `${resourceURLInventory}/${id}`
    )
    return response.data
  }

  const cadastrarItemEstoque = async (payload: InventaryPayload): Promise<Inventary> => {
    const response: AxiosResponse<Inventary> = await httpClient.post<Inventary>(
      resourceURLInventory,
      payload
    )
    return response.data
  }

  const atualizarItemEstoque = async (id: number, payload: InventaryPayload): Promise<Inventary> => {
    const response: AxiosResponse<Inventary> = await httpClient.put<Inventary>(
      `${resourceURLInventory}/${id}`,
      payload
    )
    return response.data
  }

  const excluirItemEstoque = async (id: number): Promise<void> => {
    await httpClient.delete(`${resourceURLInventory}/${id}`)
  }

  const entradaItemEstoque = async (id: number, quantidade: number): Promise<Inventary> => {
    const payload: QuantidadeMovimentacaoRequest = { quantidade }

    const response: AxiosResponse<Inventary> = await httpClient.patch<Inventary>(
      `${resourceURLInventory}/${id}/entrada`,
      payload
    )
    return response.data
  }

  const saidaItemEstoque = async (id: number, quantidade: number): Promise<Inventary> => {
    const payload: QuantidadeMovimentacaoRequest = { quantidade }

    const response: AxiosResponse<Inventary> = await httpClient.patch<Inventary>(
      `${resourceURLInventory}/${id}/saida`,
      payload
    )
    return response.data
  }

  const buscarInventarioPorNome = async (nome: string): Promise<Inventary[]> => {
    return listarInventario({ nome })
  }

  const buscarInventarioPorLocalidade = async (localidade: string): Promise<Inventary[]> => {
    return listarInventario({ localidade })
  }

  const buscarInventarioPorPrateleira = async (prateleira: string): Promise<Inventary[]> => {
    return listarInventario({ prateleira })
  }

  // =========================================================================
  // OPERAÇÕES DE DIÁRIO DE APONTAMENTOS / TURNOS
  // =========================================================================


  const buscarTurnosPorData = async (dataInicio: string, dataFim: string): Promise<TurnoLog[]> => {

    console.log(dataFim, dataInicio)
    const response: AxiosResponse<TurnoLog[]> = await httpClient.get<TurnoLog[]>(
      `${resourceURLApontamentos}/porperiodo`,
      { params: { dataInicio, dataFim } }
    )
    return response.data
  }
 

  const gerarRelatorioPdf = async (dataInicio: string, dataFim: string) => {
    const response = await httpClient.get(`${resourceURLApontamentos}/turnos/pdf`, {
        params: { dataInicio, dataFim },
        responseType: 'blob' // <-- MUITO IMPORTANTE para arquivos
    });

    console.log("gerarRelatorioPdf", response.data)
    return response.data;
}

  const iniciarTurno = async (payload: any): Promise<TurnoLog> => {
    const response: AxiosResponse<TurnoLog> = await httpClient.post<TurnoLog>(
      `${resourceURLApontamentos}/turno`,
      payload
    )
    return response.data
  }

  const editarTurno = async (id: number, payload: any): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.put<any>(
      `${resourceURLApontamentos}/turno/${id}`,
      payload
    )
    return response.data
  }

  const adicionarTrabalho = async (turnoId: number, payload: any): Promise<any> => {
    console.log('chamei')
    const response: AxiosResponse<any> = await httpClient.post<any>(
      `${resourceURLApontamentos}/turno/${turnoId}/trabalho`,
      payload
    )
    return response.data
  }

  const editarTrabalho = async (turnoId: number, apontamentoId: number, payload: any): Promise<any> => {
    const response: AxiosResponse<any> = await httpClient.put<any>(
      `${resourceURLApontamentos}/turno/${turnoId}/trabalho/${apontamentoId}`,
      payload
    )
    return response.data
  }

  // =========================================================================
  // EXPORTAÇÃO DOS SERVIÇOS
  // =========================================================================

  return {
    cadastrarOS,
    listarTodas,
    getEquip,
    atualizarHistoricoOS,
    buscarPorId,
    getEquipDetailed,
    atualizarDadosParciais,
    excluir,
    atualizarEquip,
    buscarPorStatus,
    atualizarStatus,
    cadastrarEquip,
    getEquips,
    atualizarStatusOperacional,
    listarInventario,
    buscarItemEstoquePorId,
    cadastrarItemEstoque,
    atualizarItemEstoque,
    excluirItemEstoque,
    entradaItemEstoque,
    saidaItemEstoque,
    buscarInventarioPorNome,
    buscarInventarioPorLocalidade,
    buscarInventarioPorPrateleira,
    // Novos exports de Apontamentos
    buscarTurnosPorData,
    iniciarTurno,
    editarTurno,
    adicionarTrabalho,
    editarTrabalho,
    gerarRelatorioPdf,
    getOrdensEquipamento,
    getHistoricoEquipamento
  }
}