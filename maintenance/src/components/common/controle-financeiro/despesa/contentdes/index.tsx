
import { FiTrendingDown, FiEdit, FiTrash } from 'react-icons/fi';
import { TabelaDespesas } from '../tabela';
import { FiltrosDespesas } from '../filtro';
import { CabecalhoDespesas } from '../cabecalho';
import CardList from '../../../tableMobile';

export const DespesasContent = ({
    despesasFiltradas,
    categorias,
    periodoInicio,
    periodoFim,
    categoriaFiltro,
    setPeriodoInicio,
    setPeriodoFim,
    setCategoriaFiltro,
    abrirModalDespesa,
    handleBuscarDespesas,
    handleDeleteDespesa
}: any) => (
    <>
        <div>
            <CabecalhoDespesas abrirModalDespesa={abrirModalDespesa} />

            <FiltrosDespesas
                periodoInicio={periodoInicio}
                periodoFim={periodoFim}
                categoriaFiltro={categoriaFiltro}
                categorias={categorias}
                setPeriodoInicio={setPeriodoInicio}
                setPeriodoFim={setPeriodoFim}
                setCategoriaFiltro={setCategoriaFiltro}
                handleBuscarDespesas={handleBuscarDespesas}
            />

            <TabelaDespesas
                despesasFiltradas={despesasFiltradas}
                abrirModalDespesa={abrirModalDespesa}
                handleDeleteDespesa={handleDeleteDespesa}
            />
        </div>

        <CardList
            data={despesasFiltradas}
            icon={<FiTrendingDown />}
            iconColor='has-warning'
            titleField="despesasFiltradas"
            subtitleField=""
            fields={[
                { label: 'Data', key: 'data' },
                { label: 'Descricao', key: 'descricao' },
                { label: 'Categoria', key: 'categoriaNome' },
            ]}
            tags={[
                { label: 'Valor', key: 'valor', color: 'is-danger', defaultValue: 0, prefix: 'R$ ' }
            ]}
            actions={[
                {
                    label: '',
                    color: 'is-warning is-light',
                    onClick: (item: any) => abrirModalDespesa(item.id),
                    icon: <FiEdit />
                },
                {
                    label: '',
                    color: 'is-danger is-light',
                    onClick: (item: any) => handleDeleteDespesa(item),
                    disabled: false,
                    icon: <FiTrash />
                }
            ]}
        />
    </>
);