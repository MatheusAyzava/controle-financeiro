import { useState } from 'react';
import { Transacao, Pessoa, Cartao } from '../types';
import { Plus } from 'lucide-react';

interface FormularioTransacaoProps {
  onAdicionar: (transacao: Omit<Transacao, 'id' | 'createdAt'>) => void;
}

const categorias = [
  'Alimentação',
  'Transporte',
  'Compras',
  'Farmácia',
  'Contas',
  'Lazer',
  'Outros',
];

const cartoes: Cartao[] = [
  'nubank',
  'banco do brasil',
  'c6',
  'ame',
  'itau',
  'atacadão',
  'carrefour',
];

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

export default function FormularioTransacao({ onAdicionar }: FormularioTransacaoProps) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [pessoa, setPessoa] = useState<Pessoa>('matheus');
  const [cartao, setCartao] = useState<Cartao>('nubank');
  const [categoria, setCategoria] = useState(categorias[0]);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [parcelado, setParcelado] = useState(false);
  const [numeroParcelas, setNumeroParcelas] = useState(1);
  const [parcelaAtual, setParcelaAtual] = useState(1);
  const [nomeOutros, setNomeOutros] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao.trim() || !valor) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    if (parcelado && (numeroParcelas < 1 || parcelaAtual < 1 || parcelaAtual > numeroParcelas)) {
      alert('Por favor, verifique os dados das parcelas');
      return;
    }

    if (pessoa === 'outros' && !nomeOutros.trim()) {
      alert('Por favor, informe o nome para "Outros"');
      return;
    }

    const valorParcela = parcelado ? valorNumerico : valorNumerico;
    const valorTotal = parcelado ? valorNumerico * numeroParcelas : valorNumerico;

    onAdicionar({
      descricao: descricao.trim(),
      valor: valorParcela, // Valor da parcela atual
      pessoa,
      cartao,
      categoria,
      data,
      parcelado,
      numeroParcelas: parcelado ? numeroParcelas : undefined,
      parcelaAtual: parcelado ? parcelaAtual : undefined,
      valorParcela: parcelado ? valorParcela : undefined,
      valorTotal: parcelado ? valorTotal : undefined,
      nomeOutros: pessoa === 'outros' ? nomeOutros.trim() : undefined,
    });

    // Reset form
    setDescricao('');
    setValor('');
    setPessoa('matheus');
    setCartao('nubank');
    setCategoria(categorias[0]);
        setData(new Date().toISOString().split('T')[0]);
        setParcelado(false);
        setNumeroParcelas(1);
        setParcelaAtual(1);
        setNomeOutros('');
      };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Nova Transação</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descrição
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Supermercado, Farmácia..."
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Valor (R$)
          </label>
          <input
            type="text"
            value={valor}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d,.-]/g, '');
              setValor(value);
            }}
            placeholder="0,00"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Quem pagou?
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPessoa('matheus')}
              className={`p-4 rounded-lg border-2 transition-all font-medium ${
                pessoa === 'matheus'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-primary-300'
              }`}
            >
              Matheus
            </button>
            <button
              type="button"
              onClick={() => setPessoa('alessandra')}
              className={`p-4 rounded-lg border-2 transition-all font-medium ${
                pessoa === 'alessandra'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-purple-300'
              }`}
            >
              Alessandra
            </button>
            <button
              type="button"
              onClick={() => setPessoa('outros')}
              className={`p-4 rounded-lg border-2 transition-all font-medium ${
                pessoa === 'outros'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-orange-300'
              }`}
            >
              Outros
            </button>
          </div>
          {pessoa === 'outros' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={nomeOutros}
                onChange={(e) => setNomeOutros(e.target.value)}
                placeholder="Digite o nome..."
                className="input-field"
                required
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cartão
          </label>
          <select
            value={cartao}
            onChange={(e) => setCartao(e.target.value as Cartao)}
            className="input-field"
          >
            {cartoes.map((cart) => (
              <option key={cart} value={cart}>
                {formatarNomeCartao(cart)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input-field"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Data
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={parcelado}
              onChange={(e) => setParcelado(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-slate-700">Compra parcelada</span>
          </label>
        </div>

        {parcelado && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Número de Parcelas
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={numeroParcelas}
                onChange={(e) => {
                  const num = parseInt(e.target.value) || 1;
                  setNumeroParcelas(Math.max(1, Math.min(24, num)));
                  if (parcelaAtual > num) setParcelaAtual(num);
                }}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Parcela Atual
              </label>
              <input
                type="number"
                min="1"
                max={numeroParcelas}
                value={parcelaAtual}
                onChange={(e) => {
                  const num = parseInt(e.target.value) || 1;
                  setParcelaAtual(Math.max(1, Math.min(numeroParcelas, num)));
                }}
                className="input-field"
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Valor da parcela:</strong> {valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(valor.replace(',', '.')) || 0) : 'R$ 0,00'}
              </p>
              <p className="text-xs text-blue-800 mt-1">
                <strong>Valor total:</strong> {valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((parseFloat(valor.replace(',', '.')) || 0) * numeroParcelas) : 'R$ 0,00'} ({numeroParcelas}x)
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
        >
          <Plus className="w-5 h-5" />
          Adicionar Transação
        </button>
      </form>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Dica:</strong> Adicione as transações assim que usar o cartão para manter o controle sempre atualizado!
        </p>
      </div>
    </div>
  );
}
