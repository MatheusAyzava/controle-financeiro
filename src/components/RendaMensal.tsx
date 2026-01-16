import { useState, useEffect } from 'react';
import { formatarMoeda } from '../utils/formatacao';
import { salvarRenda, carregarRenda } from '../utils/renda';
import { useVisibility } from '../contexts/VisibilityContext';
import { DollarSign, Edit2 } from 'lucide-react';

interface RendaMensalProps {
  onRendaChange: (renda?: number) => void;
}

export default function RendaMensal({ onRendaChange }: RendaMensalProps) {
  const { valoresVisiveis } = useVisibility();
  const [renda, setRenda] = useState<number>(0);
  const [editando, setEditando] = useState(false);
  const [valorInput, setValorInput] = useState('');

  useEffect(() => {
    const carregar = async () => {
      const rendaCarregada = await carregarRenda();
      setRenda(rendaCarregada);
      setValorInput(rendaCarregada > 0 ? rendaCarregada.toString().replace('.', ',') : '');
      onRendaChange(rendaCarregada);
    };
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSalvar = async () => {
    const valorNumerico = parseFloat(valorInput.replace(',', '.'));
    if (!isNaN(valorNumerico) && valorNumerico >= 0) {
      setRenda(valorNumerico);
      await salvarRenda(valorNumerico);
      onRendaChange(valorNumerico);
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setValorInput(renda > 0 ? renda.toString().replace('.', ',') : '');
    setEditando(false);
  };

  return (
    <div className="card-gradient bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 before:bg-white">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/25 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>
        <p className="text-white/90 text-sm font-medium mb-2 uppercase tracking-wide">Renda Mensal</p>
        {editando ? (
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={valorInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d,.-]/g, '');
                  setValorInput(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSalvar();
                  if (e.key === 'Escape') handleCancelar();
                }}
                className="px-4 py-3 rounded-xl text-slate-800 font-bold text-lg w-full focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                autoFocus
                placeholder="0,00"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSalvar}
                className="flex-1 px-4 py-2 bg-white/25 hover:bg-white/35 backdrop-blur-sm rounded-lg transition-all duration-200 text-sm font-semibold text-white shadow-lg hover:scale-105"
              >
                ✓ Salvar
              </button>
              <button
                onClick={handleCancelar}
                className="flex-1 px-4 py-2 bg-white/25 hover:bg-white/35 backdrop-blur-sm rounded-lg transition-all duration-200 text-sm font-semibold text-white shadow-lg hover:scale-105"
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-4xl font-extrabold mt-2 mb-4 drop-shadow-lg">
              {renda > 0 ? formatarMoeda(renda, !valoresVisiveis) : 'Não informado'}
            </p>
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/25 hover:bg-white/35 backdrop-blur-sm rounded-lg transition-all duration-200 text-sm font-semibold text-white shadow-lg hover:scale-105"
            >
              <Edit2 className="w-4 h-4" />
              {renda > 0 ? 'Editar Renda' : 'Informar Renda'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
