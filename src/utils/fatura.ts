import { Transacao, ConfiguracaoCartao } from '../types';

// Configurações padrão de fechamento de fatura por cartão
// Dia de fechamento (virada): dia do mês em que a fatura fecha/vira
// Dia de vencimento: dia do mês em que a fatura vence (pagamento)
// Normalmente o fechamento ocorre 10-15 dias antes do vencimento
export const CONFIGURACOES_CARTOES: ConfiguracaoCartao[] = [
  // Nubank: vence dia 8, fecha aproximadamente 10 dias antes (dia 28 do mês anterior)
  { cartao: 'nubank', diaFechamento: 28, diaVencimento: 8 },
  // AME: vence dia 8, fecha aproximadamente 10 dias antes (dia 28 do mês anterior)
  { cartao: 'ame', diaFechamento: 28, diaVencimento: 8 },
  // C6: vence dia 12, fecha aproximadamente 10 dias antes (dia 2 do mesmo mês)
  { cartao: 'c6', diaFechamento: 2, diaVencimento: 12 },
  // Itaú: vence dia 10, fecha aproximadamente 10 dias antes (dia 30 do mês anterior)
  { cartao: 'itau', diaFechamento: 30, diaVencimento: 10 },
  // Carrefour: vence dia 12, fecha aproximadamente 10 dias antes (dia 2 do mesmo mês)
  { cartao: 'carrefour', diaFechamento: 2, diaVencimento: 12 },
  // Atacadão: vence dia 12, fecha aproximadamente 10 dias antes (dia 2 do mesmo mês)
  { cartao: 'atacadão', diaFechamento: 2, diaVencimento: 12 },
  // Banco do Brasil: padrão (pode ser ajustado depois)
  { cartao: 'banco do brasil', diaFechamento: 15, diaVencimento: 25 },
  // Sem cartão: não tem fechamento/vencimento
  { cartao: 'sem_cartao', diaFechamento: 31, diaVencimento: 31 },
];

// Carregar configurações salvas (com fallback para padrões)
export const carregarConfiguracoesCartoes = (): ConfiguracaoCartao[] => {
  try {
    const saved = localStorage.getItem('controle-financeiro-config-cartoes');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }
  return CONFIGURACOES_CARTOES;
};

// Salvar configurações
export const salvarConfiguracoesCartoes = (configs: ConfiguracaoCartao[]): void => {
  try {
    localStorage.setItem('controle-financeiro-config-cartoes', JSON.stringify(configs));
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
  }
};

/**
 * Calcula qual mês de fatura uma transação pertence
 * Se a data da transação for antes ou no dia de fechamento, conta para o mês atual
 * Se for depois do dia de fechamento, conta para o próximo mês
 */
export const calcularMesFatura = (
  dataTransacao: string | Date,
  diaFechamento: number,
  _cartao: string
): string => {
  const data = typeof dataTransacao === 'string' ? new Date(dataTransacao) : dataTransacao;
  const dia = data.getDate();
  const mes = data.getMonth();
  const ano = data.getFullYear();

  // Se o dia da transação for <= dia de fechamento, conta para o mês atual
  // Se for > dia de fechamento, conta para o próximo mês
  if (dia <= diaFechamento) {
    // Mesmo mês
    return `${ano}-${String(mes + 1).padStart(2, '0')}`;
  } else {
    // Próximo mês
    const proximoMes = mes === 11 ? 0 : mes + 1;
    const proximoAno = mes === 11 ? ano + 1 : ano;
    return `${proximoAno}-${String(proximoMes + 1).padStart(2, '0')}`;
  }
};

/**
 * Obtém o mês de fatura para uma transação específica
 */
export const obterMesFaturaTransacao = (transacao: Transacao, configs: ConfiguracaoCartao[]): string => {
  const config = configs.find(c => c.cartao === transacao.cartao);
  const diaFechamento = config?.diaFechamento || 10; // Default: dia 10
  return calcularMesFatura(transacao.data, diaFechamento, transacao.cartao);
};

/**
 * Formata o mês de fatura para exibição (ex: "2026-02" -> "Fevereiro 2026")
 */
export const formatarMesFatura = (mesFatura: string): string => {
  const [ano, mes] = mesFatura.split('-');
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${meses[parseInt(mes) - 1]} ${ano}`;
};

/**
 * Calcula quantos dias faltam para o próximo fechamento
 */
export const diasParaFechamento = (diaFechamento: number): number => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const dia = hoje.getDate();

  // Data de fechamento deste mês
  const fechamentoEsteMes = new Date(ano, mes, diaFechamento);

  if (dia <= diaFechamento) {
    // Ainda não fechou este mês
    const diffTime = fechamentoEsteMes.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } else {
    // Já fechou, próximo fechamento é no próximo mês
    const fechamentoProximoMes = new Date(ano, mes + 1, diaFechamento);
    const diffTime = fechamentoProximoMes.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

/**
 * Verifica se está perto do fechamento (dentro de 3 dias)
 */
export const estaProximoFechamento = (diaFechamento: number): boolean => {
  const dias = diasParaFechamento(diaFechamento);
  return dias >= 0 && dias <= 3;
};

/**
 * Obtém todas as transações agrupadas por mês de fatura
 */
export const agruparTransacoesPorMesFatura = (
  transacoes: Transacao[],
  configs: ConfiguracaoCartao[]
): Map<string, Transacao[]> => {
  const agrupadas = new Map<string, Transacao[]>();

  transacoes.forEach(transacao => {
    const mesFatura = obterMesFaturaTransacao(transacao, configs);
    if (!agrupadas.has(mesFatura)) {
      agrupadas.set(mesFatura, []);
    }
    agrupadas.get(mesFatura)!.push(transacao);
  });

  // Ordenar por mês (mais recente primeiro)
  return new Map([...agrupadas.entries()].sort((a, b) => b[0].localeCompare(a[0])));
};
