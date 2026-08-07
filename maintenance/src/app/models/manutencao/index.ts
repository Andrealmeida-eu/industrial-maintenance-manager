export enum StatusManutencao {
  RECEBIDO = 'RECEBIDO',
  AGUARDANDO_PECA = 'AGUARDANDO_PECA',
  FINALIZADO = 'FINALIZADO',
  EM_MANUTENCAO = 'EM_MANUTENCAO',
  EM_TESTE = 'EM_TESTE',
  MANUTENCAO_EXTERNA = 'MANUTENCAO_EXTERNA'
}


export enum StatusOperacional { 
  ENTRADA_EM_BANCADA = 'ENTRADA_EM_BANCADA',
  EM_OPERACAO = 'EM_OPERACAO',
  DISPONIVEL_PRATELEIRA = 'DISPONIVEL_PRATELEIRA',
  EM_MANUTENCAO = 'EM_MANUTENCAO'
}

export enum TipoTurno { 
  MANHA = 'MANHA',
  TARDE = 'TARDE',
  NOITE = 'NOITE',
}
 

export interface WorkOrderHistory {
  id: number;
  status: StatusManutencao;
  nomeTecnico?: string | null;
  defeitoRelatado?: string | null;
  observacao?: string | null;
  trabalhoExecutado?: string | null;
  dataEvento: string;
}

export interface WorkOrder {
  id: number;
  numeroOs: string;
  equipamentoId?: number | null;
  equipamentoNome?: string | null;
  numeroSerie?: string | null;
  tecnicoAtual?: string | null;
  defeitoRelatado: string;
  origem?: string | null;
  trabalhoExecutado?: string | null;
  statusAtual: StatusManutencao;
  dataAbertura: string;
  dataFechamento?: string | null;
  historico: WorkOrderHistory[];
}

export interface EquipmentMetrics {
  totalPassagensBancada: number;
  totalOrdensEmAberto: number;
  totalEventosHistorico: number;
  totalMudancasOperacionais: number;
  totalRetornosParaManutencao: number;
  tempoMedioHorasPrateleira: number | null;
  tempoMedioHorasOperacao: number | null;
  tempoMedioHorasManutencao: number | null;
}

export interface OperationalHistory {
  id: number;
  status: StatusOperacional;
  dataEvento: string;
  destino: string;
  nomeTecnico?: string | null;
  observacao?: string | null;
  workOrderId?: number | null;
}

export interface DetailedEquipmentResponse {
  id: number;
  nome: string;
  numeroSerie: string;
  destinoAtual: string;
  origem?: string | null;
  statusOperacionalAtual?: StatusOperacional;
  dataUltimoStatusOperacional?: string | null;
  metricas: EquipmentMetrics;
}

// '@/app/models/inventary.ts'
export interface Inventary {
  id: number;
  nome: string;
  localidade: string;
  prateleira: string;
  quantidade: number;
}

export interface InventaryPayload {
  nome: string;
  localidade: string;
  prateleira: string;
  quantidade: number;
}

export interface InventaryFiltro {
  nome?: string;
  localidade?: string;
  prateleira?: string;
}

export interface QuantidadeMovimentacaoRequest {
  quantidade: number;
}

// Interfaces
export interface Apontamento {
  id: number;
  numeroSM: string;
  numeroOS: string;
  trabalhoRealizado: string;
  horarioRegistro: string;
}

export interface TurnoLog {
  id: number;
  nomeTurma: string;
  horarioTurno?: TipoTurno;
  horarioInicio: string;
  integrantes: string[];
  dataTurno: string;
  apontamentos: Apontamento[];
  isExpanded: boolean;
}
