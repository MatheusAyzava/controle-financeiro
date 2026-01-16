import { ResumoFinanceiro, Cartao } from '../types';
import { formatarMoeda } from '../utils/formatacao';
import { CreditCard, User, Users } from 'lucide-react';
import { useVisibility } from '../contexts/VisibilityContext';

interface GastosPorCartaoProps {
  gastosPorCartao: ResumoFinanceiro['gastosPorCartao'];
}

const formatarNomeCartao = (cartao: Cartao): string => {
  const nomes: Record<Cartao, string> = {
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

const coresCartoes: Record<Cartao, string> = {
  'nubank': 'from-purple-500 to-purple-600',
  'banco do brasil': 'from-yellow-500 to-yellow-600',
  'c6': 'from-blue-500 to-blue-600',
  'ame': 'from-orange-500 to-orange-600',
  'itau': 'from-orange-400 to-orange-500',
  'atacadão': 'from-red-500 to-red-600',
  'carrefour': 'from-blue-400 to-blue-500',
};

export default function GastosPorCartao({ gastosPorCartao }: GastosPorCartaoProps) {
  const { valoresVisiveis } = useVisibility();
  
  const cartoesComGastos = Object.entries(gastosPorCartao)
    .filter(([_, valores]) => valores.total > 0)
    .sort(([_, a], [__, b]) => b.total - a.total) as [Cartao, { matheus: number; alessandra: number; outros: number; total: number }][];

  // Sempre mostrar a seção, mesmo se não houver gastos
  // if (cartoesComGastos.length === 0) {
  //   return null;
  // }

  return (
    <div className="card bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg flex-shrink-0">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Gastos por Cartão</h3>
          <p className="text-sm text-slate-500">Valores separados por pessoa</p>
        </div>
      </div>
      {cartoesComGastos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">Nenhum gasto registrado nos cartões ainda</p>
          <p className="text-slate-400 text-sm mt-2">Adicione transações para ver os valores por cartão</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartoesComGastos.map(([cartao, valores]) => (
          <div
            key={cartao}
            className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`bg-gradient-to-br ${coresCartoes[cartao]} p-2 rounded-lg shadow-md`}>
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-bold text-slate-800">{formatarNomeCartao(cartao)}</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-slate-700">Matheus</span>
                </div>
                <span className="font-bold text-primary-700">
                  {formatarMoeda(valores.matheus, !valoresVisiveis)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Alessandra</span>
                </div>
                <span className="font-bold text-purple-700">
                  {formatarMoeda(valores.alessandra, !valoresVisiveis)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-slate-700">Outros</span>
                </div>
                <span className="font-bold text-orange-700">
                  {formatarMoeda(valores.outros, !valoresVisiveis)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-100 rounded-lg border border-slate-300 mt-2">
                <span className="text-sm font-semibold text-slate-700">Total</span>
                <span className="font-extrabold text-slate-800">
                  {formatarMoeda(valores.total, !valoresVisiveis)}
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
