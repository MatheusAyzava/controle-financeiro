import { useState, useEffect } from 'react';
import { Transacao, ResumoFinanceiro } from './types';
import { calcularResumo } from './utils/storage';
import { createTransacao, carregarTransacoes } from './services/transacoesApi';
import { carregarRenda } from './utils/renda';
import { calcularParcelasFuturas } from './utils/parcelas';
import Dashboard from './components/Dashboard';
import ListaTransacoes from './components/ListaTransacoes';
import FormularioTransacao from './components/FormularioTransacao';
import ParcelasPendentes from './components/ParcelasPendentes';
import Historico from './components/Historico';
import ConfigCartoes from './components/ConfigCartoes';
import { Wallet, RefreshCw } from 'lucide-react';

function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    totalMatheus: 0,
    totalAlessandra: 0,
    totalOutros: 0,
    totalGeral: 0,
    quantidadeTransacoes: 0,
    rendaMensal: 0,
    saldoDisponivel: 0,
    maioresGastos: [],
    totalParcelasFuturas: 0,
    gastosPorCartao: {
      nubank: { matheus: 0, alessandra: 0, outros: 0, total: 0 },
      'banco do brasil': { matheus: 0, alessandra: 0, outros: 0, total: 0 },
      c6: { matheus: 0, alessandra: 0, outros: 0, total: 0 },
      ame: { matheus: 0, alessandra: 0, outros: 0, total: 0 },
      itau: { matheus: 0, alessandra: 0, outros: 0, total: 0 },
      atacadão: { matheus: 0, alessandra: 0, outros: 0, total: 0 },
      carrefour: { matheus: 0, alessandra: 0, outros: 0, total: 0 },
      sem_cartao: { matheus: 0, alessandra: 0, outros: 0, total: 0 },
    },
  });
  const [filtroPessoa, setFiltroPessoa] = useState<'todos' | 'matheus' | 'alessandra' | 'outros'>('todos');
  const [abaAtiva, setAbaAtiva] = useState<'transacoes' | 'historico' | 'parcelas' | 'config'>('transacoes');

  const carregarDados = async () => {
    const dados = await carregarTransacoes();
    const rendaMensal = await carregarRenda();
    setTransacoes(dados);
    const resumoCalculado = calcularResumo(dados, rendaMensal);
    setResumo(resumoCalculado);
  };

  useEffect(() => {
    carregarDados();
    
    // Recarregar dados quando a página ganha foco (útil para sincronização entre dispositivos)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        carregarDados();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleRendaChange = async (renda?: number) => {
    const rendaAtual = renda !== undefined ? renda : await carregarRenda();
    const resumoCalculado = calcularResumo(transacoes, rendaAtual);
    setResumo(resumoCalculado);
  };

  const adicionarTransacao = async (transacao: Omit<Transacao, 'id' | 'createdAt'>) => {
    try {
      // Criar transação no Google Sheets via API
      const novaTransacao = await createTransacao(transacao);
      
      // Adicionar à lista local e atualizar resumo
      const novasTransacoes = [...transacoes, novaTransacao].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setTransacoes(novasTransacoes);
      const rendaMensal = await carregarRenda();
      const resumoCalculado = calcularResumo(novasTransacoes, rendaMensal);
      setResumo(resumoCalculado);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      // Em caso de erro, ainda atualizar localmente
      const novaTransacao: Transacao = {
        ...transacao,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      const novasTransacoes = [...transacoes, novaTransacao].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setTransacoes(novasTransacoes);
      const rendaMensal = await carregarRenda();
      const resumoCalculado = calcularResumo(novasTransacoes, rendaMensal);
      setResumo(resumoCalculado);
    }
  };

  const removerTransacao = async (id: string) => {
    // Remover localmente (Google Sheets não suporta delete facilmente via API simples)
    // Para implementar delete, seria necessário usar batchUpdate ou manter um índice
    // Por enquanto, apenas removemos localmente
    const novasTransacoes = transacoes.filter(t => t.id !== id);
    setTransacoes(novasTransacoes);
    const rendaMensal = await carregarRenda();
    const resumoCalculado = calcularResumo(novasTransacoes, rendaMensal);
    setResumo(resumoCalculado);
    
    // Salvar no localStorage como backup
    try {
      localStorage.setItem('controle-financeiro-transacoes', JSON.stringify(novasTransacoes));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  };

  const transacoesFiltradas = filtroPessoa === 'todos' 
    ? transacoes 
    : transacoes.filter(t => t.pessoa === filtroPessoa);

  const parcelasFuturas = calcularParcelasFuturas(transacoes);

  return (
    <div className="min-h-screen pb-8">
      <header className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-3 rounded-xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Meu Controle Financeiro</h1>
                <p className="text-slate-600 text-sm mt-1">Separação de gastos do cartão compartilhado</p>
              </div>
            </div>
            <button
              onClick={carregarDados}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              title="Atualizar dados do servidor"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Dashboard resumo={resumo} onRendaChange={handleRendaChange} transacoes={transacoes} />
        
        <div className="mt-8">
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setAbaAtiva('transacoes')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                abaAtiva === 'transacoes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Transações
            </button>
            <button
              onClick={() => setAbaAtiva('parcelas')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 relative ${
                abaAtiva === 'parcelas'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Parcelas Pendentes
              {parcelasFuturas.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {parcelasFuturas.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAbaAtiva('historico')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                abaAtiva === 'historico'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Histórico Completo
            </button>
            <button
              onClick={() => setAbaAtiva('config')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                abaAtiva === 'config'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Configurações
            </button>
          </div>

          {abaAtiva === 'transacoes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Transações</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFiltroPessoa('todos')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          filtroPessoa === 'todos'
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => setFiltroPessoa('matheus')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          filtroPessoa === 'matheus'
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Matheus
                      </button>
                      <button
                        onClick={() => setFiltroPessoa('alessandra')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          filtroPessoa === 'alessandra'
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Alessandra
                      </button>
                      <button
                        onClick={() => setFiltroPessoa('outros')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          filtroPessoa === 'outros'
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Outros
                      </button>
                    </div>
                  </div>
                  <ListaTransacoes 
                    transacoes={transacoesFiltradas} 
                    onRemover={removerTransacao}
                  />
                </div>
              </div>

              <div>
                <FormularioTransacao onAdicionar={adicionarTransacao} />
              </div>
            </div>
          )}

          {abaAtiva === 'parcelas' && (
            <ParcelasPendentes parcelas={parcelasFuturas} />
          )}

          {abaAtiva === 'historico' && (
            <Historico transacoes={transacoes} />
          )}

          {abaAtiva === 'config' && (
            <ConfigCartoes />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
