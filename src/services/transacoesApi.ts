import { Transacao } from '../types';

// Em produção (Netlify), usar a URL relativa para as funções serverless
// Em desenvolvimento, usar localhost:3001 ou a URL configurada
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

/**
 * Carrega todas as transações do Google Sheets via API
 */
export async function fetchTransacoes(): Promise<Transacao[]> {
  // Se estiver em desenvolvimento e a URL for localhost, verificar se o servidor está rodando
  const isLocalDev = API_BASE_URL.includes('localhost');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/transacoes`);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar transações: ${response.statusText}`);
    }
    
    const transacoes = await response.json();
    
    // Salvar no localStorage como backup
    try {
      localStorage.setItem('controle-financeiro-transacoes', JSON.stringify(transacoes));
    } catch (e) {
      // Ignorar erro de localStorage
    }
    
    return transacoes as Transacao[];
  } catch (error: any) {
    // Se for erro de conexão em desenvolvimento, avisar mas não bloquear
    if (isLocalDev && (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED'))) {
      console.warn('⚠️ Backend local não está rodando. Use localStorage ou inicie o servidor com: npm run dev:server');
    } else {
      console.error('Erro ao buscar transações:', error);
    }
    
    // Fallback para localStorage em caso de erro
    try {
      const dados = localStorage.getItem('controle-financeiro-transacoes');
      if (dados) {
        const transacoes = JSON.parse(dados);
        console.log('📦 Carregando transações do localStorage (backup)');
        return transacoes;
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
  const isLocalDev = API_BASE_URL.includes('localhost');
  
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
    
    // Salvar no localStorage como backup
    try {
      const dados = localStorage.getItem('controle-financeiro-transacoes');
      const transacoes = dados ? JSON.parse(dados) : [];
      transacoes.push(novaTransacao);
      localStorage.setItem('controle-financeiro-transacoes', JSON.stringify(transacoes));
    } catch (e) {
      // Ignorar erro de localStorage
    }
    
    return novaTransacao as Transacao;
  } catch (error: any) {
    // Se for erro de conexão em desenvolvimento, criar localmente
    if (isLocalDev && (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED'))) {
      console.warn('⚠️ Backend local não está rodando. Criando transação localmente.');
      const novaTransacao: Transacao = {
        ...transacao,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      
      // Salvar no localStorage
      try {
        const dados = localStorage.getItem('controle-financeiro-transacoes');
        const transacoes = dados ? JSON.parse(dados) : [];
        transacoes.push(novaTransacao);
        localStorage.setItem('controle-financeiro-transacoes', JSON.stringify(transacoes));
      } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
      }
      
      return novaTransacao;
    }
    
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
