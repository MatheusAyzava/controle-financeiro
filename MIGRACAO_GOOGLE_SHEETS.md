# Migração para Google Sheets

Este documento explica como configurar e usar o sistema de armazenamento via Google Sheets.

## 📋 Pré-requisitos

1. **Google Cloud Project** com Google Sheets API habilitada
2. **Service Account** criada no Google Cloud
3. **Arquivo JSON** da service account baixado
4. **Planilha Google Sheets** criada e compartilhada com o email da service account

## 🔧 Configuração

### 1. Criar Service Account no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione um existente
3. Vá em **APIs & Services** > **Library**
4. Procure por **Google Sheets API** e habilite
5. Vá em **APIs & Services** > **Credentials**
6. Clique em **Create Credentials** > **Service Account**
7. Preencha os dados e crie
8. Na service account criada, clique em **Keys** > **Add Key** > **Create new key** > **JSON**
9. Baixe o arquivo JSON (NUNCA commite este arquivo!)

### 2. Criar e Configurar Planilha

1. Crie uma nova planilha no Google Sheets
2. Renomeie a primeira aba para `Transacoes`
3. Adicione o cabeçalho na linha 1:
   ```
   ID | Data | Descrição | Categoria | Tipo | Valor | Pessoa | Cartão | Parcela | Observação | CreatedAt
   ```
4. Compartilhe a planilha com o email da service account (encontrado no JSON: `client_email`)
5. Dê permissão de **Editor** para a service account
6. Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/ID_AQUI/edit
   ```

### 3. Configurar Variáveis de Ambiente

1. Copie `.env.example` para `.env` (se não existir, crie)
2. Abra o arquivo JSON da service account
3. Preencha as variáveis no `.env`:

```env
# Email da service account (do JSON: client_email)
GOOGLE_CLIENT_EMAIL=sheets-contas@projeto.iam.gserviceaccount.com

# Chave privada (do JSON: private_key)
# IMPORTANTE: Mantenha as quebras de linha \n ou substitua por quebras reais
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# ID da planilha (da URL)
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j

# Nome da aba (padrão: Transacoes)
GOOGLE_SHEET_TAB=Transacoes

# Porta do servidor (padrão: 3001)
PORT=3001

# URL da API (usado no frontend)
VITE_API_URL=http://localhost:3001
```

**⚠️ IMPORTANTE:**
- NUNCA commite o arquivo `.env`
- NUNCA commite o arquivo JSON da service account
- A chave privada deve ter `\n` preservados ou substituídos por quebras de linha reais

## 🚀 Instalação e Execução

### Instalar Dependências

```bash
# Instalar dependências do projeto principal e do servidor
npm run install:all
```

Ou manualmente:

```bash
npm install
cd server
npm install
cd ..
```

### Executar Aplicação

```bash
# Inicia frontend (Vite) e backend (Express) simultaneamente
npm run dev
```

O frontend estará em `http://localhost:5174` e o backend em `http://localhost:3001`.

## 📦 Estrutura

```
controle-financeiro/
├── server/
│   ├── index.js              # Servidor Express com Google Sheets API
│   ├── package.json          # Dependências do servidor
│   └── migrate-from-supabase.js  # Script opcional de migração
├── src/
│   ├── services/
│   │   └── transacoesApi.ts  # Cliente API para transações
│   └── ...
├── .env                      # Variáveis de ambiente (NÃO commitar!)
├── .env.example             # Exemplo de configuração
└── package.json             # Dependências principais
```

## 🔄 Migração do Supabase (Opcional)

Se você já tem dados no Supabase e quer migrar:

1. Configure temporariamente as variáveis do Supabase no `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```

2. Execute o script de migração:
   ```bash
   node server/migrate-from-supabase.js
   ```

3. O script irá:
   - Carregar todas as transações do Supabase
   - Verificar quais já existem no Sheets
   - Migrar apenas as novas transações
   - Preservar IDs e dados originais

4. Após a migração, você pode remover as variáveis do Supabase do `.env`

## 🧪 Teste Rápido

1. Inicie o servidor: `npm run dev`
2. Abra o app no navegador: `http://localhost:5174`
3. Cadastre uma nova transação
4. Verifique na planilha Google Sheets que a transação foi adicionada
5. Recarregue a página e confirme que a transação é carregada do Sheets

## 📝 Formato dos Dados

### Planilha Google Sheets

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| A - ID | string | UUID da transação |
| B - Data | date | Data no formato YYYY-MM-DD |
| C - Descrição | string | Descrição da transação |
| D - Categoria | string | Categoria da transação |
| E - Tipo | string | "Entrada" ou "Saída" |
| F - Valor | number | Valor absoluto |
| G - Pessoa | string | "matheus", "alessandra" ou "outros" |
| H - Cartão | string | Nome do cartão |
| I - Parcela | string | Formato "1/3" ou vazio |
| J - Observação | string | Informações adicionais (nomeOutros, recorrente, etc) |
| K - CreatedAt | datetime | ISO string do timestamp |

### Objeto Transacao (App)

```typescript
{
  id: string;
  descricao: string;
  valor: number;  // Negativo para saídas, positivo para entradas
  pessoa: 'matheus' | 'alessandra' | 'outros';
  cartao: string;
  categoria: string;
  data: string;  // YYYY-MM-DD
  createdAt: number;  // Timestamp
  parcelado?: boolean;
  numeroParcelas?: number;
  parcelaAtual?: number;
  valorParcela?: number;
  valorTotal?: number;
  nomeOutros?: string;
  recorrente?: boolean;
  tipoDespesaSemCartao?: string;
}
```

## ⚠️ Limitações

- **Delete**: A remoção de transações não está implementada via API (apenas localmente)
- **Update**: Atualizações não estão implementadas (apenas append de novas transações)
- **Rate Limits**: Google Sheets API tem limites de requisições (100 por 100 segundos por usuário)

## 🔒 Segurança

- ✅ Credenciais nunca são expostas no frontend
- ✅ Service Account com escopo limitado (apenas Sheets)
- ✅ Backend intermediário protege as credenciais
- ✅ Variáveis de ambiente para configuração
- ✅ `.env` e arquivos JSON no `.gitignore`

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que todas as variáveis estão preenchidas

### Erro: "Permission denied" ou "Insufficient permissions"
- Verifique se a planilha está compartilhada com o email da service account
- Confirme que a service account tem permissão de **Editor**

### Erro: "Invalid credentials"
- Verifique se `GOOGLE_PRIVATE_KEY` tem as quebras de linha corretas (`\n`)
- Confirme que o email da service account está correto

### Erro: "Spreadsheet not found"
- Verifique se o `GOOGLE_SHEET_ID` está correto (da URL da planilha)
- Confirme que a planilha existe e está acessível
