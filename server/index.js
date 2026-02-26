import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Validar variáveis de ambiente
if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Verifique: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID');
  process.exit(1);
}

// Helper: Converter linha do Sheets para objeto Transacao
function rowToTransacao(row) {
  return {
    id: row[0] || '',
    data: row[1] || '',
    descricao: row[2] || '',
    categoria: row[3] || '',
    tipo: row[4] || '',
    valor: parseFloat(row[5]) || 0,
    pessoa: row[6] || '',
    cartao: row[7] || '',
    parcela: row[8] || '',
    observacao: row[9] || '',
    createdAt: row[10] || '',
  };
}

// Helper: Converter objeto Transacao para linha do Sheets
function transacaoToRow(transacao) {
  // Mapear campos do app para o formato do Sheets
  const parcela = transacao.parcelado && transacao.parcelaAtual && transacao.numeroParcelas
    ? `${transacao.parcelaAtual}/${transacao.numeroParcelas}`
    : '';
  
  const observacao = [
    transacao.nomeOutros ? `Nome: ${transacao.nomeOutros}` : '',
    transacao.recorrente ? 'Recorrente' : '',
    transacao.tipoDespesaSemCartao ? `Tipo: ${transacao.tipoDespesaSemCartao}` : '',
  ].filter(Boolean).join(' | ') || '';

  const tipo = transacao.valor >= 0 ? 'Entrada' : 'Saída';

  return [
    transacao.id,
    transacao.data,
    transacao.descricao,
    transacao.categoria,
    tipo,
    Math.abs(transacao.valor).toString(),
    transacao.pessoa,
    transacao.cartao,
    parcela,
    observacao,
    new Date(transacao.createdAt).toISOString(),
  ];
}

// GET /api/transacoes - Carregar todas as transações
app.get('/api/transacoes', async (req, res) => {
  try {
    const range = `${SHEET_TAB}!A2:K`;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });

    const rows = response.data.values || [];
    
    // Converter linhas para objetos Transacao
    const transacoes = rows
      .filter(row => row.length > 0 && row[0]) // Filtrar linhas vazias
      .map(row => {
        const transacao = rowToTransacao(row);
        
        // Converter de volta para o formato do app
        const valor = transacao.tipo === 'Saída' ? -Math.abs(transacao.valor) : Math.abs(transacao.valor);
        
        // Parsear parcela
        let parcelado = false;
        let numeroParcelas = undefined;
        let parcelaAtual = undefined;
        let valorParcela = undefined;
        let valorTotal = undefined;
        
        if (transacao.parcela) {
          const match = transacao.parcela.match(/(\d+)\/(\d+)/);
          if (match) {
            parcelado = true;
            parcelaAtual = parseInt(match[1]);
            numeroParcelas = parseInt(match[2]);
          }
        }
        
        // Parsear observação
        let nomeOutros = undefined;
        let recorrente = false;
        let tipoDespesaSemCartao = undefined;
        
        if (transacao.observacao) {
          if (transacao.observacao.includes('Recorrente')) {
            recorrente = true;
          }
          const nomeMatch = transacao.observacao.match(/Nome: ([^|]+)/);
          if (nomeMatch) {
            nomeOutros = nomeMatch[1].trim();
          }
          const tipoMatch = transacao.observacao.match(/Tipo: ([^|]+)/);
          if (tipoMatch) {
            tipoDespesaSemCartao = tipoMatch[1].trim();
          }
        }
        
        return {
          id: transacao.id,
          descricao: transacao.descricao,
          valor: valor,
          pessoa: transacao.pessoa,
          cartao: transacao.cartao,
          categoria: transacao.categoria,
          data: transacao.data,
          createdAt: transacao.createdAt ? new Date(transacao.createdAt).getTime() : Date.now(),
          parcelado,
          numeroParcelas,
          parcelaAtual,
          valorParcela,
          valorTotal,
          nomeOutros,
          recorrente,
          tipoDespesaSemCartao,
        };
      });

    // Ordenar por data (mais recente primeiro)
    transacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    res.json(transacoes);
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    res.status(500).json({ error: 'Erro ao carregar transações', details: error.message });
  }
});

// POST /api/transacoes - Criar nova transação
app.post('/api/transacoes', async (req, res) => {
  try {
    const payload = req.body;

    // Validação básica
    if (!payload.descricao || !payload.data || payload.valor === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios: descricao, data, valor' });
    }

    // Gerar ID e createdAt se não fornecidos
    const novaTransacao = {
      id: payload.id || uuidv4(),
      descricao: payload.descricao,
      valor: payload.valor,
      pessoa: payload.pessoa || 'matheus',
      cartao: payload.cartao || 'nubank',
      categoria: payload.categoria || '',
      data: payload.data,
      createdAt: payload.createdAt || Date.now(),
      parcelado: payload.parcelado || false,
      numeroParcelas: payload.numeroParcelas,
      parcelaAtual: payload.parcelaAtual,
      valorParcela: payload.valorParcela,
      valorTotal: payload.valorTotal,
      nomeOutros: payload.nomeOutros,
      recorrente: payload.recorrente || false,
      tipoDespesaSemCartao: payload.tipoDespesaSemCartao,
    };

    // Converter para linha do Sheets
    const row = transacaoToRow(novaTransacao);

    // Fazer append na planilha
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TAB}!A:K`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [row],
      },
    });

    res.status(201).json(novaTransacao);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Planilha: ${SPREADSHEET_ID}`);
  console.log(`📋 Aba: ${SHEET_TAB}`);
});
