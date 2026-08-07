export const traduzirDiaSemana = (diaIngles: string): string | undefined => {

  if(!diaIngles) return
  const traducoes: Record<string, string> = {
    'SUNDAY': 'Domingo',
    'MONDAY': 'Segunda-feira',
    'TUESDAY': 'Terça-feira',
    'WEDNESDAY': 'Quarta-feira',
    'THURSDAY': 'Quinta-feira',
    'FRIDAY': 'Sexta-feira',
    'SATURDAY': 'Sábado'
  };

  return traducoes[diaIngles.toUpperCase()] || diaIngles;
};

