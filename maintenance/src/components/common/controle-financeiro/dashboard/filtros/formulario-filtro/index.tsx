import CustomButton from "@/components/common/customButton";
import { FaSearch } from "react-icons/fa";

// Componente para o formulário de filtros
export const FiltrosForm = ({
  filtroDashboard,
  setFiltroDashboard,
  handleBuscarResumoPorPeriodo,
  handleLimparFiltrosDashboard,
  carregandoResumo
}: any) => (
  <div className="field is-horizontal">
    <div className="field-body">
      <div className="field">
        <label className="label">Início</label>
        <div className="control">
          <input
            className="input"
            type="date"
            value={filtroDashboard.dataInicio}
            onChange={(e) => setFiltroDashboard({ ...filtroDashboard, dataInicio: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Fim</label>
        <div className="control">
          <input
            className="input"
            type="date"
            value={filtroDashboard.dataFim}
            onChange={(e) => setFiltroDashboard({ ...filtroDashboard, dataFim: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Mês</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select
              value={filtroDashboard.mes}
              onChange={(e) => setFiltroDashboard({ ...filtroDashboard, mes: e.target.value })}
            >
              <option value="">Todos os meses</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Ano</label>
        <div className="control">
          <input
            className="input"
            type="number"
            value={filtroDashboard.ano}
            onChange={(e) => setFiltroDashboard({ ...filtroDashboard, ano: e.target.value })}
            placeholder="Ano"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">&nbsp;</label>
        <div className="control">
          <div className="buttons">
            <CustomButton
              text="Buscar"
              icon={<FaSearch />}
              onClick={handleBuscarResumoPorPeriodo}
              className="my-custom-class"
              disabled={carregandoResumo}
            />
            <button
              className="button is-light"
              onClick={handleLimparFiltrosDashboard}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);