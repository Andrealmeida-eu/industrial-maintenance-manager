export const formatarMoeda = (valor: number | undefined) => {
if (!valor) return
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };