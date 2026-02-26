import { useState, useEffect } from 'react';
import { ConfiguracaoCartao, Cartao } from '../types';
import { carregarConfiguracoesCartoes, salvarConfiguracoesCartoes, CONFIGURACOES_CARTOES } from '../utils/fatura';
import { Settings, Save } from 'lucide-react';

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

export default function ConfigCartoes() {
  const [configs, setConfigs] = useState<ConfiguracaoCartao[]>(CONFIGURACOES_CARTOES);
  const [editando, setEditando] = useState(false);
  const [salvou, setSalvou] = useState(false);

  useEffect(() => {
    const carregadas = carregarConfiguracoesCartoes();
    setConfigs(carregadas);
  }, []);

  const handleSalvar = () => {
    salvarConfiguracoesCartoes(configs);
    setEditando(false);
    setSalvou(true);
    setTimeout(() => setSalvou(false), 3000);
  };

  const handleDiaFechamentoChange = (cartao: Cartao, dia: number) => {
    setConfigs(configs.map(c => 
      c.cartao === cartao ? { ...c, diaFechamento: Math.max(1, Math.min(31, dia)) } : c
    ));
  };

  const handleDiaVencimentoChange = (cartao: Cartao, dia: number) => {
    setConfigs(configs.map(c => 
      c.cartao === cartao ? { ...c, diaVencimento: Math.max(1, Math.min(31, dia)) } : c
    ));
  };

  return (
    <div className="card bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg flex-shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Configurações dos Cartões</h3>
            <p className="text-sm text-slate-500">Configure quando cada fatura fecha</p>
          </div>
        </div>
        {!editando ? (
          <button
            onClick={() => setEditando(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Editar
          </button>
        ) : (
          <button
            onClick={handleSalvar}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        )}
      </div>

      {salvou && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-sm font-medium text-green-800">✓ Configurações salvas com sucesso!</p>
        </div>
      )}

      <div className="space-y-3">
        {configs
          .filter(config => config.cartao !== 'sem_cartao') // Não mostrar "sem_cartao" nas configurações
          .map((config) => (
          <div
            key={config.cartao}
            className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-3">{formatarNomeCartao(config.cartao)}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Dia de Fechamento
                    </label>
                    {editando ? (
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={config.diaFechamento}
                        onChange={(e) => handleDiaFechamentoChange(config.cartao, parseInt(e.target.value) || 1)}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-slate-800">Dia {config.diaFechamento.toString().padStart(2, '0')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Dia de Vencimento
                    </label>
                    {editando ? (
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={config.diaVencimento}
                        onChange={(e) => handleDiaVencimentoChange(config.cartao, parseInt(e.target.value) || 1)}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-slate-800">Dia {config.diaVencimento.toString().padStart(2, '0')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-slate-700 mb-2">
          <strong>Como funciona:</strong>
        </p>
        <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
          <li><strong>Dia de Fechamento (Virada):</strong> Dia em que a fatura fecha/vira. Transações até este dia contam para o mês atual.</li>
          <li><strong>Dia de Vencimento:</strong> Dia em que a fatura vence (pagamento).</li>
          <li>Transações após o dia de fechamento começam a contar para o próximo mês.</li>
          <li>Exemplo: Se fecha dia 28, transações até dia 28 contam para fevereiro. A partir do dia 29, contam para março.</li>
        </ul>
      </div>
    </div>
  );
}
