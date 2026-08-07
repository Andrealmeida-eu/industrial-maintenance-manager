export const voltar = () => {
  if (typeof window !== 'undefined') {
    window.history.back();
  }
};