-- Tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  pessoa TEXT NOT NULL CHECK (pessoa IN ('matheus', 'alessandra', 'outros')),
  cartao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  data DATE NOT NULL,
  created_at BIGINT NOT NULL,
  parcelado BOOLEAN DEFAULT FALSE,
  numero_parcelas INTEGER,
  parcela_atual INTEGER,
  valor_parcela NUMERIC,
  valor_total NUMERIC,
  nome_outros TEXT,
  created_at_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de renda mensal
CREATE TABLE IF NOT EXISTS renda (
  user_id TEXT PRIMARY KEY,
  valor NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data DESC);
CREATE INDEX IF NOT EXISTS idx_transacoes_pessoa ON transacoes(pessoa);

-- Política RLS (Row Level Security) - permitir todas as operações para este app simples
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE renda ENABLE ROW LEVEL SECURITY;

-- Política para transações
CREATE POLICY "Permitir todas as operações em transacoes" ON transacoes
  FOR ALL USING (true) WITH CHECK (true);

-- Política para renda
CREATE POLICY "Permitir todas as operações em renda" ON renda
  FOR ALL USING (true) WITH CHECK (true);
