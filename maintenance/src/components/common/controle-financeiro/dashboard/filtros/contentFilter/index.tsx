import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import CustomButton from "../../../../customButton";
import { FiltrosForm } from "../formulario-filtro";

// Componente auxiliar para Filtros
export const FiltrosDashboard = ({
  showResumo,
  setShowResumo,
  filtroDashboard,
  setFiltroDashboard,
  handleBuscarResumoPorPeriodo,
  handleLimparFiltrosDashboard,
  carregandoResumo
}: any) => (
  <>
    <div className="control mb-6">
      <CustomButton
        text="Filtrar"
        icon={showResumo ? <FaArrowCircleUp className="mr-2" /> : <FaArrowCircleDown className="mr-2" />}
        type='submit'
        onClick={() => setShowResumo(!showResumo)}
        className="control"
      />
    </div>

    {showResumo && (
      <div className="box mb-5" style={{ boxShadow: 'none' }}>
        <h3 className="title is-5 mb-4">Filtrar por Período</h3>
        <FiltrosForm
          filtroDashboard={filtroDashboard}
          setFiltroDashboard={setFiltroDashboard}
          handleBuscarResumoPorPeriodo={handleBuscarResumoPorPeriodo}
          handleLimparFiltrosDashboard={handleLimparFiltrosDashboard}
          carregandoResumo={carregandoResumo}
        />
      </div>
    )}
  </>
);