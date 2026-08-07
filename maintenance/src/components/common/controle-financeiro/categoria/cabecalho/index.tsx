import CustomButton from "@/components/common/customButton";
import { FaPlus } from "react-icons/fa";

export const CabecalhoCategorias = ({ abrirModalCategoria }: any) => (
  <div className="box" style={{ display: 'inline', boxShadow: 'none' }}>
    <div className="level">
      <div className="level-left mb-3">
        <h2 className="title is-5"></h2>
      </div>
      <div className="level-right">
        <div className="buttons">
          <CustomButton
            text="Nova Categoria"
            icon={<FaPlus />}
            onClick={() => abrirModalCategoria()}
            className="my-custom-class"
          />
        </div>
      </div>
    </div>
  </div>
);
