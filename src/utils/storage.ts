import { Transacao, ResumoFinanceiro, Cartao } from '../types';
import { calcularParcelasFuturas, calcularTotalParcelasFuturas } from './parcelas';

const STORAGE_KEY = 'controle-financeiro-transacoes';

export const salvarTransacoes = (transacoes: Transacao[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transacoes));
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
  }
};

export const carregarTransacoes = (): Transacao[] => {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (dados) {
      const transacoes: any[] = JSON.parse(dados);
      // Migração: converter "sogra" para "alessandra" e adicionar cartão se não existir
      return transacoes.map((t) => ({
        ...t,
        pessoa: t.pessoa === 'sogra' ? 'alessandra' : (t.pessoa === 'eu' ? 'matheus' : t.pessoa),
        cartao: t.cartao || 'nubank', // Default para nubank se não existir
        parcelado: t.parcelado || false,
        numeroParcelas: t.numeroParcelas || 1,
        parcelaAtual: t.parcelaAtual || 1,
        valorParcela: t.valorParcela || t.valor,
        valorTotal: t.valorTotal || t.valor,
      })) as Transacao[];
    }
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
  }
  return [];
};

export const calcularResumo = (transacoes: Transacao[], rendaMensal: number = 0): ResumoFinanceiro => {
  const totalMatheus = transacoes
    .filter(t => t.pessoa === 'matheus')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalAlessandra = transacoes
    .filter(t => t.pessoa === 'alessandra')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalOutros = transacoes
    .filter(t => t.pessoa === 'outros')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalGeral = totalMatheus + totalAlessandra + totalOutros;
  const saldoDisponivel = rendaMensal - totalGeral;

  // Calcular parcelas futuras
  const parcelasFuturas = calcularParcelasFuturas(transacoes);
  const totalParcelasFuturas = calcularTotalParcelasFuturas(parcelasFuturas);

  // Calcular maiores gastos (top 5) - considerar valor total se parcelado
  const maioresGastos = [...transacoes]
    .map(t => ({
      ...t,
      valorComparacao: t.parcelado && t.valorTotal ? t.valorTotal : t.valor,
    }))
    .sort((a, b) => b.valorComparacao - a.valorComparacao)
    .slice(0, 5)
    .map(t => ({
      descricao: t.descricao + (t.parcelado ? ` (${t.parcelaAtual}/${t.numeroParcelas})` : ''),
      valor: t.valorComparacao,
      pessoa: t.pessoa,
      nomeOutros: t.nomeOutros,
    }));

  // Calcular gastos por cartão
  const cartoes: Cartao[] = ['nubank', 'banco do brasil', 'c6', 'ame', 'itau', 'atacadão', 'carrefour'];
  const gastosPorCartao: Record<Cartao, { matheus: number; alessandra: number; outros: number; total: number }> = {} as any;
  
  cartoes.forEach(cartao => {
    const matheus = transacoes
      .filter(t => t.cartao === cartao && t.pessoa === 'matheus')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const alessandra = transacoes
      .filter(t => t.cartao === cartao && t.pessoa === 'alessandra')
      .reduce((sum, t) => sum + t.valor, 0);

    const outros = transacoes
      .filter(t => t.cartao === cartao && t.pessoa === 'outros')
      .reduce((sum, t) => sum + t.valor, 0);
    
    gastosPorCartao[cartao] = {
      matheus,
      alessandra,
      outros,
      total: matheus + alessandra + outros,
    };
  });
  
  return {
    totalMatheus,
    totalAlessandra,
    totalOutros,
    totalGeral,
    quantidadeTransacoes: transacoes.length,
    rendaMensal,
    saldoDisponivel,
    maioresGastos,
    totalParcelasFuturas,
    gastosPorCartao,
  };
};
