import { FaEdit, FaTrash } from "react-icons/fa";

export const TabelaDespesas = ({ despesasFiltradas, abrirModalDespesa, handleDeleteDespesa }: any) => (
  <div className="box">
    {despesasFiltradas.length === 0 ? (
      <div className="has-text-centered py-6">
        <p>Nenhuma despesa encontrada com os filtros atuais.</p>
      </div>
    ) : (
      <div className="table-container is-responsive">
        <table className="table is-fullwidth is-striped is-hidden-mobile">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesasFiltradas.map((despesa: any) => (
              <tr key={despesa.id}>
                <td>{despesa.data}</td>
                <td>{despesa.descricao}</td>
                <td>{despesa.categoriaNome}</td>
                <td className="has-text-danger">R$ {despesa.valor.toFixed(2)}</td>
                <td>
                  <div className="buttons">
                    <button 
                      className="button is-info is-small"
                      onClick={() => abrirModalDespesa(despesa)}
                    >
                      <span className="icon">
                        <FaEdit />
                      </span>
                    </button>
                    <button
                      className="button is-danger is-small"
                      onClick={() => handleDeleteDespesa(despesa)}
                    >
                      <span className="icon">
                        <FaTrash />
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);