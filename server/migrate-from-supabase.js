/**
 * Script de migração opcional para migrar dados do Supabase para Google Sheets
 * 
 * USO:
 * 1. Configure as variáveis de ambiente no .env
 * 2. Configure as credenciais do Supabase temporariamente
 * 3. Execute: node server/migrate-from-supabase.js
 * 4. Desative este script após a migração
 */

import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Configuração do Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || 'Transacoes';

// Configuração do Supabase (temporária)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Converter transação do Supabase para formato do Sheets
function transacaoToRow(transacao) {
  const parcela = transacao.parcelado && transacao.parcela_atual && transacao.numero_parcelas
    ? `${transacao.parcela_atual}/${transacao.numero_parcelas}`
    : '';
  
  const observacao = [
    transacao.nome_outros ? `Nome: ${transacao.nome_outros}` : '',
    transacao.recorrente ? 'Recorrente' : '',
    transacao.tipo_despesa_sem_cartao ? `Tipo: ${transacao.tipo_despesa_sem_cartao}` : '',
  ].filter(Boolean).join(' | ') || '';

  const valor = parseFloat(transacao.valor);
  const tipo = valor >= 0 ? 'Entrada' : 'Saída';

  return [
    transacao.id,
    transacao.data,
    transacao.descricao,
    transacao.categoria,
    tipo,
    Math.abs(valor).toString(),
    transacao.pessoa,
    transacao.cartao || 'nubank',
    parcela,
    observacao,
    transacao.created_at ? new Date(transacao.created_at).toISOString() : new Date().toISOString(),
  ];
}

async function migrate() {
  try {
    console.log('🔄 Iniciando migração do Supabase para Google Sheets...\n');

    // 1. Carregar transações do Supabase
    console.log('📥 Carregando transações do Supabase...');
    const { data: transacoes, error } = await supabase
      .from('transacoes')
      .select('*')
      .order('data', { ascending: false });

    if (error) {
      throw error;
    }

    if (!transacoes || transacoes.length === 0) {
      console.log('ℹ️  Nenhuma transação encontrada no Supabase.');
      return;
    }

    console.log(`✅ ${transacoes.length} transações encontradas\n`);

    // 2. Verificar se já existem dados no Sheets
    console.log('📊 Verificando dados existentes no Google Sheets...');
    const existingResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TAB}!A2:A`,
    });

    const existingIds = new Set(
      (existingResponse.data.values || [])
        .map(row => row[0])
        .filter(Boolean)
    );

    // Filtrar apenas transações novas
    const transacoesNovas = transacoes.filter(t => !existingIds.has(t.id));
    
    if (transacoesNovas.length === 0) {
      console.log('ℹ️  Todas as transações já foram migradas.');
      return;
    }

    console.log(`📝 ${transacoesNovas.length} transações novas para migrar\n`);

    // 3. Preparar cabeçalho se necessário
    const headerRange = `${SHEET_TAB}!A1:K1`;
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: headerRange,
    });

    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      console.log('📋 Criando cabeçalho na planilha...');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: headerRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[
            'ID',
            'Data',
            'Descrição',
            'Categoria',
            'Tipo',
            'Valor',
            'Pessoa',
            'Cartão',
            'Parcela',
            'Observação',
            'CreatedAt'
          ]],
        },
      });
    }

    // 4. Migrar em lotes (Google Sheets tem limite de 10000 células por request)
    const BATCH_SIZE = 100;
    let migrated = 0;

    console.log('💾 Migrando transações...\n');

    for (let i = 0; i < transacoesNovas.length; i += BATCH_SIZE) {
      const batch = transacoesNovas.slice(i, i + BATCH_SIZE);
      const rows = batch.map(transacaoToRow);

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_TAB}!A:K`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: rows,
        },
      });

      migrated += batch.length;
      console.log(`✅ ${migrated}/${transacoesNovas.length} transações migradas...`);
    }

    console.log(`\n🎉 Migração concluída! ${migrated} transações migradas com sucesso.`);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrate();
