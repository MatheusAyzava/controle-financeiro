const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

// Handler para GET /api/transacoes
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
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

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Variáveis de ambiente não configuradas' }),
      };
    }

    // GET - Carregar transações
    if (event.httpMethod === 'GET') {
      const range = `${SHEET_TAB}!A2:K`;
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
      });

      const rows = response.data.values || [];
      
      // Converter linhas para objetos Transacao
      const transacoes = rows
        .filter(row => row.length > 0 && row[0])
        .map(row => {
          const id = row[0] || '';
          const data = row[1] || '';
          const descricao = row[2] || '';
          const categoria = row[3] || '';
          const tipo = row[4] || '';
          const valor = parseFloat(row[5]) || 0;
          const pessoa = row[6] || '';
          const cartao = row[7] || '';
          const parcela = row[8] || '';
          const observacao = row[9] || '';
          const createdAt = row[10] || '';
          
          // Converter de volta para o formato do app
          const valorFinal = tipo === 'Saída' ? -Math.abs(valor) : Math.abs(valor);
          
          // Parsear parcela
          let parcelado = false;
          let numeroParcelas = undefined;
          let parcelaAtual = undefined;
          
          if (parcela) {
            const match = parcela.match(/(\d+)\/(\d+)/);
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
          
          if (observacao) {
            if (observacao.includes('Recorrente')) {
              recorrente = true;
            }
            const nomeMatch = observacao.match(/Nome: ([^|]+)/);
            if (nomeMatch) {
              nomeOutros = nomeMatch[1].trim();
            }
            const tipoMatch = observacao.match(/Tipo: ([^|]+)/);
            if (tipoMatch) {
              tipoDespesaSemCartao = tipoMatch[1].trim();
            }
          }
          
          return {
            id,
            descricao,
            valor: valorFinal,
            pessoa,
            cartao,
            categoria,
            data,
            createdAt: createdAt ? new Date(createdAt).getTime() : Date.now(),
            parcelado,
            numeroParcelas,
            parcelaAtual,
            valorParcela: undefined,
            valorTotal: undefined,
            nomeOutros,
            recorrente,
            tipoDespesaSemCartao,
          };
        });

      // Ordenar por data (mais recente primeiro)
      transacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(transacoes),
      };
    }

    // POST - Criar transação
    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body);

      // Validação básica
      if (!payload.descricao || !payload.data || payload.valor === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Campos obrigatórios: descricao, data, valor' }),
        };
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
      const parcela = novaTransacao.parcelado && novaTransacao.parcelaAtual && novaTransacao.numeroParcelas
        ? `${novaTransacao.parcelaAtual}/${novaTransacao.numeroParcelas}`
        : '';
      
      const observacao = [
        novaTransacao.nomeOutros ? `Nome: ${novaTransacao.nomeOutros}` : '',
        novaTransacao.recorrente ? 'Recorrente' : '',
        novaTransacao.tipoDespesaSemCartao ? `Tipo: ${novaTransacao.tipoDespesaSemCartao}` : '',
      ].filter(Boolean).join(' | ') || '';

      const tipo = novaTransacao.valor >= 0 ? 'Entrada' : 'Saída';

      const row = [
        novaTransacao.id,
        novaTransacao.data,
        novaTransacao.descricao,
        novaTransacao.categoria,
        tipo,
        Math.abs(novaTransacao.valor).toString(),
        novaTransacao.pessoa,
        novaTransacao.cartao,
        parcela,
        observacao,
        new Date(novaTransacao.createdAt).toISOString(),
      ];

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

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(novaTransacao),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno', details: error.message }),
    };
  }
};
