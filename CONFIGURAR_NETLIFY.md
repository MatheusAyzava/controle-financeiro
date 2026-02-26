# 🔧 Configuração do Netlify para Google Sheets

## 📋 Variáveis de Ambiente no Netlify

Para que as transações sejam salvas no Google Sheets, você precisa configurar as seguintes variáveis de ambiente no Netlify:

1. Acesse o painel do Netlify: https://app.netlify.com
2. Vá em **Site settings** > **Environment variables**
3. Adicione as seguintes variáveis:

### Variáveis Obrigatórias:

```
GOOGLE_CLIENT_EMAIL
```
- Email da service account do Google Cloud
- Exemplo: `sheets-contas@projeto.iam.gserviceaccount.com`

```
GOOGLE_PRIVATE_KEY
```
- Chave privada completa da service account
- IMPORTANTE: Mantenha as quebras de linha `\n` ou substitua por quebras reais
- Exemplo: `-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n`

```
GOOGLE_SHEET_ID
```
- ID da planilha Google Sheets (da URL)
- Exemplo: `1a2b3c4d5e6f7g8h9i0j`

```
GOOGLE_SHEET_TAB
```
- Nome da aba na planilha (opcional, padrão: "Transacoes")
- Exemplo: `Transacoes`

### Variáveis Opcionais (já configuradas):

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```
- Podem ser removidas se não estiver usando Supabase mais

## 🚀 Como Funciona

1. **Frontend (React)**: Quando você registra uma transação, ela chama `/api/transacoes`
2. **Netlify Redirect**: O `netlify.toml` redireciona `/api/transacoes` para `/.netlify/functions/transacoes`
3. **Netlify Function**: A função serverless (`netlify/functions/transacoes.js`) processa a requisição
4. **Google Sheets API**: A função usa as credenciais para salvar na planilha

## ✅ Teste

Após configurar as variáveis de ambiente:

1. Faça um novo deploy no Netlify (ou aguarde o redeploy automático)
2. Acesse seu site: `https://seu-site.netlify.app`
3. Cadastre uma transação
4. Verifique na planilha Google Sheets que a transação foi adicionada

## 🔍 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se todas as variáveis estão configuradas no Netlify
- Certifique-se de que fez um novo deploy após adicionar as variáveis

### Erro: "Permission denied"
- Verifique se a planilha está compartilhada com o email da service account
- Confirme que a service account tem permissão de **Editor**

### Transações não aparecem no Sheets
- Verifique os logs do Netlify Functions em **Functions** > **transacoes**
- Confirme que o cabeçalho está na linha 1 da planilha
- Verifique se o nome da aba está correto (`GOOGLE_SHEET_TAB`)

### CORS Error
- As funções já estão configuradas com CORS
- Se ainda houver erro, verifique se a URL da API está correta

## 📝 Estrutura da Planilha

Certifique-se de que a planilha tem o cabeçalho na **linha 1**:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | Data | Descrição | Categoria | Tipo | Valor | Pessoa | Cartão | Parcela | Observação | CreatedAt |
