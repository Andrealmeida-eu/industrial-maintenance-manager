import React from 'react';
import CustomButton from '../../customButton';
import { FiSave } from 'react-icons/fi';

// Tipos
export type CampoModal = {
  tipo: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file' | 'time'| 'date';
  nome: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disable?: boolean;
  opcoes?: { valor: string; label: string }[];
};

export interface DadosModal {
  [key: string]: any;
}

// Tipo para a função de renderização personalizada
export type RenderCampoPersonalizado = (
  campo: CampoModal,
  valor: string,
  onChange: (valor: string) => void
) => React.ReactNode;

interface ModalGenericoProps {
  isOpen: boolean;
  onClose: () => void;
  dados?: DadosModal | null;
  onSave: (dados: DadosModal) => void;
  instrumentosPorProfessor?: (id: string) => void
  titulo: string;
  isEdit?: boolean;
  campos: CampoModal[];
  textoBotaoSalvar?: string;
  textoBotaoCancelar?: string;
  tamanho?: 'pequeno' | 'normal' | 'grande' | 'fullscreen';
  children?: React.ReactNode;
  renderCampoPersonalizado?: RenderCampoPersonalizado;
}

export const ModalGenerico: React.FC<ModalGenericoProps> = ({
  isOpen,
  onClose,
  instrumentosPorProfessor,
  isEdit,
  dados,
  onSave,
  titulo,
  campos,
  textoBotaoSalvar = 'Salvar',
  textoBotaoCancelar = 'Cancelar',
  tamanho = 'normal',
  children,
  renderCampoPersonalizado
}) => {
  const [dadosLocais, setDadosLocais] = React.useState<DadosModal>({});

  React.useEffect(() => {
    if (isOpen) {
      const dadosIniciais: DadosModal = {};

      campos.forEach(campo => {
        if (dados && dados[campo.nome] !== undefined  && campo.tipo !== 'file') {
          dadosIniciais[campo.nome] = dados[campo.nome];
        } else {
          dadosIniciais[campo.nome] = campo.tipo === 'select'
            ? (campo.opcoes?.[0]?.valor || '')
            : '';
        }
      });

      setDadosLocais(dadosIniciais);
    }
  }, [isOpen, dados]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dadosLocais);
  };

  const handleInputChange = (nomeCampo: string, valor: any) => {
  
      if(nomeCampo === 'professorId'){
      const id = Number(valor)
      if(!instrumentosPorProfessor) return
      instrumentosPorProfessor(valor)
      
    } 
    setDadosLocais(prev => ({
      ...prev,
      [nomeCampo]: valor
            
    }));



  
  };



  const renderizarCampo = (campo: CampoModal) => {
    const valor = dadosLocais[campo.nome] || '';
    const handleChange = (novoValor: string) => {
      handleInputChange(campo.nome, novoValor);
    };

    // Se existe renderização personalizada, usa ela
    if (renderCampoPersonalizado) {
      return renderCampoPersonalizado(campo, valor, handleChange);
    }

    switch (campo.tipo) {
      case 'textarea':
        return (
          <textarea
            className="textarea"
            value={valor}
            onChange={(e) => handleInputChange(campo.nome, e.target.value)}
            required={campo.required}
            placeholder={campo.placeholder}
            rows={4}
          />
        );

       case 'file':
        return (
          <input
            className="input"
            type={campo.tipo}
            title={campo.label}
            //value={valor}
            onChange={(e) => handleInputChange(campo.nome, e.target.files?.[0] || null)}
            required={campo.required}
            placeholder={campo.placeholder}
            disabled={campo.disable}
          />
        );

      case 'select':
        return (
          <div className="select is-fullwidth">
            <select
              value={valor}
              onChange={(e) => handleInputChange(campo.nome, e.target.value)}
              required={campo.required}
              disabled={isEdit}
            >
               <option value="">
                  Selecione
                </option>
              {campo.opcoes?.map(opcao => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return (
          <input
            className="input"
            type={campo.tipo}
            title={campo.label}
            value={valor}
            onChange={(e) => handleInputChange(campo.nome, e.target.value)}
            required={campo.required}
            placeholder={campo.placeholder}
            disabled={campo.disable}
          />
        );
    }
  };

  if (!isOpen) return null;

  const tamanhoClass = {
    pequeno: 'modal-sm',
    normal: '',
    grande: 'modal-lg',
    fullscreen: 'modal-fullscreen'
  }[tamanho];

  return (
    <div className={`modal is-active ${tamanhoClass}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{titulo}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>

        <form onSubmit={handleSubmit}>
          <section className="modal-card-body">
            {children}

            {campos.map((campo) => (
              <div key={campo.nome}>
                <label className="label">{campo.label}</label>
                {renderizarCampo(campo)}
              </div>
            ))}
          </section>

          <footer className="modal-card-foot">
            <CustomButton
              text={textoBotaoSalvar}
              icon={<FiSave />}
              type='submit'
              className="button"
              style={{ borderRadius: '6px' }}
            />

            <button type="button" className="button" onClick={onClose}>
              {textoBotaoCancelar}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ModalGenerico;