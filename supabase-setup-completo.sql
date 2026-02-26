-- ============================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO SUPABASE
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- PASSO 1: Desabilitar RLS temporariamente
ALTER TABLE IF EXISTS transacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS renda DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Deletar políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir todas as operações em transacoes" ON transacoes;
DROP POLICY IF EXISTS "Permitir todas as operações em renda" ON renda;

-- PASSO 3: Criar tabela de transações
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
  recorrente BOOLEAN DEFAULT FALSE,
  tipo_despesa_sem_cartao TEXT,
  created_at_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 4: Criar tabela de renda
CREATE TABLE IF NOT EXISTS renda (
  user_id TEXT PRIMARY KEY,
  valor NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 5: Criar índices
CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data DESC);
CREATE INDEX IF NOT EXISTS idx_transacoes_pessoa ON transacoes(pessoa);

-- PASSO 6: Habilitar RLS
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE renda ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Criar políticas RLS permissivas
CREATE POLICY "Permitir todas as operações em transacoes" 
ON transacoes
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir todas as operações em renda" 
ON renda
FOR ALL 
USING (true) 
WITH CHECK (true);

-- PASSO 8: Verificar se tudo foi criado corretamente
SELECT 
  'Tabelas criadas:' as info,
  COUNT(*) as total
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('transacoes', 'renda');

SELECT 
  'Políticas RLS:' as info,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename IN ('transacoes', 'renda');
