const RENDA_KEY = 'controle-financeiro-renda';

export const salvarRenda = async (renda: number): Promise<void> => {
  // Salvar apenas no localStorage (não usa mais Supabase)
  try {
    localStorage.setItem(RENDA_KEY, JSON.stringify(renda));
  } catch (error) {
    console.error('Erro ao salvar renda no localStorage:', error);
  }
};

export const carregarRenda = async (): Promise<number> => {
  // Carregar apenas do localStorage (não usa mais Supabase)
  try {
    const dados = localStorage.getItem(RENDA_KEY);
    if (dados) {
      return JSON.parse(dados);
    }
  } catch (error) {
    console.error('Erro ao carregar renda do localStorage:', error);
  }
  return 0;
};
