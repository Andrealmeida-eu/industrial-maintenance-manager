import { CabecalhoCategorias } from '../cabecalho';
import ListaCategorias from '../lista';

export const CategoriasContent = ({ 
  categorias, 
  abrirModalCategoria, 
  handleDeleteCategoria 
}: any) => (
  <div>
    <CabecalhoCategorias abrirModalCategoria={abrirModalCategoria} />
    
    <ListaCategorias
      categorias={categorias}
      abrirModalCategoria={abrirModalCategoria}
      handleDeleteCategoria={handleDeleteCategoria}
    />
  </div>
);

export default CategoriasContent

