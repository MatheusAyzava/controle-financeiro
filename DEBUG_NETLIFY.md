# 🐛 Debug - Erro 500 no Netlify

## Como verificar os logs da função

1. Acesse: https://app.netlify.com
2. Vá no seu site: **controle-financeiro12**
3. Clique em **Functions** no menu lateral
4. Clique em **transacoes**
5. Veja os **Logs** para identificar o erro exato

## ✅ Checklist de Variáveis de Ambiente

Verifique se TODAS estas variáveis estão configuradas no Netlify:

1. **GOOGLE_CLIENT_EMAIL**
   - Email da service account
   - Formato: `sheets-contas@projeto.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - Chave privada completa
   - IMPORTANTE: Deve incluir `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
   - As quebras de linha `\n` devem estar preservadas

3. **GOOGLE_SHEET_ID**
   - ID da planilha: `1t3eLCM3qywBxm38taJY9dP7yRWVdrIei`

4. **GOOGLE_SHEET_TAB** (opcional)
   - Nome da aba: `Transacoes` (ou deixe vazio para usar padrão)

## 🔍 Erros Comuns

### Erro: "Variáveis de ambiente não configuradas"
- **Solução**: Adicione todas as variáveis no Netlify
- **Onde**: Site settings > Environment variables

### Erro: "Erro de autenticação"
- **Solução**: Verifique se `GOOGLE_PRIVATE_KEY` está completa e correta
- **Dica**: Copie a chave inteira do arquivo JSON da service account

### Erro: "Erro de permissão" ou "PERMISSION_DENIED"
- **Solução**: Compartilhe a planilha com o email da service account
- **Como**: 
  1. Abra a planilha no Google Sheets
  2. Clique em "Compartilhar"
  3. Adicione o email da service account (GOOGLE_CLIENT_EMAIL)
  4. Dê permissão de **Editor**

### Erro: "Planilha não encontrada" ou "NOT_FOUND"
- **Solução**: Verifique se o `GOOGLE_SHEET_ID` está correto
- **ID correto**: `1t3eLCM3qywBxm38taJY9dP7yRWVdrIei`

### Erro: "Aba não encontrada"
- **Solução**: Verifique se a aba existe e se o nome está correto
- **Nome da aba**: Deve ser exatamente `Transacoes` (ou o que você configurou)

## 📋 Como configurar variáveis no Netlify

1. Acesse: https://app.netlify.com
2. Selecione seu site: **controle-financeiro12**
3. Vá em **Site settings** (ícone de engrenagem)
4. Clique em **Environment variables** no menu lateral
5. Clique em **Add a variable**
6. Adicione cada variável:
   - **Key**: `GOOGLE_CLIENT_EMAIL`
   - **Value**: Cole o email da service account
   - **Scopes**: Deixe marcado "All scopes" ou selecione "Production"
7. Repita para todas as variáveis
8. **IMPORTANTE**: Faça um novo deploy após adicionar as variáveis

## 🔄 Fazer novo deploy

Após configurar as variáveis:

1. Vá em **Deploys**
2. Clique nos três pontos (...) do último deploy
3. Selecione **Trigger deploy** > **Deploy site**
4. Ou faça um novo commit e push

## 🧪 Testar a função diretamente

Você pode testar a função diretamente:

```bash
# GET - Carregar transações
curl https://controle-financeiro12.netlify.app/.netlify/functions/transacoes

# Ou no navegador
https://controle-financeiro12.netlify.app/.netlify/functions/transacoes
```

## 📝 Exemplo de GOOGLE_PRIVATE_KEY

A chave privada deve ter este formato:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
(muitas linhas aqui)
...
-----END PRIVATE KEY-----
```

**IMPORTANTE**: 
- Copie a chave INTEIRA do arquivo JSON
- Inclua `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
- As quebras de linha `\n` serão tratadas automaticamente

## 🆘 Ainda com problemas?

1. Verifique os logs da função no Netlify
2. Confirme que todas as variáveis estão configuradas
3. Verifique se a planilha está compartilhada
4. Teste a função diretamente pela URL acima
