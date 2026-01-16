import { salvarRenda as salvarRendaSupabase, carregarRenda as carregarRendaSupabase } from './supabaseStorage';

const RENDA_KEY = 'controle-financeiro-renda';

export const salvarRenda = async (renda: number): Promise<void> => {
  // Tentar salvar no Supabase primeiro
  try {
    await salvarRendaSupabase(renda);
  } catch (error) {
    console.error('Erro ao salvar renda no Supabase:', error);
  }
  
  // Sempre salvar no localStorage como backup
  try {
    localStorage.setItem(RENDA_KEY, JSON.stringify(renda));
  } catch (error) {
    console.error('Erro ao salvar renda no localStorage:', error);
  }
};

export const carregarRenda = async (): Promise<number> => {
  // Tentar carregar do Supabase primeiro
  try {
    const renda = await carregarRendaSupabase();
    if (renda > 0) return renda;
  } catch (error) {
    console.error('Erro ao carregar renda do Supabase:', error);
  }
  
  // Fallback para localStorage
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
