  export const getPrimeiroEUltimoNome = (nomeCompleto: string): string => {
  const partes = nomeCompleto.split(' ').filter(Boolean); // Divide e remove strings vazias
  
  if (partes.length <= 2) {
    // Se tiver apenas um ou dois nomes, retorna completo
    return nomeCompleto;
  }
  
  // Pega o primeiro e o último nome
  const primeiroNome = partes[0];
  const ultimoNome = partes[partes.length - 1];
  
  return `${primeiroNome} ${ultimoNome}`;
};
