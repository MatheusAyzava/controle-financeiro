import { Transacao } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Carrega todas as transações do Google Sheets via API
 */
export async function fetchTransacoes(): Promise<Transacao[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transacoes`);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar transações: ${response.statusText}`);
    }
    
    const transacoes = await response.json();
    return transacoes as Transacao[];
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    // Fallback para localStorage em caso de erro
    try {
      const dados = localStorage.getItem('controle-financeiro-transacoes');
      if (dados) {
        return JSON.parse(dados);
      }
    } catch (e) {
      console.error('Erro ao carregar do localStorage:', e);
    }
    return [];
  }
}

/**
 * Cria uma nova transação no Google Sheets via API
 */
export async function createTransacao(
  transacao: Omit<Transacao, 'id' | 'createdAt'>
): Promise<Transacao> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transacao),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao criar transação: ${response.statusText}`);
    }

    const novaTransacao = await response.json();
    return novaTransacao as Transacao;
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    throw error;
  }
}

/**
 * Salva múltiplas transações (usado para sincronização)
 * Como o Google Sheets não suporta atualização em lote facilmente,
 * esta função faz append de cada transação individualmente
 */
export async function salvarTransacoes(transacoes: Transacao[]): Promise<void> {
  try {
    // Primeiro, carregar transações existentes
    const transacoesExistentes = await fetchTransacoes();
    const idsExistentes = new Set(transacoesExistentes.map(t => t.id));
    
    // Filtrar apenas transações novas (que não existem ainda)
    const transacoesNovas = transacoes.filter(t => !idsExistentes.has(t.id));
    
    // Adicionar cada transação nova
    for (const transacao of transacoesNovas) {
      const { id, createdAt, ...payload } = transacao;
      await createTransacao({
        ...payload,
      });
    }
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
    // Fallback para localStorage
    try {
      localStorage.setItem('controle-financeiro-transacoes', JSON.stringify(transacoes));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
    throw error;
  }
}

/**
 * Carrega transações (alias para manter compatibilidade)
 */
export const carregarTransacoes = fetchTransacoes;
