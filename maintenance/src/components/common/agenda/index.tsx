import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaFilter, FaCalendarAlt, FaPlus, FaEdit, FaCog, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { Layout } from '../../layout';
import { CustomButton } from '../customButton';

interface Aula {
  id: number;
  tipo: 'regular' | 'reposicao';
  data: string;
  hora: string;
  duracao: number;
  professor: string;
  aluno: string;
  disciplina: string;
}

interface ConfiguracaoHorario {
  horaInicio: number;
  horaFim: number;
  intervalo: number;
  diasTrabalho: string[];
}

interface AgendaPageProps {
  aulas?: Aula[];
  configHorarioPadrao?: ConfiguracaoHorario;
  onSalvarAula?: (aula: Aula) => void;
  onExcluirAula?: (id: number) => void;
  onSalvarConfig?: (config: ConfiguracaoHorario) => void;
  isSelectionMode?: boolean;
  onSelection?: (data: string, hora: string) => void;
  selectionParams?: {
    professorId?: number;
    diaSemana?: string;
  };
}

export const AgendaPage = ({
  aulas = [],
  configHorarioPadrao = {
    horaInicio: 8,
    horaFim: 20,
    intervalo: 30,
    diasTrabalho: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
  },
  onSalvarAula,
  onExcluirAula,
  onSalvarConfig,
  isSelectionMode = false,
  onSelection,
  selectionParams
}: AgendaPageProps) => {
  const router = useRouter();
  const [dataInicio, setDataInicio] = useState<string>('2023-07-17');
  const [dataFim, setDataFim] = useState<string>('2023-07-23');
  const [dias, setDias] = useState<string[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'regular' | 'reposicao'>('todos');
  const [diaSelecionadoMobile, setDiaSelecionadoMobile] = useState<string>('');
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [modalConfigAberto, setModalConfigAberto] = useState<boolean>(false);
  const [aulaSelecionada, setAulaSelecionada] = useState<Aula | null>(null);
  const [novaAula, setNovaAula] = useState<Partial<Aula>>({
    tipo: 'regular',
    data: '',
    hora: '',
    duracao: 60,
    professor: '',
    aluno: '',
    disciplina: ''
  });
  const [configHorario, setConfigHorario] = useState<ConfiguracaoHorario>(configHorarioPadrao);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<{ data: string, hora: string } | null>(null);

  // Efeitos
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const gerarHorariosDia = () => {
      const horarios: string[] = [];
      for (let hora = configHorario.horaInicio; hora < configHorario.horaFim; hora++) {
        for (let minuto = 0; minuto < 60; minuto += configHorario.intervalo) {
          horarios.push(`${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);
        }
      }
      return horarios;
    };

    const atualizarDias = () => {
      const diasArray: string[] = [];
      const currentDate = new Date(dataInicio);
      const endDate = new Date(dataFim);

      while (currentDate <= endDate) {
        const diaSemana = formatarDiaSemana(currentDate.toISOString().split('T')[0]);
        if (configHorario.diasTrabalho.includes(diaSemana)) {
          diasArray.push(currentDate.toISOString().split('T')[0]);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDias(diasArray);
      setHorarios(gerarHorariosDia());

      if (diasArray.length > 0 && !diaSelecionadoMobile) {
        setDiaSelecionadoMobile(diasArray[0]);
      }
    };

    atualizarDias();
  }, [dataInicio, dataFim, configHorario]);

  // Funções auxiliares
  const getAulaNoHorario = (dia: string, horario: string) => {
    return aulas.find(aula => {
      if (aula.data !== dia) return false;
      if (filtroTipo !== 'todos' && aula.tipo !== filtroTipo) return false;

      const aulaHora = parseInt(aula.hora.split(':')[0]);
      const aulaMinuto = parseInt(aula.hora.split(':')[1]);
      const aulaInicio = aulaHora * 60 + aulaMinuto;
      const aulaFim = aulaInicio + aula.duracao;

      const cellHora = parseInt(horario.split(':')[0]);
      const cellMinuto = parseInt(horario.split(':')[1]);
      const cellTime = cellHora * 60 + cellMinuto;

      return cellTime >= aulaInicio && cellTime < aulaFim;
    });
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}`;
  };

  const formatarDiaSemana = (data: string) => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaNum = new Date(data).getDay();
    return dias[diaNum];
  };

  const handleClicarCelula = (dia: string, horario: string) => {
    if (isSelectionMode) {
      setSelectedSlot({ data: dia, hora: horario });
      return;
    }

    const aulaExistente = getAulaNoHorario(dia, horario);

    if (aulaExistente) {
      setAulaSelecionada(aulaExistente);
      setNovaAula({ ...aulaExistente });
    } else {
      setAulaSelecionada(null);
      setNovaAula({
        tipo: 'regular',
        data: dia,
        hora: horario,
        duracao: 60,
        professor: '',
        aluno: '',
        disciplina: ''
      });
    }

    setModalAberto(true);
  };

  const handleConfirmSelection = () => {
    if (selectedSlot && onSelection) {
      onSelection(selectedSlot.data, selectedSlot.hora);
    }
  };

  const handleCancelSelection = () => {
    setSelectedSlot(null);
    if (router.query.returnUrl) {
      router.push(router.query.returnUrl as string);
    }
  };

  const handleSalvarAula = () => {
    if (onSalvarAula) {
      const aulaCompleta: Aula = {
        id: aulaSelecionada?.id || Math.floor(Math.random() * 10000),
        tipo: novaAula.tipo || 'regular',
        data: novaAula.data || '',
        hora: novaAula.hora || '',
        duracao: novaAula.duracao || 60,
        professor: novaAula.professor || '',
        aluno: novaAula.aluno || '',
        disciplina: novaAula.disciplina || ''
      };
      onSalvarAula(aulaCompleta);
    }
    setModalAberto(false);
  };

  const handleExcluirAula = () => {
    if (aulaSelecionada && onExcluirAula) {
      onExcluirAula(aulaSelecionada.id);
    }
    setModalAberto(false);
  };

  const handleSalvarConfiguracoes = () => {
    if (onSalvarConfig) {
      onSalvarConfig(configHorario);
    }
    setModalConfigAberto(false);
  };

  // Estilo condicional para células no modo de seleção
  const getCellClass = (dia: string, horario: string) => {
    const baseClass = getAulaNoHorario(dia, horario) ?
      (getAulaNoHorario(dia, horario)?.tipo === 'regular' ? 'has-class' : 'has-makeup') :
      'is-available';

    const selectionClass = selectedSlot?.data === dia && selectedSlot?.hora === horario ?
      'is-selected' : '';

    return `${baseClass} ${selectionClass}`;
  };


  return (
    <Layout titulo={isSelectionMode ? 'Selecionar Horário' : 'Agenda de Aulas'}>
      <div className="container">
        {isSelectionMode && (
          <div className="notification is-info">
            <button className="delete" onClick={handleCancelSelection}></button>
            Selecione um horário disponível para a aula
          </div>
        )}

        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <h1 className="title is-2 has-text-descrition-cinza-custom has-text-weight-bold mt-6" style={{ padding: '1rem' }}>
            {isSelectionMode ? 'Selecionar Horário' : 'Agenda de Aulas'}
          </h1>
        </div>

        {/* Filtros */}
        {!isSelectionMode && (
          <div className="box has-background-light">
            <div className="is-flex is-align-items-center mb-4">
              <FaFilter className="mr-2 is-primary-custom" />
              <h2 className="subtitle is-4 has-text-descrition-cinza-custom">Filtros</h2>
            </div>

            <div className="columns is-mobile is-multiline">
              <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                <div className="field">
                  <label className="label has-text-weight-semibold">Data Inicial</label>
                  <div className="control has-icons-left">
                    <input
                      type="date"
                      className="input is-rounded"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <FaCalendarAlt className="is-primary-custom" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                <div className="field">
                  <label className="label has-text-weight-semibold">Data Final</label>
                  <div className="control has-icons-left">
                    <input
                      type="date"
                      className="input is-rounded"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      min={dataInicio}
                    />
                    <span className="icon is-small is-left">
                      <FaCalendarAlt className="is-primary-custom" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                <div className="field">
                  <label className="label has-text-weight-semibold">Tipo de Aula</label>
                  <div className="control is-expanded">
                    <div className="select is-fullwidth is-rounded">
                      <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value as 'todos' | 'regular' | 'reposicao')}
                        className="has-text-weight-semibold"
                      >
                        <option value="todos">Todos</option>
                        <option value="regular">Regular</option>
                        <option value="reposicao">Reposição</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        )}

        {/* Seletor de dia para mobile */}
        {isMobile && dias.length > 0 && (
          <div className="box has-background-light">
            <div className="field">
              <label className="label has-text-weight-semibold">Selecione o dia</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth is-rounded">
                  <select
                    value={diaSelecionadoMobile}
                    onChange={(e) => setDiaSelecionadoMobile(e.target.value)}
                    className="has-text-weight-semibold"
                  >
                    {dias.map(dia => (
                      <option key={dia} value={dia}>
                        {formatarDiaSemana(dia)} - {formatarData(dia)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="schedule-container">
          {/* Cabeçalho com os dias da semana */}
          <div className="schedule-header">
            <div className="schedule-time-label"></div>
            {!isMobile ? (
              dias.map((dia) => (
                <div key={dia} className="schedule-day-header">
                  <div className="schedule-weekday">{formatarDiaSemana(dia)}</div>
                  <div className="schedule-date">{formatarData(dia)}</div>
                </div>
              ))
            ) : (
              <div className="schedule-day-header">
                <div className="schedule-weekday">{formatarDiaSemana(diaSelecionadoMobile)}</div>
                <div className="schedule-date">{formatarData(diaSelecionadoMobile)}</div>
              </div>
            )}
          </div>

          {/* Linhas de horários */}
          <div className="schedule-body">
            {horarios.map((horario) => (
              <div key={horario} className="schedule-row">
                {/* Coluna de horário */}
                <div className="schedule-time">
                  {horario}
                </div>

                {/* Células de aula */}
                {!isMobile ? (
                  dias.map((dia) => {
                    const aula = getAulaNoHorario(dia, horario);
                    return (
                      <div
                        key={`${dia}-${horario}`}
                        onClick={() => handleClicarCelula(dia, horario)}
                        className={`schedule-cell ${aula ? aula.tipo === 'regular' ? 'has-class' : 'has-makeup' : 'is-available'}`}
                      >
                        {aula ? (
                          <div className="class-info">
                            <div className="class-student">{aula.aluno}</div>
                            <div className="class-subject">{aula.disciplina}</div>
                            <div className="class-teacher">{aula.professor}</div>
                            <div className={`class-type ${aula.tipo === 'regular' ? 'is-regular' : 'is-makeup'}`}>
                              {aula.tipo === 'regular' ? 'Aula' : 'Reposição'}
                            </div>
                          </div>
                        ) : (
                          <div className="add-class">
                            <button
                              className="button is-small is-text"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClicarCelula(dia, horario);
                              }}
                            >
                              <span className="icon is-small">
                                <FaPlus />
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    onClick={() => handleClicarCelula(diaSelecionadoMobile, horario)}
                    className={`schedule-cell ${getCellClass(diaSelecionadoMobile, horario)}`}
                  >
                    {getAulaNoHorario(diaSelecionadoMobile, horario) ? (
                      <div className="class-info">
                        <div className="class-student">{getAulaNoHorario(diaSelecionadoMobile, horario)?.aluno}</div>
                        <div className="class-subject">{getAulaNoHorario(diaSelecionadoMobile, horario)?.disciplina}</div>
                        <div className="class-teacher">{getAulaNoHorario(diaSelecionadoMobile, horario)?.professor}</div>
                        <div className={`class-type ${getAulaNoHorario(diaSelecionadoMobile, horario)?.tipo === 'regular' ? 'is-regular' : 'is-makeup'}`}>
                          {getAulaNoHorario(diaSelecionadoMobile, horario)?.tipo === 'regular' ? 'Aula' : 'Reposição'}
                        </div>
                      </div>
                    ) : (
                      <div className="add-class">
                        <button
                          className="button is-small is-text"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClicarCelula(diaSelecionadoMobile, horario);
                          }}
                        >
                          <span className="icon is-small">
                            <FaPlus />
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botões de confirmação no modo de seleção */}
        {isSelectionMode && selectedSlot && (
          <div className="box mt-5">
            <div className="is-flex is-justify-content-center">
              <div className="buttons">
                <button className="button is-success" onClick={handleConfirmSelection}>
                  <FaCheck className="mr-2" />
                  Confirmar Seleção: {formatarData(selectedSlot.data)} às {selectedSlot.hora}
                </button>
                <button className="button is-danger" onClick={handleCancelSelection}>
                  <FaTimes className="mr-2" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legenda */}
        <div className="box mt-5" style={{ boxShadow: 'none' }}>
          <div className="is-flex is-flex-wrap-wrap is-justify-content-center">
            <div className="tags are-medium">
              <span className="tag is-grey is-rounded">
                <span className="icon">
                  <i className="fas fa-square"></i>
                </span>
                <span className="has-text-weight-semibold">Horário Livre</span>
              </span>
              <span className="tag is-warning is-rounded">
                <span className="icon">
                  <i className="fas fa-square"></i>
                </span>
                <span className="has-text-weight-semibold">Aula Regular</span>
              </span>
              <span className="tag is-danger is-rounded">
                <span className="icon">
                  <i className="fas fa-square"></i>
                </span>
                <span className="has-text-weight-semibold">Reposição</span>
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Configuração */}
        <div className="has-text-centered mt-5">
          <button
            className="button is-primary is-rounded"
            onClick={() => setModalConfigAberto(true)}
          >
            <FaCog className="mr-2" />
            Configurar Horários
          </button>
        </div>

        {/* Modal de Configuração */}
        <div className={`modal ${modalConfigAberto ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={() => setModalConfigAberto(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head has-background-primary">
              <p className="modal-card-title has-text-white">Configurações de Horário</p>
              <button className="delete" aria-label="close" onClick={() => setModalConfigAberto(false)}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Horário de Início</label>
                <div className="control">
                  <input
                    type="number"
                    className="input is-rounded"
                    value={configHorario.horaInicio}
                    onChange={(e) => setConfigHorario({ ...configHorario, horaInicio: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="23"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Horário de Término</label>
                <div className="control">
                  <input
                    type="number"
                    className="input is-rounded"
                    value={configHorario.horaFim}
                    onChange={(e) => setConfigHorario({ ...configHorario, horaFim: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="24"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Intervalo entre Horários (min)</label>
                <div className="control">
                  <div className="select is-fullwidth is-rounded">
                    <select
                      value={configHorario.intervalo}
                      onChange={(e) => setConfigHorario({ ...configHorario, intervalo: parseInt(e.target.value) || 30 })}
                    >
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">60 minutos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Dias de Trabalho</label>
                <div className="control">
                  <div className="buttons are-small">
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(dia => (
                      <button
                        key={dia}
                        className={`button is-rounded ${configHorario.diasTrabalho.includes(dia) ? 'is-primary' : 'is-light'}`}
                        onClick={() => {
                          const novosDias = configHorario.diasTrabalho.includes(dia)
                            ? configHorario.diasTrabalho.filter(d => d !== dia)
                            : [...configHorario.diasTrabalho, dia];
                          setConfigHorario({ ...configHorario, diasTrabalho: novosDias });
                        }}
                      >
                        {dia}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-primary is-rounded" onClick={handleSalvarConfiguracoes}>
                Salvar Configurações
              </button>
              <button className="button is-rounded" onClick={() => setModalConfigAberto(false)}>Cancelar</button>
            </footer>
          </div>
        </div>

        {/* Modal de Aula */}
        <div className={`modal ${modalAberto ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={() => setModalAberto(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head has-background-primary">
              <p className="modal-card-title has-text-white">
                {aulaSelecionada ? 'Editar Aula' : 'Agendar Nova Aula'}
              </p>
              <button className="delete" aria-label="close" onClick={() => setModalAberto(false)}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Tipo de Aula</label>
                <div className="control">
                  <div className="select is-fullwidth is-rounded">
                    <select
                      value={novaAula.tipo}
                      onChange={(e) => setNovaAula({ ...novaAula, tipo: e.target.value as 'regular' | 'reposicao' })}
                    >
                      <option value="regular">Regular</option>
                      <option value="reposicao">Reposição</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Data</label>
                <div className="control">
                  <input
                    type="date"
                    className="input is-rounded"
                    value={novaAula.data}
                    onChange={(e) => setNovaAula({ ...novaAula, data: e.target.value })}
                  />
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Hora</label>
                    <div className="control">
                      <input
                        type="time"
                        className="input is-rounded"
                        value={novaAula.hora}
                        onChange={(e) => setNovaAula({ ...novaAula, hora: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">Duração (min)</label>
                    <div className="control">
                      <input
                        type="number"
                        className="input is-rounded"
                        value={novaAula.duracao || 60}
                        onChange={(e) => setNovaAula({ ...novaAula, duracao: parseInt(e.target.value) || 60 })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Professor</label>
                <div className="control">
                  <input
                    type="text"
                    className="input is-rounded"
                    value={novaAula.professor || ''}
                    onChange={(e) => setNovaAula({ ...novaAula, professor: e.target.value })}
                    placeholder="Nome do professor"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Aluno</label>
                <div className="control">
                  <input
                    type="text"
                    className="input is-rounded"
                    value={novaAula.aluno || ''}
                    onChange={(e) => setNovaAula({ ...novaAula, aluno: e.target.value })}
                    placeholder="Nome do aluno"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Disciplina</label>
                <div className="control">
                  <input
                    type="text"
                    className="input is-rounded"
                    value={novaAula.disciplina || ''}
                    onChange={(e) => setNovaAula({ ...novaAula, disciplina: e.target.value })}
                    placeholder="Nome da disciplina"
                  />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success is-rounded" onClick={handleSalvarAula}>
                {aulaSelecionada ? 'Atualizar' : 'Salvar'}
              </button>
              {aulaSelecionada && (
                <button className="button is-danger is-rounded" onClick={handleExcluirAula}>
                  <FaTrash className="mr-2" />
                  Excluir
                </button>
              )}
              <button className="button is-rounded" onClick={() => setModalAberto(false)}>Cancelar</button>
            </footer>
          </div>
        </div>

      </div>
      {isSelectionMode && selectedSlot && (
        <div className="box mt-5">
          <div className="is-flex is-justify-content-center">
            <div className="buttons">
              <CustomButton
                text="Confirmar Seleção"
                icon={<FaCheck />}
                onClick={handleConfirmSelection}
                className="is-success"
              />
              <CustomButton
                text="Cancelar"
                icon={<FaTimes />}
                onClick={handleCancelSelection}
                className="is-danger"
              />
            </div>
          </div>
        </div>
      )}


    </Layout >
  );
};

export default AgendaPage;