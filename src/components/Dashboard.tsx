import { ResumoFinanceiro } from '../types';
import { formatarMoeda } from '../utils/formatacao';
import { TrendingUp, User, Users, Receipt, AlertCircle, TrendingDown, Calendar, Eye, EyeOff } from 'lucide-react';
import RendaMensal from './RendaMensal';
import MaioresGastos from './MaioresGastos';
import GastosPorCartao from './GastosPorCartao';
import { useVisibility } from '../contexts/VisibilityContext';

interface DashboardProps {
  resumo: ResumoFinanceiro;
  onRendaChange: (renda?: number) => void;
}

export default function Dashboard({ resumo, onRendaChange }: DashboardProps) {
  const { valoresVisiveis, toggleValores } = useVisibility();
  const porcentagemMatheus = resumo.totalGeral > 0 
    ? (resumo.totalMatheus / resumo.totalGeral) * 100 
    : 0;
  const porcentagemAlessandra = resumo.totalGeral > 0 
    ? (resumo.totalAlessandra / resumo.totalGeral) * 100 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={toggleValores}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-primary-500 rounded-lg transition-all duration-200 text-slate-700 font-semibold shadow-sm hover:shadow-md"
          title={valoresVisiveis ? 'Ocultar valores' : 'Mostrar valores'}
        >
          {valoresVisiveis ? (
            <>
              <Eye className="w-5 h-5 text-slate-600" />
              <span>Ocultar Valores</span>
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5 text-slate-600" />
              <span>Mostrar Valores</span>
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-gradient bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 before:bg-white flex flex-col min-h-[160px]">
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-xl shadow-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse mt-1"></div>
              </div>
              <p className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Total Geral</p>
              <p className="text-3xl font-extrabold mb-3 drop-shadow-lg leading-tight">{formatarMoeda(resumo.totalGeral, !valoresVisiveis)}</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="h-1 w-10 bg-white/30 rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <span className="text-white/80 text-xs">Total acumulado</span>
            </div>
          </div>
        </div>

        <div className="card-gradient bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 before:bg-white flex flex-col min-h-[160px]">
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-xl shadow-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="w-3 h-3 mt-1"></div>
              </div>
              <p className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Gastos do Matheus</p>
              <p className="text-3xl font-extrabold mb-3 drop-shadow-lg leading-tight">{formatarMoeda(resumo.totalMatheus, !valoresVisiveis)}</p>
            </div>
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/80 text-xs">Percentual</span>
                <span className="text-white font-semibold text-xs">{porcentagemMatheus.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-white rounded-full shadow-lg transition-all duration-1000"
                  style={{ width: `${porcentagemMatheus}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-gradient bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 before:bg-white flex flex-col min-h-[160px]">
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-xl shadow-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="w-3 h-3 mt-1"></div>
              </div>
              <p className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Gastos da Alessandra</p>
              <p className="text-3xl font-extrabold mb-3 drop-shadow-lg leading-tight">{formatarMoeda(resumo.totalAlessandra, !valoresVisiveis)}</p>
            </div>
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/80 text-xs">Percentual</span>
                <span className="text-white font-semibold text-xs">{porcentagemAlessandra.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-white rounded-full shadow-lg transition-all duration-1000"
                  style={{ width: `${porcentagemAlessandra}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-gradient bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 before:bg-white flex flex-col min-h-[160px]">
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-white/25 backdrop-blur-sm p-2.5 rounded-xl shadow-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="w-3 h-3 mt-1"></div>
              </div>
              <p className="text-white/90 text-xs font-medium mb-1.5 uppercase tracking-wide">Transações</p>
              <p className="text-3xl font-extrabold mb-3 drop-shadow-lg leading-tight">{resumo.quantidadeTransacoes}</p>
            </div>
            <div className="pt-1">
              <span className="text-white/80 text-xs">registros cadastrados</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {resumo.totalGeral > 0 && (
            <div className="card bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Distribuição de Gastos</h3>
                  <p className="text-sm text-slate-500">Comparativo entre pessoas</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary-500 shadow-md flex-shrink-0"></div>
                      <span className="font-semibold text-slate-800">Matheus</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{formatarMoeda(resumo.totalMatheus, !valoresVisiveis)}</p>
                      <p className="text-xs text-slate-500">{porcentagemMatheus.toFixed(1)}% do total</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg"
                      style={{ width: `${porcentagemMatheus}%` }}
                    >
                      <div className="h-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500 shadow-md flex-shrink-0"></div>
                      <span className="font-semibold text-slate-800">Alessandra</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{formatarMoeda(resumo.totalAlessandra, !valoresVisiveis)}</p>
                      <p className="text-xs text-slate-500">{porcentagemAlessandra.toFixed(1)}% do total</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg"
                      style={{ width: `${porcentagemAlessandra}%` }}
                    >
                      <div className="h-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <RendaMensal onRendaChange={onRendaChange} />
          
          {resumo.rendaMensal > 0 && (
            <div className={`card border-2 shadow-xl transition-all duration-300 hover:scale-105 ${
              resumo.saldoDisponivel >= 0 
                ? 'bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 border-emerald-300' 
                : 'bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl shadow-lg flex-shrink-0 ${
                  resumo.saldoDisponivel >= 0 
                    ? 'bg-emerald-500' 
                    : 'bg-red-500'
                }`}>
                  {resumo.saldoDisponivel >= 0 ? (
                    <TrendingDown className="w-6 h-6 text-white" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-lg">Saldo Disponível</h3>
                  <p className="text-xs text-slate-500">Renda - Gastos</p>
                </div>
              </div>
              <p className={`text-3xl font-extrabold mb-2 ${
                resumo.saldoDisponivel >= 0 ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {formatarMoeda(resumo.saldoDisponivel, !valoresVisiveis)}
              </p>
              <div className={`mt-3 p-3 rounded-lg ${
                resumo.saldoDisponivel >= 0 
                  ? 'bg-emerald-100/50' 
                  : 'bg-red-100/50'
              }`}>
                <p className={`text-sm font-medium ${
                  resumo.saldoDisponivel >= 0 ? 'text-emerald-800' : 'text-red-800'
                }`}>
                  {resumo.saldoDisponivel >= 0 
                    ? '✓ Você ainda pode gastar este valor' 
                    : '⚠ Atenção! Você ultrapassou sua renda mensal'}
                </p>
              </div>
            </div>
          )}

          {resumo.totalParcelasFuturas > 0 && (
            <div className="card bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 border-2 border-orange-300 shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-lg">Parcelas Futuras</h3>
                  <p className="text-xs text-slate-500">A pagar</p>
                </div>
              </div>
              <p className="text-3xl font-extrabold text-orange-700 mb-2">
                {formatarMoeda(resumo.totalParcelasFuturas, !valoresVisiveis)}
              </p>
              <div className="mt-3 p-3 bg-orange-100/50 rounded-lg">
                <p className="text-sm font-medium text-orange-800">
                  Valor total que ainda será gasto em parcelas pendentes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {resumo.maioresGastos.length > 0 && (
        <MaioresGastos gastos={resumo.maioresGastos} />
      )}

      <GastosPorCartao gastosPorCartao={resumo.gastosPorCartao} />
    </div>
  );
}
