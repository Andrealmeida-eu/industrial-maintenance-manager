import CardList from "@/components/common/tableMobile";
import { FaTag } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FiEdit, FiTrash } from "react-icons/fi";

export const ListaCategorias = ({ categorias, abrirModalCategoria, handleDeleteCategoria }: any) => (
  <div className="box" style={{ boxShadow: 'none' }}>
    {categorias.length === 0 ? (
      <div className="has-text-centered py-6">
        <p>Nenhuma categoria encontrada.</p>
      </div>
    ) : (
      <CardList
        data={categorias}
        icon={<FaTag            />}
        iconColor='has-warning'
        hiddenBreakpoint='none'
        titleField='nome'
        subtitleField='descricao'
        fields={[
         
        ]}
        tags={[]}
        actions={[
          {
            label: '',
            color: 'is-warning is-light',
            onClick: (item: any) => abrirModalCategoria(item),
            icon: <FiEdit />,
               itemAtivo: true 
          },
          {
            label: '',
            color: 'is-danger is-light',
            onClick: (item: any) => handleDeleteCategoria(item),
            disabled: false,
            icon: <FiTrash />,
            itemAtivo: true
          }
        ]}
      />
    )}
  </div>
);

export default ListaCategorias