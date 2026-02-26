-- Script SQL para corrigir problemas de RLS e criar tabelas
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar RLS temporariamente para recriar as políticas
ALTER TABLE IF EXISTS transacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS renda DISABLE ROW LEVEL SECURITY;

-- 2. Deletar políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir todas as operações em transacoes" ON transacoes;
DROP POLICY IF EXISTS "Permitir todas as operações em renda" ON renda;

-- 3. Criar tabela de transações se não existir
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

-- 4. Criar tabela de renda se não existir
CREATE TABLE IF NOT EXISTS renda (
  user_id TEXT PRIMARY KEY,
  valor NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar índices
CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data DESC);
CREATE INDEX IF NOT EXISTS idx_transacoes_pessoa ON transacoes(pessoa);

-- 6. Habilitar RLS
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE renda ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas RLS permissivas
CREATE POLICY "Permitir todas as operações em transacoes" ON transacoes
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir todas as operações em renda" ON renda
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 8. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('transacoes', 'renda');
