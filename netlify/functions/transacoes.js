// Netlify Functions usa CommonJS, mesmo que o projeto seja ESM
let google, uuidv4;

try {
  google = require('googleapis');
  uuidv4 = require('uuid').v4;
} catch (error) {
  console.error('Erro ao carregar dependências:', error);
  // Fallback caso as dependências não estejam disponíveis
}

// Handler para GET /api/transacoes
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Definir variáveis no escopo externo para que estejam disponíveis no catch
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
  const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || 'Transacoes';

  try {
    // Validar variáveis de ambiente primeiro
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Variáveis de ambiente não configuradas',
          details: 'Verifique: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID',
          missing: [
            !process.env.GOOGLE_CLIENT_EMAIL && 'GOOGLE_CLIENT_EMAIL',
            !process.env.GOOGLE_PRIVATE_KEY && 'GOOGLE_PRIVATE_KEY',
            !SPREADSHEET_ID && 'GOOGLE_SHEET_ID',
          ].filter(Boolean)
        }),
      };
    }
    
    // Configuração do Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // GET - Carregar transações
    if (event.httpMethod === 'GET') {
      // Primeiro, verificar se a planilha existe e está acessível
      try {
        const spreadsheetInfo = await sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID,
        });
        
        // Verificar se a aba existe
        const sheetExists = spreadsheetInfo.data.sheets?.some(
          sheet => sheet.properties.title === SHEET_TAB
        );
        
        if (!sheetExists) {
          const availableSheets = spreadsheetInfo.data.sheets?.map(s => s.properties.title).join(', ') || 'nenhuma';
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ 
              error: 'Aba não encontrada',
              details: `A aba "${SHEET_TAB}" não existe na planilha. Abas disponíveis: ${availableSheets}`,
              availableSheets: spreadsheetInfo.data.sheets?.map(s => s.properties.title) || []
            }),
          };
        }
      } catch (infoError) {
        if (infoError.message?.includes('not found') || infoError.message?.includes('NOT_FOUND')) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ 
              error: 'Planilha não encontrada',
              details: `A planilha com ID "${SPREADSHEET_ID}" não foi encontrada. Verifique se o ID está correto e se a planilha está compartilhada com a service account.`
            }),
          };
        }
        if (infoError.message?.includes('permission') || infoError.message?.includes('PERMISSION_DENIED')) {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ 
              error: 'Sem permissão',
              details: `A service account não tem permissão para acessar a planilha. Compartilhe a planilha com: ${process.env.GOOGLE_CLIENT_EMAIL}`
            }),
          };
        }
        // Se for outro erro, continuar e tentar ler mesmo assim
        console.warn('Aviso ao verificar planilha:', infoError.message);
      }
      
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
      let payload;
      try {
        payload = JSON.parse(event.body || '{}');
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'JSON inválido',
            details: 'O corpo da requisição não é um JSON válido',
            body: event.body
          }),
        };
      }

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
        id: payload.id || (uuidv4 ? uuidv4() : Date.now().toString()),
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
    console.error('Erro na função:', error);
    console.error('Stack:', error.stack);
    console.error('Event:', JSON.stringify(event, null, 2));
    
    // Retornar mensagem de erro mais detalhada
    let errorMessage = 'Erro interno do servidor';
    let errorDetails = error.message || 'Erro desconhecido';
    let statusCode = 500;
    
    // Verificar se é erro de autenticação
    if (error.message?.includes('credentials') || error.message?.includes('authentication') || error.message?.includes('invalid_grant')) {
      errorMessage = 'Erro de autenticação com Google Sheets';
      errorDetails = 'Verifique as credenciais da service account (GOOGLE_CLIENT_EMAIL e GOOGLE_PRIVATE_KEY)';
      statusCode = 401;
    }
    
    // Verificar se é erro de permissão
    if (error.message?.includes('permission') || error.message?.includes('PERMISSION_DENIED')) {
      errorMessage = 'Erro de permissão';
      errorDetails = `A service account não tem permissão para acessar a planilha. Compartilhe a planilha com: ${process.env.GOOGLE_CLIENT_EMAIL}`;
      statusCode = 403;
    }
    
    // Verificar se é erro de planilha não encontrada
    if (error.message?.includes('not found') || error.message?.includes('NOT_FOUND') || error.message?.includes('Unable to parse range')) {
      errorMessage = 'Planilha ou aba não encontrada';
      errorDetails = `Verifique se o GOOGLE_SHEET_ID está correto e se a aba "${process.env.GOOGLE_SHEET_TAB || 'Transacoes'}" existe`;
      statusCode = 404;
    }
    
    // Verificar se é erro de operação não suportada (geralmente aba não existe)
    if (error.message?.includes('not supported') || error.message?.includes('This operation is not supported')) {
      errorMessage = 'Operação não suportada';
      errorDetails = `A aba "${process.env.GOOGLE_SHEET_TAB || 'Transacoes'}" pode não existir. Verifique o nome da aba na planilha e configure GOOGLE_SHEET_TAB corretamente`;
      statusCode = 400;
    }
    
    // Garantir que sempre retornamos uma resposta válida
    try {
      return {
        statusCode,
        headers,
        body: JSON.stringify({ 
          error: errorMessage, 
          details: errorDetails,
          message: error.message,
          sheetId: process.env.GOOGLE_SHEET_ID,
          sheetTab: process.env.GOOGLE_SHEET_TAB || 'Transacoes',
        }),
      };
    } catch (jsonError) {
      // Se até o JSON.stringify falhar, retornar resposta simples
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: `Erro crítico: ${errorMessage} - ${errorDetails}`,
      };
    }
  }
};
