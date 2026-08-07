import { InputHTMLAttributes } from "react"


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    onChange?: (value: any) => void
    onClick?: (value: any ) => void
    label: string
    spanBox?: any
    icon?: any
    iconLeft?: any
    errors?: string
    type: string
    aditionalClassesField?: string
    aditionalClasseslabel?: string
    aditionalClassesControl?: string
    showLabel?: boolean
     format?: 'telefone' | 'moeda' | 'cpf'

}

// Função para formatar telefone
const formatarTelefone = (valor: string) => {
    let numero = valor.replace(/\D/g, '');

    if (numero.length <= 10) {
        numero = numero.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        numero = numero.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    return numero;
};

// Função para formatar valor monetário
const formatarMoeda = (valor: string) => {
    let numero = valor.replace(/\D/g, '');

    // Se estiver vazio, retorna vazio
    if (numero === '') return '';

    // Converte para número antes de formatar
    let valorNumerico = parseFloat(numero) / 100;

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valorNumerico);
};

// Função para formatar CPF (versão concisa)
const formatarCPF = (valor: string) => {
    let numero = valor.replace(/\D/g, '').substring(0, 11);
    
    if (numero === '') return '';
    
    // Aplica a máscara progressivamente
    return numero
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const Input: React.FC<InputProps> = ({
    onChange,
    onClick,
    label = "",
    icon,
    errors,
    spanBox,
    iconLeft,
    aditionalClasseslabel,
    aditionalClassesField,
    aditionalClassesControl,
    showLabel = true,
format,
    ...props

}: InputProps) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let valor = event.target.value;

        // Aplica a formatação conforme o tipo
        if (format === 'telefone') {
            valor = formatarTelefone(valor);
        } else if (format === 'moeda') {
            valor = formatarMoeda(valor);
        } else if (format === 'cpf') {
            valor = formatarCPF(valor);
        } 

        // Atualiza o valor do input
        event.target.value = valor;

        // Chama a função onChange do pai
        if (onChange) {
            onChange(event);
        }
    };


    return (
        <div className={`field ${aditionalClassesField}`}>
            {errors}
            {showLabel && label && (
                <label className={`label ${aditionalClasseslabel}`}>
                    <span className="icon-text has-text-descrition-cinza-custom has-text-weight-bold">
                        {icon && <span className="icon">{icon}</span>}
                        <span>{label}</span>
                    </span>
                </label>
            )}

            <div className={`control ${aditionalClassesControl}`}>
                <input
                    className="input"
                    {...props}
                     onChange={handleInputChange}
                    required={false}

                />

                <span className="icon is-small is-left">
                    {iconLeft}
                </span>
            </div>
        </div>
    )
}