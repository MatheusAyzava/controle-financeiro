import { useState } from 'react';
import { Transacao } from '../types';
import { formatarMoeda, formatarData } from '../utils/formatacao';
import { useVisibility } from '../contexts/VisibilityContext';
import { History, User, Users, CreditCard, Calendar, Filter } from 'lucide-react';

interface HistoricoProps {
  transacoes: Transacao[];
}

const formatarNomeCartao = (cartao: string): string => {
  const nomes: Record<string, string> = {
    'nubank': 'Nubank',
    'banco do brasil': 'Banco do Brasil',
    'c6': 'C6 Bank',
    'ame': 'AME',
    'itau': 'Itaú',
    'atacadão': 'Atacadão',
    'carrefour': 'Carrefour',
  };
  return nomes[cartao] || cartao;
};

export default function Historico({ transacoes }: HistoricoProps) {
  const { valoresVisiveis } = useVisibility();
  const [filtroPessoa, setFiltroPessoa] = useState<'todos' | 'matheus' | 'alessandra' | 'outros'>('todos');
  const [filtroMes, setFiltroMes] = useState<string>('');

  // Agrupar transações por mês
  const transacoesAgrupadas = transacoes
    .filter(t => {
      if (filtroPessoa !== 'todos' && t.pessoa !== filtroPessoa) return false;
      if (filtroMes) {
        const transacaoMes = new Date(t.data).toISOString().slice(0, 7);
        if (transacaoMes !== filtroMes) return false;
      }
      return true;
    })
    .reduce((acc, transacao) => {
      const mes = new Date(transacao.data).toISOString().slice(0, 7);
      if (!acc[mes]) {
        acc[mes] = [];
      }
      acc[mes].push(transacao);
      return acc;
    }, {} as Record<string, Transacao[]>);

  const meses = Object.keys(transacoesAgrupadas).sort((a, b) => b.localeCompare(a));

  const totalGeral = transacoes
    .filter(t => {
      if (filtroPessoa !== 'todos' && t.pessoa !== filtroPessoa) return false;
      if (filtroMes) {
        const transacaoMes = new Date(t.data).toISOString().slice(0, 7);
        if (transacaoMes !== filtroMes) return false;
      }
      return true;
    })
    .reduce((sum, t) => sum + t.valor, 0);

  if (transacoes.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-800">Histórico Completo</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500">Nenhuma transação no histórico</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-800">Histórico Completo</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-600">Total filtrado</p>
          <p className="text-xl font-bold text-primary-600">{formatarMoeda(totalGeral, !valoresVisiveis)}</p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filtros:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroPessoa('todos')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtroPessoa === 'todos'
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroPessoa('matheus')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtroPessoa === 'matheus'
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Matheus
            </button>
            <button
              onClick={() => setFiltroPessoa('alessandra')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtroPessoa === 'alessandra'
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Alessandra
            </button>
            <button
              onClick={() => setFiltroPessoa('outros')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtroPessoa === 'outros'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Outros
            </button>
          </div>
          <div>
            <input
              type="month"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Filtrar por mês"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto">
        {meses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">Nenhuma transação encontrada com os filtros selecionados</p>
          </div>
        ) : (
          meses.map((mes) => {
            const transacoesDoMes = transacoesAgrupadas[mes];
            const totalMes = transacoesDoMes.reduce((sum, t) => sum + t.valor, 0);
            const mesFormatado = new Date(mes + '-01').toLocaleDateString('pt-BR', {
              month: 'long',
              year: 'numeric',
            });

            return (
              <div key={mes} className="border-b border-slate-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800 capitalize">
                    {mesFormatado}
                  </h4>
                  <span className="text-sm font-medium text-slate-600">
                    {transacoesDoMes.length} transação(ões) • {formatarMoeda(totalMes, !valoresVisiveis)}
                  </span>
                </div>
                <div className="space-y-2">
                  {transacoesDoMes.map((transacao) => (
                    <div
                      key={transacao.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            transacao.pessoa === 'matheus'
                              ? 'bg-primary-100 text-primary-700'
                              : transacao.pessoa === 'alessandra'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {transacao.pessoa === 'matheus' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Users className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-slate-800 truncate">
                                {transacao.descricao}
                              </p>
                              {transacao.parcelado && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                  {transacao.parcelaAtual}/{transacao.numeroParcelas}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {formatarNomeCartao(transacao.cartao)}
                              </span>
                              <span>•</span>
                              <span>{transacao.categoria}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatarData(transacao.data)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-slate-800">
                            {formatarMoeda(transacao.valor, !valoresVisiveis)}
                          </p>
                          {transacao.parcelado && transacao.valorTotal && (
                            <p className="text-xs text-slate-500">
                              Total: {formatarMoeda(transacao.valorTotal, !valoresVisiveis)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
