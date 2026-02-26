# 🔧 Checklist para Resolver Erro 502

O erro 502 (Bad Gateway) indica que a Netlify Function está crashando. Siga este checklist:

## ✅ 1. Verificar Variáveis de Ambiente

No Netlify, vá em **Site settings** > **Environment variables** e verifique:

- [ ] `GOOGLE_CLIENT_EMAIL` está configurada
- [ ] `GOOGLE_PRIVATE_KEY` está configurada (chave completa)
- [ ] `GOOGLE_SHEET_ID` está configurada (`1t3eLCM3qywBxm38taJY9dP7yRWVdrIei`)
- [ ] `GOOGLE_SHEET_TAB` está configurada (ou deixe vazia para usar "Transacoes")

## ✅ 2. Verificar Logs da Função

1. Acesse: https://app.netlify.com
2. Selecione seu site
3. Vá em **Functions** > **transacoes**
4. Veja os **Logs** para identificar o erro exato

## ✅ 3. Verificar Nome da Aba

1. Abra a planilha: https://docs.google.com/spreadsheets/d/1t3eLCM3qywBxm38taJY9dP7yRWVdrIei/edit
2. Veja o nome exato da aba na parte inferior
3. Configure `GOOGLE_SHEET_TAB` com o nome exato

**Se a aba não existir:**
- Crie uma nova aba chamada `Transacoes`
- Adicione o cabeçalho na linha 1:
  ```
  ID | Data | Descrição | Categoria | Tipo | Valor | Pessoa | Cartão | Parcela | Observação | CreatedAt
  ```

## ✅ 4. Verificar Permissões da Planilha

1. Abra a planilha no Google Sheets
2. Clique em **Compartilhar**
3. Adicione o email da service account (está em `GOOGLE_CLIENT_EMAIL`)
4. Dê permissão de **Editor**
5. Clique em **Enviar**

## ✅ 5. Verificar GOOGLE_PRIVATE_KEY

A chave privada deve:
- Incluir `-----BEGIN PRIVATE KEY-----` no início
- Incluir `-----END PRIVATE KEY-----` no final
- Ter todas as linhas (pode ter `\n` ou quebras reais)

**Exemplo correto:**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
(muitas linhas)
...
-----END PRIVATE KEY-----
```

## ✅ 6. Fazer Novo Deploy

Após configurar tudo:

1. No Netlify, vá em **Deploys**
2. Clique nos três pontos (...) do último deploy
3. Selecione **Trigger deploy** > **Deploy site**
4. Aguarde o deploy terminar

## 🧪 7. Testar a Função

Após o deploy, teste diretamente:

```
https://controle-financeiro12.netlify.app/.netlify/functions/transacoes
```

**Resposta esperada:**
- Se funcionar: `[]` (array vazio) ou array com transações
- Se houver erro: JSON com mensagem de erro detalhada

## 🔍 Erros Comuns e Soluções

### "Variáveis de ambiente não configuradas"
- **Solução**: Adicione todas as variáveis no Netlify

### "Aba não encontrada"
- **Solução**: Verifique o nome da aba e configure `GOOGLE_SHEET_TAB`

### "Sem permissão" ou "PERMISSION_DENIED"
- **Solução**: Compartilhe a planilha com a service account

### "Planilha não encontrada"
- **Solução**: Verifique se `GOOGLE_SHEET_ID` está correto

### "Operação não suportada"
- **Solução**: A aba não existe. Crie a aba ou corrija o nome

## 📞 Ainda com Problemas?

1. Verifique os logs da função no Netlify
2. Confirme que todas as variáveis estão configuradas
3. Teste a função diretamente pela URL acima
4. Verifique se a planilha está compartilhada corretamente
