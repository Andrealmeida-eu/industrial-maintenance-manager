import CustomButton from "@/components/common/customButton";
import { FaPlus } from "react-icons/fa";

export const CabecalhoDespesas = ({ abrirModalDespesa }: any) => (
  <div className="box" style={{ display: 'inline', boxShadow: 'none' }}>
    <div className="level">
      <div className="level-left">
      
      </div>
      <div className="level-right">
        <div className="buttons">
          <CustomButton
            text="Nova Despesa"
            icon={<FaPlus />}
            onClick={() => abrirModalDespesa()}
            className="my-custom-class"
          />
        </div>
      </div>
    </div>
  </div>
);