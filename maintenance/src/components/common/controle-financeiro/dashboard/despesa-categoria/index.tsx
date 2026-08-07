import { FaMoneyBillWave } from "react-icons/fa";

// Componente auxiliar para Despesas por Categoria
export const DespesasPorCategoria = ({ resumoFiltrado }: any) => (
  <div className="column">
    <div className="card" style={{ display: 'contents', boxShadow: 'none' }}>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <span className="icon is-large has-text-danger">
              <FaMoneyBillWave size={30} />
            </span>
          </div>
          <div className="media-content">
            <p className="title is-4">Despesas por Categoria</p>
          </div>
        </div>
        <div className="content">
          <table className="table is-fullwidth">
            <tbody>
              {resumoFiltrado?.despesaPorCategoria.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.categoria}</td>
                  <td>R$ {item.total.toFixed(2)}</td>
                  <td>
                    <progress
                      className="progress is-danger"
                      value={item.total}
                      max={resumoFiltrado.custoTotal}
                    >
                      {(item.total / resumoFiltrado.custoTotal * 100).toFixed(1)}%
                    </progress>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
