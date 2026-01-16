import { ParcelaFutura, calcularTotalParcelasFuturas } from '../utils/parcelas';
import { formatarMoeda, formatarData } from '../utils/formatacao';
import { useVisibility } from '../contexts/VisibilityContext';
import { Calendar, User, Users, CreditCard, AlertCircle } from 'lucide-react';
import { Cartao } from '../types';

interface ParcelasPendentesProps {
  parcelas: ParcelaFutura[];
}

const formatarNomeCartao = (cartao: Cartao | string): string => {
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

export default function ParcelasPendentes({ parcelas }: ParcelasPendentesProps) {
  const { valoresVisiveis } = useVisibility();
  const totalPendente = calcularTotalParcelasFuturas(parcelas);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const parcelasVencendo = parcelas.filter(p => {
    const vencimento = new Date(p.dataVencimento);
    vencimento.setHours(0, 0, 0, 0);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  });

  if (parcelas.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-800">Parcelas Pendentes</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500">Nenhuma parcela pendente</p>
          <p className="text-slate-400 text-sm mt-2">Todas as parcelas foram pagas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-800">Parcelas Pendentes</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-600">Total a pagar</p>
          <p className="text-xl font-bold text-primary-600">{formatarMoeda(totalPendente, !valoresVisiveis)}</p>
        </div>
      </div>

      {parcelasVencendo.length > 0 && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <p className="text-sm font-semibold text-orange-800">
              {parcelasVencendo.length} parcela(s) vencendo nos próximos 30 dias
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {parcelas.map((parcela) => {
          const vencimento = new Date(parcela.dataVencimento);
          vencimento.setHours(0, 0, 0, 0);
          const diffTime = vencimento.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const estaVencendo = diffDays <= 30 && diffDays >= 0;
          const vencida = diffDays < 0;

          return (
            <div
              key={parcela.id}
              className={`p-3 rounded-lg border ${
                vencida
                  ? 'bg-red-50 border-red-200'
                  : estaVencendo
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-800">{parcela.descricao}</h4>
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      Parcela {parcela.parcelaNumero}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1">
                      {parcela.pessoa === 'matheus' ? (
                        <User className="w-3 h-3 text-primary-600" />
                      ) : parcela.pessoa === 'alessandra' ? (
                        <Users className="w-3 h-3 text-purple-600" />
                      ) : (
                        <Users className="w-3 h-3 text-orange-600" />
                      )}
                      {parcela.pessoa === 'matheus' ? 'Matheus' : parcela.pessoa === 'alessandra' ? 'Alessandra' : (parcela.nomeOutros || 'Outros')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {formatarNomeCartao(parcela.cartao)}
                    </span>
                    <span>•</span>
                    <span>{parcela.categoria}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className={`text-sm font-medium ${
                      vencida
                        ? 'text-red-600'
                        : estaVencendo
                        ? 'text-orange-600'
                        : 'text-slate-600'
                    }`}>
                      {formatarData(parcela.dataVencimento)}
                      {vencida && ' (Vencida)'}
                      {estaVencendo && !vencida && ` (${diffDays} dias)`}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-slate-800">
                    {formatarMoeda(parcela.valorParcela, !valoresVisiveis)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
