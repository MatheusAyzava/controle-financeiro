import { Transacao } from '../types';

export interface ParcelaFutura {
  id: string;
  descricao: string;
  parcelaNumero: number;
  valorParcela: number;
  dataVencimento: string;
  pessoa: 'matheus' | 'alessandra' | 'outros';
  cartao: string;
  categoria: string;
  transacaoId: string;
  nomeOutros?: string;
}

export const calcularParcelasFuturas = (transacoes: Transacao[]): ParcelaFutura[] => {
  const parcelasFuturas: ParcelaFutura[] = [];
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  transacoes.forEach((transacao) => {
    if (!transacao.parcelado || !transacao.numeroParcelas || !transacao.parcelaAtual) {
      return;
    }

    const dataInicial = new Date(transacao.data);
    const parcelaAtual = transacao.parcelaAtual;
    const totalParcelas = transacao.numeroParcelas;
    const valorParcela = transacao.valorParcela || transacao.valor;

    // Gerar parcelas futuras
    for (let i = parcelaAtual + 1; i <= totalParcelas; i++) {
      const mesesAdicionar = i - parcelaAtual;
      const dataVencimento = new Date(dataInicial);
      dataVencimento.setMonth(dataVencimento.getMonth() + mesesAdicionar);
      dataVencimento.setHours(0, 0, 0, 0);

      parcelasFuturas.push({
        id: `${transacao.id}-parcela-${i}`,
        descricao: transacao.descricao,
        parcelaNumero: i,
        valorParcela,
        dataVencimento: dataVencimento.toISOString().split('T')[0],
        pessoa: transacao.pessoa,
        cartao: transacao.cartao,
        categoria: transacao.categoria,
        transacaoId: transacao.id,
        nomeOutros: transacao.nomeOutros,
      });
    }
  });

  // Ordenar por data de vencimento
  return parcelasFuturas.sort((a, b) => 
    new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime()
  );
};

export const calcularTotalParcelasFuturas = (parcelas: ParcelaFutura[]): number => {
  return parcelas.reduce((sum, p) => sum + p.valorParcela, 0);
};
