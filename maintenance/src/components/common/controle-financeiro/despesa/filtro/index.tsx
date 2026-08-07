import CustomButton from "@/components/common/customButton";
import { FaFilter } from "react-icons/fa";

export const FiltrosDespesas = ({
  periodoInicio,
  periodoFim,
  categoriaFiltro,
  categorias,
  setPeriodoInicio,
  setPeriodoFim,
  setCategoriaFiltro,
  handleBuscarDespesas
}: any) => (
  <div className="box" style={{ display: 'inline', boxShadow: 'none' }}>
    <div className="field is-horizontal">
      <div className="field-body">
        <div className="field">
          <label className="label">Período</label>
          <div className="field is-grouped">
            <div className="control is-expanded">
              <input
                className="input"
                type="date"
                value={periodoInicio}
                onChange={(e) => setPeriodoInicio(e.target.value)}
                placeholder="Data inicial"
              />
            </div>
            <div className="control is-expanded">
              <input
                className="input"
                type="date"
                value={periodoFim}
                onChange={(e) => setPeriodoFim(e.target.value)}
                placeholder="Data final"
              />
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Categoria</label>
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select
                value={categoriaFiltro || ''}
                onChange={(e) => setCategoriaFiltro(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Todas Categorias</option>
                {categorias.map((categoria: any) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">&nbsp;</label>
          <div className="control">
            <CustomButton
              text="Filtrar"
              icon={<FaFilter />}
              onClick={handleBuscarDespesas}
              className="my-custom-class"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
