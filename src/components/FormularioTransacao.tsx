import { useState } from 'react';
import { Transacao, Pessoa, Cartao } from '../types';
import { calcularMesFatura, carregarConfiguracoesCartoes, formatarMesFatura } from '../utils/fatura';
import { Plus, Info } from 'lucide-react';

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
  'sem_cartao',
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
    'sem_cartao': 'Sem Cartão (Dinheiro/PIX/Transferência)',
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
  const [recorrente, setRecorrente] = useState(false);
  const [tipoDespesaSemCartao, setTipoDespesaSemCartao] = useState('');

  // Calcular qual mês de fatura esta transação vai contar (apenas se for cartão)
  const configs = carregarConfiguracoesCartoes();
  const configCartao = configs.find(c => c.cartao === cartao);
  const diaFechamento = configCartao?.diaFechamento || 10;
  const mesFatura = cartao !== 'sem_cartao' ? calcularMesFatura(data, diaFechamento, cartao) : '';
  const mesFaturaFormatado = mesFatura ? formatarMesFatura(mesFatura) : '';

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
      recorrente: recorrente || undefined,
      tipoDespesaSemCartao: cartao === 'sem_cartao' ? tipoDespesaSemCartao.trim() || undefined : undefined,
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
        setRecorrente(false);
        setTipoDespesaSemCartao('');
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
          {configCartao && cartao !== 'sem_cartao' && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-blue-800">
                  <strong>Mês de fatura:</strong> Esta transação contará para <strong>{mesFaturaFormatado}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  (Fatura fecha dia {diaFechamento.toString().padStart(2, '0')})
                </p>
              </div>
            </div>
          )}
          {cartao === 'sem_cartao' && (
            <>
              <div className="mt-3">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Despesa
                </label>
                <select
                  value={tipoDespesaSemCartao}
                  onChange={(e) => setTipoDespesaSemCartao(e.target.value)}
                  className="input-field"
                >
                  <option value="">Selecione o tipo...</option>
                  <option value="aluguel">🏠 Aluguel</option>
                  <option value="conta_luz">💡 Conta de Luz</option>
                  <option value="conta_agua">💧 Conta de Água</option>
                  <option value="internet">📶 Internet/TV/Telefone</option>
                  <option value="supermercado">🛒 Supermercado (Dinheiro/PIX)</option>
                  <option value="farmacia">💊 Farmácia (Dinheiro/PIX)</option>
                  <option value="combustivel">⛽ Combustível (Dinheiro/PIX)</option>
                  <option value="transferencia">💸 Transferência/PIX</option>
                  <option value="dinheiro">💵 Pagamento em Dinheiro</option>
                  <option value="outros">📋 Outros</option>
                </select>
              </div>
              <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-700">
                    <strong>Despesa sem cartão:</strong> Esta transação será contabilizada no mês da data informada.
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Selecione o tipo de despesa acima para melhor organização.
                  </p>
                </div>
              </div>
            </>
          )}
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

        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <input
            type="checkbox"
            id="recorrente"
            checked={recorrente}
            onChange={(e) => setRecorrente(e.target.checked)}
            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="recorrente" className="text-sm font-medium text-slate-700 cursor-pointer flex-1 flex items-center gap-2">
            <span>Conta recorrente (todo mês)</span>
            {recorrente && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                ✓ Recorrente
              </span>
            )}
          </label>
        </div>

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
