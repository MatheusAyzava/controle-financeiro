import { formatarMoeda } from '../utils/formatacao';
import { useVisibility } from '../contexts/VisibilityContext';
import { TrendingUp, User, Users } from 'lucide-react';

interface MaioresGastosProps {
  gastos: Array<{
    descricao: string;
    valor: number;
    pessoa: 'matheus' | 'alessandra' | 'outros';
    nomeOutros?: string;
  }>;
}

export default function MaioresGastos({ gastos }: MaioresGastosProps) {
  const { valoresVisiveis } = useVisibility();
  if (gastos.length === 0) return null;

  return (
    <div className="card bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Maiores Gastos</h3>
          <p className="text-sm text-slate-500">Top 5 transações</p>
        </div>
      </div>
      <div className="space-y-4">
        {gastos.map((gasto, index) => {
          const medalColors = [
            'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg',
            'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-lg',
            'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg',
            'bg-gradient-to-br from-blue-300 to-blue-400 text-white',
            'bg-gradient-to-br from-purple-300 to-purple-400 text-white',
          ];
          
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${medalColors[index] || 'bg-slate-200 text-slate-700'}`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate text-lg">{gasto.descricao}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`p-1.5 rounded-lg ${
                      gasto.pessoa === 'matheus' 
                        ? 'bg-primary-100' 
                        : gasto.pessoa === 'alessandra'
                        ? 'bg-purple-100'
                        : 'bg-orange-100'
                    }`}>
                      {gasto.pessoa === 'matheus' ? (
                        <User className="w-4 h-4 text-primary-600" />
                      ) : gasto.pessoa === 'alessandra' ? (
                        <Users className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Users className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {gasto.pessoa === 'matheus' ? 'Matheus' : gasto.pessoa === 'alessandra' ? 'Alessandra' : (gasto.nomeOutros || 'Outros')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-extrabold text-slate-800">{formatarMoeda(gasto.valor, !valoresVisiveis)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
