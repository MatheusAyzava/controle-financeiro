import { Transacao, Cartao } from '../types';
import { formatarMoeda, formatarData } from '../utils/formatacao';
import { useVisibility } from '../contexts/VisibilityContext';
import { Trash2, User, Users, CreditCard, Repeat } from 'lucide-react';

const formatarNomeCartao = (cartao: Cartao): string => {
  const nomes: Record<Cartao, string> = {
    'nubank': 'Nubank',
    'banco do brasil': 'Banco do Brasil',
    'c6': 'C6 Bank',
    'ame': 'AME',
    'itau': 'Itaú',
    'atacadão': 'Atacadão',
    'carrefour': 'Carrefour',
    'sem_cartao': 'Sem Cartão',
  };
  return nomes[cartao] || cartao;
};

const formatarTipoDespesa = (tipo: string): string => {
  const tipos: Record<string, string> = {
    'aluguel': '🏠 Aluguel',
    'conta_luz': '💡 Conta de Luz',
    'conta_agua': '💧 Conta de Água',
    'internet': '📶 Internet/TV/Telefone',
    'supermercado': '🛒 Supermercado',
    'farmacia': '💊 Farmácia',
    'combustivel': '⛽ Combustível',
    'transferencia': '💸 Transferência/PIX',
    'dinheiro': '💵 Dinheiro',
    'outros': '📋 Outros',
  };
  return tipos[tipo] || tipo;
};

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onRemover: (id: string) => void;
}

export default function ListaTransacoes({ transacoes, onRemover }: ListaTransacoesProps) {
  const { valoresVisiveis } = useVisibility();
  if (transacoes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 text-lg">Nenhuma transação cadastrada ainda</p>
        <p className="text-slate-400 text-sm mt-2">Adicione uma transação usando o formulário ao lado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transacoes.map((transacao) => (
        <div
          key={transacao.id}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className={`p-3 rounded-lg ${
              transacao.pessoa === 'matheus' 
                ? 'bg-primary-100 text-primary-700' 
                : transacao.pessoa === 'alessandra'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {transacao.pessoa === 'matheus' ? (
                <User className="w-5 h-5" />
              ) : transacao.pessoa === 'alessandra' ? (
                <Users className="w-5 h-5" />
              ) : (
                <Users className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-800 truncate">{transacao.descricao}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transacao.pessoa === 'matheus'
                    ? 'bg-primary-100 text-primary-700'
                    : transacao.pessoa === 'alessandra'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {transacao.pessoa === 'matheus' ? 'Matheus' : transacao.pessoa === 'alessandra' ? 'Alessandra' : (transacao.nomeOutros || 'Outros')}
                </span>
              </div>
              {transacao.recorrente && (
                <div className="flex items-center gap-1 mt-2">
                  <Repeat className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    Recorrente
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {transacao.cartao === 'sem_cartao' && transacao.tipoDespesaSemCartao ? (
                    <span>
                      {formatarNomeCartao(transacao.cartao)} - {formatarTipoDespesa(transacao.tipoDespesaSemCartao)}
                    </span>
                  ) : (
                    formatarNomeCartao(transacao.cartao)
                  )}
                </span>
                <span>•</span>
                <span>{transacao.categoria}</span>
                {transacao.parcelado && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {transacao.parcelaAtual}/{transacao.numeroParcelas}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{formatarData(transacao.data)}</span>
              </div>
              {transacao.parcelado && transacao.valorTotal && (
                <div className="mt-1 text-xs text-slate-500">
                  Total: {formatarMoeda(transacao.valorTotal, !valoresVisiveis)} ({transacao.numeroParcelas}x de {formatarMoeda(transacao.valorParcela || transacao.valor, !valoresVisiveis)})
                </div>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-slate-800">{formatarMoeda(transacao.valor, !valoresVisiveis)}</p>
            </div>
            
            <button
              onClick={() => onRemover(transacao.id)}
              className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remover transação"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Receipt({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
