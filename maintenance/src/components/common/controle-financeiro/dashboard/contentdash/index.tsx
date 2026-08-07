import { FaMoneyBillWave, FaCalendarAlt, FaArrowUp, FaArrowDown, FaSpinner, FaSearch, FaArrowCircleUp, FaArrowCircleDown } from 'react-icons/fa';
import { CustomButton } from '@/components';

import { DespesasPorCategoria } from '../despesa-categoria';
import { FiltrosDashboard } from '../filtros/contentFilter';


export const DashboardContent = ({ 
  resumoFiltrado, 
  ifDeficit, 
  showDespesaPorCategoria, 
  carregandoResumo, 
  showResumo, 
  filtroDashboard, 
  setFiltroDashboard, 
  setShowResumo, 
  handleBuscarResumoPorPeriodo, 
  handleLimparFiltrosDashboard 
}: any) => (
  <div>
    {carregandoResumo && (
      <div className="has-text-centered py-4">
        <span className="icon">
          <FaSpinner className="fa-spin" />
        </span>
        <span>Carregando dados do período...</span>
      </div>
    )}

    <div className="columns">
      <div className="column">
        <div className="card dashboard-card">
          <div className="card-content" style={{padding: '2rem'}}>
            <div className="media is-align-items-flex-start">
              <div className="media-left">
                <div className="icon-circle has-background-success-light">
                  <FaMoneyBillWave className="has-text-success" size={20} />
                </div>
              </div>
              <div className="media-content">
                <h3 className="title is-5 has-text-grey-dark mb-1" >Receita Total</h3>
                <span className="date-range-tag">
                  <FaCalendarAlt size={10} className="mr-1" />
                  {resumoFiltrado?.dataInicio} até {resumoFiltrado?.dataFim}
                </span>
              </div>
            </div>

            <div className="main-value-section">
              <p className={`main-value ${ifDeficit ? 'has-text-danger' : 'has-text-success'}`}>
                R$ {resumoFiltrado?.lucroTotal.toFixed(2)}
              </p>
              <p className="value-label">{ifDeficit ? 'Está tendo mais gastos que ganhos' : 'Lucro Líquido'}</p>
            </div>

            <div className="financial-breakdown">
              <div className="breakdown-item positive">
                <div className="breakdown-info">
                  <FaArrowUp className="icon-sm has-text-success" />
                  <span>Receita Bruta</span>
                </div>
                <span className="breakdown-value has-text-success">
                  R$ {resumoFiltrado?.receitaTotal.toFixed(2)}
                </span>
              </div>

              <div className="breakdown-item negative">
                <div className="breakdown-info">
                  <FaArrowDown className="icon-sm has-text-danger" />
                  <span>Despesas Totais</span>
                </div>
                <span className="breakdown-value has-text-danger">
                  R$ {resumoFiltrado?.custoTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {resumoFiltrado && resumoFiltrado?.lucroTotal > 0 && (
              <div className="performance-indicator">
                <div className="progress-container">
                  <div className="progress-labels">
                    <span>Margem Líquida</span>
                    <span>{((resumoFiltrado.lucroTotal / resumoFiltrado.receitaTotal) * 100).toFixed(1)}%</span>
                  </div>
                  <progress
                    className="progress is-success is-small"
                    value={resumoFiltrado.lucroTotal}
                    max={resumoFiltrado.receitaTotal}
                  >
                    {((resumoFiltrado.lucroTotal / resumoFiltrado.receitaTotal) * 100).toFixed(1)}%
                  </progress>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDespesaPorCategoria && (
        <DespesasPorCategoria resumoFiltrado={resumoFiltrado} />
      )}
    </div>

    <FiltrosDashboard
      showResumo={showResumo}
      setShowResumo={setShowResumo}
      filtroDashboard={filtroDashboard}
      setFiltroDashboard={setFiltroDashboard}
      handleBuscarResumoPorPeriodo={handleBuscarResumoPorPeriodo}
      handleLimparFiltrosDashboard={handleLimparFiltrosDashboard}
      carregandoResumo={carregandoResumo}
    />
  </div>
);




