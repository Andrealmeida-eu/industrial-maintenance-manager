export const formatCPF = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');
  
  // Aplica a máscara do CPF
  if (numericValue.length <= 3) {
    return numericValue;
  } else if (numericValue.length <= 6) {
    return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
  } else if (numericValue.length <= 9) {
    return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
  } else {
    return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
  }
};

export const unformatCPF = (value: string): string => {
  return value ? value.replace(/\D/g, '') : '';
};