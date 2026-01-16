import { Transacao } from '../types';
import { supabase } from '../lib/supabase';

const TABLE_TRANSACOES = 'transacoes';
const TABLE_RENDA = 'renda';

// Função para verificar se Supabase está disponível
const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Função para obter ou criar user_id (usando um ID fixo para este app)
const getUserId = () => {
  // Para um app simples, usamos um ID fixo
  // Em produção, você pode implementar autenticação
  return 'user-1';
};

export const salvarTransacoes = async (transacoes: Transacao[]): Promise<void> => {
  if (!isSupabaseAvailable()) {
    // Fallback para localStorage
    try {
      localStorage.setItem('controle-financeiro-transacoes', JSON.stringify(transacoes));
    } catch (error) {
      console.error('Erro ao salvar transações no localStorage:', error);
    }
    return;
  }

  try {
    const userId = getUserId();
    
    // Deletar todas as transações existentes
    await supabase!
      .from(TABLE_TRANSACOES)
      .delete()
      .eq('user_id', userId);

    // Inserir todas as transações
    if (transacoes.length > 0) {
      const transacoesParaSalvar = transacoes.map(t => ({
        id: t.id,
        user_id: userId,
        descricao: t.descricao,
        valor: t.valor,
        pessoa: t.pessoa,
        cartao: t.cartao,
        categoria: t.categoria,
        data: t.data,
        created_at: t.createdAt,
        parcelado: t.parcelado || false,
        numero_parcelas: t.numeroParcelas || null,
        parcela_atual: t.parcelaAtual || null,
        valor_parcela: t.valorParcela || null,
        valor_total: t.valorTotal || null,
        nome_outros: t.nomeOutros || null,
      }));

      const { error } = await supabase!
        .from(TABLE_TRANSACOES)
        .insert(transacoesParaSalvar);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Erro ao salvar transações no Supabase:', error);
    // Fallback para localStorage
    try {
      localStorage.setItem('controle-financeiro-transacoes', JSON.stringify(transacoes));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }
};

export const carregarTransacoes = async (): Promise<Transacao[]> => {
  if (!isSupabaseAvailable()) {
    // Fallback para localStorage
    try {
      const dados = localStorage.getItem('controle-financeiro-transacoes');
      if (dados) {
        const transacoes: any[] = JSON.parse(dados);
        return transacoes.map((t) => ({
          ...t,
          pessoa: t.pessoa === 'sogra' || t.pessoa === 'eu' ? (t.pessoa === 'eu' ? 'matheus' : 'alessandra') : t.pessoa,
          cartao: t.cartao || 'nubank',
          parcelado: t.parcelado || false,
          numeroParcelas: t.numeroParcelas || 1,
          parcelaAtual: t.parcelaAtual || 1,
          valorParcela: t.valorParcela || t.valor,
          valorTotal: t.valorTotal || t.valor,
        })) as Transacao[];
      }
    } catch (error) {
      console.error('Erro ao carregar transações do localStorage:', error);
    }
    return [];
  }

  try {
    const userId = getUserId();
    const { data, error } = await supabase!
      .from(TABLE_TRANSACOES)
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map((t: any) => {
        return {
          id: t.id,
          descricao: t.descricao,
          valor: parseFloat(t.valor),
          pessoa: (t.pessoa === 'sogra' || t.pessoa === 'eu' ? (t.pessoa === 'eu' ? 'matheus' : 'alessandra') : t.pessoa) as 'matheus' | 'alessandra' | 'outros',
          cartao: t.cartao || 'nubank',
          categoria: t.categoria,
          data: t.data,
          createdAt: t.created_at,
          parcelado: t.parcelado || false,
          numeroParcelas: t.numero_parcelas || undefined,
          parcelaAtual: t.parcela_atual || undefined,
          valorParcela: t.valor_parcela ? parseFloat(t.valor_parcela) : undefined,
          valorTotal: t.valor_total ? parseFloat(t.valor_total) : undefined,
          nomeOutros: t.nome_outros || undefined,
        } as Transacao;
      });
    }

    return [];
  } catch (error) {
    console.error('Erro ao carregar transações do Supabase:', error);
    // Fallback para localStorage
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
};

export const salvarRenda = async (renda: number): Promise<void> => {
  if (!isSupabaseAvailable()) {
    try {
      localStorage.setItem('controle-financeiro-renda', JSON.stringify(renda));
    } catch (error) {
      console.error('Erro ao salvar renda no localStorage:', error);
    }
    return;
  }

  try {
    const userId = getUserId();
    const { error } = await supabase!
      .from(TABLE_RENDA)
      .upsert({
        user_id: userId,
        valor: renda,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao salvar renda no Supabase:', error);
    // Fallback para localStorage
    try {
      localStorage.setItem('controle-financeiro-renda', JSON.stringify(renda));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }
};

export const carregarRenda = async (): Promise<number> => {
  if (!isSupabaseAvailable()) {
    try {
      const dados = localStorage.getItem('controle-financeiro-renda');
      if (dados) {
        return JSON.parse(dados);
      }
    } catch (error) {
      console.error('Erro ao carregar renda do localStorage:', error);
    }
    return 0;
  }

  try {
    const userId = getUserId();
    const { data, error } = await supabase!
      .from(TABLE_RENDA)
      .select('valor')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

    return data?.valor || 0;
  } catch (error) {
    console.error('Erro ao carregar renda do Supabase:', error);
    // Fallback para localStorage
    try {
      const dados = localStorage.getItem('controle-financeiro-renda');
      if (dados) {
        return JSON.parse(dados);
      }
    } catch (e) {
      console.error('Erro ao carregar do localStorage:', e);
    }
    return 0;
  }
};
