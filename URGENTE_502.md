# 🚨 Solução URGENTE para Erro 502

O erro 502 geralmente significa que a função está crashando. Siga estes passos **na ordem**:

## ⚡ Passo 1: Verificar Logs no Netlify (MAIS IMPORTANTE)

1. Acesse: https://app.netlify.com
2. Selecione seu site: **controle-financeiro12**
3. Vá em **Functions** (menu lateral)
4. Clique em **transacoes**
5. Veja a aba **Logs**
6. **Copie o erro completo** que aparece lá

Os logs vão mostrar exatamente o que está causando o crash.

## ⚡ Passo 2: Verificar Variáveis de Ambiente

No Netlify, vá em **Site settings** > **Environment variables**:

### ✅ Verifique se TODAS estas variáveis existem:

1. **GOOGLE_CLIENT_EMAIL**
   - Deve ter um email válido
   - Formato: `sheets-contas@projeto.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - Deve começar com `-----BEGIN PRIVATE KEY-----`
   - Deve terminar com `-----END PRIVATE KEY-----`
   - Deve ter muitas linhas no meio

3. **GOOGLE_SHEET_ID**
   - Deve ser: `1t3eLCM3qywBxm38taJY9dP7yRWVdrIei`

4. **GOOGLE_SHEET_TAB** (opcional)
   - Nome da aba ou deixe vazia

### ❌ Se alguma variável estiver faltando:
- Adicione ela
- Faça um novo deploy

## ⚡ Passo 3: Testar a Função Diretamente

Após verificar as variáveis, teste:

```
https://controle-financeiro12.netlify.app/.netlify/functions/transacoes
```

**O que deve aparecer:**
- ✅ Se funcionar: `[]` (array vazio) ou array com transações
- ❌ Se houver erro: JSON com mensagem de erro

## ⚡ Passo 4: Verificar Nome da Aba

1. Abra a planilha: https://docs.google.com/spreadsheets/d/1t3eLCM3qywBxm38taJY9dP7yRWVdrIei/edit
2. Veja o nome exato da aba na parte inferior
3. Se não existir uma aba chamada `Transacoes`:
   - Crie uma nova aba
   - Renomeie para `Transacoes`
   - Adicione cabeçalho na linha 1:
     ```
     ID | Data | Descrição | Categoria | Tipo | Valor | Pessoa | Cartão | Parcela | Observação | CreatedAt
     ```

## ⚡ Passo 5: Verificar Permissões

1. Na planilha, clique em **Compartilhar**
2. Adicione o email da service account (está em `GOOGLE_CLIENT_EMAIL`)
3. Dê permissão de **Editor**
4. Clique em **Enviar**

## ⚡ Passo 6: Fazer Novo Deploy

Após fazer todas as verificações:

1. No Netlify, vá em **Deploys**
2. Clique nos três pontos (...) do último deploy
3. Selecione **Trigger deploy** > **Deploy site**
4. Aguarde terminar

## 🔍 Erros Comuns nos Logs

### "Cannot find module 'googleapis'"
- **Solução**: As dependências não foram instaladas. Verifique se `googleapis` e `uuid` estão no `package.json`

### "Variáveis de ambiente não configuradas"
- **Solução**: Adicione todas as variáveis no Netlify

### "Aba não encontrada"
- **Solução**: Crie a aba `Transacoes` ou configure `GOOGLE_SHEET_TAB` com o nome correto

### "PERMISSION_DENIED"
- **Solução**: Compartilhe a planilha com a service account

## 📞 Próximo Passo

**O mais importante é ver os LOGS no Netlify**. Eles vão mostrar exatamente qual é o problema.

Depois de ver os logs, me envie a mensagem de erro completa que aparece lá.
