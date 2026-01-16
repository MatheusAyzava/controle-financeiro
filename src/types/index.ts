export type Pessoa = 'matheus' | 'alessandra' | 'outros';

export type Cartao = 'nubank' | 'banco do brasil' | 'c6' | 'ame' | 'itau' | 'atacadão' | 'carrefour';

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  pessoa: Pessoa;
  cartao: Cartao;
  categoria: string;
  data: string;
  createdAt: number;
  parcelado?: boolean;
  numeroParcelas?: number;
  parcelaAtual?: number;
  valorParcela?: number;
  valorTotal?: number;
  nomeOutros?: string; // Nome personalizado quando pessoa é 'outros'
}

export interface ResumoFinanceiro {
  totalMatheus: number;
  totalAlessandra: number;
  totalOutros: number;
  totalGeral: number;
  quantidadeTransacoes: number;
  rendaMensal: number;
  saldoDisponivel: number;
  maioresGastos: Array<{
    descricao: string;
    valor: number;
    pessoa: Pessoa;
  }>;
  totalParcelasFuturas: number;
  gastosPorCartao: Record<Cartao, {
    matheus: number;
    alessandra: number;
    outros: number;
    total: number;
  }>;
}
