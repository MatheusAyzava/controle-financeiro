import { Transacao } from '../types';
import { formatarMoeda } from '../utils/formatacao';
import { Repeat, User, Users, CreditCard, Calendar } from 'lucide-react';
import { useVisibility } from '../contexts/VisibilityContext';

interface ContasRecorrentesProps {
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
    'sem_cartao': 'Sem Cartão',
  };
  return nomes[cartao] || cartao;
};

export default function ContasRecorrentes({ transacoes }: ContasRecorrentesProps) {
  const { valoresVisiveis } = useVisibility();
  
  const contasRecorrentes = transacoes.filter(t => t.recorrente);

  if (contasRecorrentes.length === 0) {
    return (
      <div className="card bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg flex-shrink-0">
            <Repeat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Contas Recorrentes</h3>
            <p className="text-sm text-slate-500">Gastos fixos mensais</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500">Nenhuma conta recorrente cadastrada ainda</p>
          <p className="text-slate-400 text-sm mt-2">Marque transações como "recorrente" ao cadastrar</p>
        </div>
      </div>
    );
  }

  const totalRecorrente = contasRecorrentes.reduce((sum, t) => sum + t.valor, 0);

  return (
    <div className="card bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg flex-shrink-0">
            <Repeat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Contas Recorrentes</h3>
            <p className="text-sm text-slate-500">Gastos fixos mensais</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600">Total mensal</p>
          <p className="text-2xl font-extrabold text-green-700">
            {formatarMoeda(totalRecorrente, !valoresVisiveis)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {contasRecorrentes.map((transacao) => (
          <div
            key={transacao.id}
            className="p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Repeat className="w-4 h-4 text-green-600" />
                  <h4 className="font-bold text-slate-800">{transacao.descricao}</h4>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                    Recorrente
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    {transacao.pessoa === 'matheus' ? (
                      <User className="w-4 h-4 text-primary-600" />
                    ) : transacao.pessoa === 'alessandra' ? (
                      <Users className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Users className="w-4 h-4 text-orange-600" />
                    )}
                    <span className="font-medium">
                      {transacao.pessoa === 'matheus' ? 'Matheus' : transacao.pessoa === 'alessandra' ? 'Alessandra' : (transacao.nomeOutros || 'Outros')}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {formatarNomeCartao(transacao.cartao)}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Dia {new Date(transacao.data).getDate().toString().padStart(2, '0')} de cada mês
                  </div>
                  <span>•</span>
                  <span>{transacao.categoria}</span>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-2xl font-extrabold text-green-700">
                  {formatarMoeda(transacao.valor, !valoresVisiveis)}
                </p>
                <p className="text-xs text-slate-500 mt-1">mensal</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-green-800">Total de contas recorrentes</p>
            <p className="text-xs text-green-700 mt-1">
              Este valor é cobrado todo mês automaticamente
            </p>
          </div>
          <p className="text-3xl font-extrabold text-green-800">
            {formatarMoeda(totalRecorrente, !valoresVisiveis)}
          </p>
        </div>
      </div>
    </div>
  );
}
