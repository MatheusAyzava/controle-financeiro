import { Cartao } from '../types';
import { diasParaFechamento, estaProximoFechamento, carregarConfiguracoesCartoes } from '../utils/fatura';
import { AlertCircle, Calendar } from 'lucide-react';

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

export default function LembreteFaturas() {
  const configs = carregarConfiguracoesCartoes();

  // Filtrar apenas cartões que têm transações ou estão próximos do fechamento
  // Excluir "sem_cartao" pois não tem fechamento
  const lembretes = configs
    .filter(config => config.cartao !== 'sem_cartao')
    .map(config => {
      const dias = diasParaFechamento(config.diaFechamento);
      const proximo = estaProximoFechamento(config.diaFechamento);
      return { ...config, dias, proximo };
    })
    .filter(item => item.proximo) // Mostrar apenas os que estão próximos (3 dias ou menos)
    .sort((a, b) => a.dias - b.dias); // Ordenar por dias restantes

  if (lembretes.length === 0) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 border-2 border-orange-300 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Lembrete de Faturas</h3>
          <p className="text-sm text-slate-600">Fechamento próximo</p>
        </div>
      </div>
      <div className="space-y-3">
        {lembretes.map((lembrete) => (
          <div
            key={lembrete.cartao}
            className={`p-4 rounded-lg border-2 ${
              lembrete.dias === 0
                ? 'bg-red-100 border-red-300 animate-pulse'
                : lembrete.dias <= 1
                ? 'bg-orange-100 border-orange-300'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 ${
                  lembrete.dias === 0
                    ? 'text-red-600'
                    : lembrete.dias <= 1
                    ? 'text-orange-600'
                    : 'text-yellow-600'
                }`} />
                <div>
                  <p className="font-bold text-slate-800">{formatarNomeCartao(lembrete.cartao)}</p>
                  <p className="text-sm text-slate-600">
                    Fatura fecha dia {lembrete.diaFechamento.toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-extrabold ${
                  lembrete.dias === 0
                    ? 'text-red-700'
                    : lembrete.dias <= 1
                    ? 'text-orange-700'
                    : 'text-yellow-700'
                }`}>
                  {lembrete.dias === 0
                    ? 'Hoje!'
                    : lembrete.dias === 1
                    ? '1 dia'
                    : `${lembrete.dias} dias`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {lembrete.dias === 0
                    ? '⚠️ Fecha hoje!'
                    : lembrete.dias === 1
                    ? 'Fecha amanhã'
                    : 'até fechar'}
                </p>
              </div>
            </div>
            {lembrete.dias === 0 && (
              <div className="mt-3 p-2 bg-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-800 text-center">
                  ⚠️ Atenção! A fatura fecha HOJE. Transações de hoje ainda contam para este mês.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-white/50 rounded-lg border border-orange-200">
        <p className="text-xs text-slate-600">
          <strong>Como funciona:</strong> Transações até o dia {lembretes[0]?.diaFechamento} contam para o mês atual. 
          A partir do dia {lembretes[0] && lembretes[0].diaFechamento + 1}, começam a contar para o próximo mês.
        </p>
      </div>
    </div>
  );
}
