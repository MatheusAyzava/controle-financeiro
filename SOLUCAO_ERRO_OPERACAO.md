# 🔧 Solução: "This operation is not supported for this document"

Este erro geralmente ocorre quando a **aba especificada não existe** na planilha ou há problema de permissão.

## ✅ Solução Passo a Passo

### 1. Verificar o nome da aba

1. Abra sua planilha no Google Sheets: https://docs.google.com/spreadsheets/d/1t3eLCM3qywBxm38taJY9dP7yRWVdrIei/edit
2. Veja o nome exato da aba na parte inferior
3. O nome pode ser:
   - `Transacoes` (com T maiúsculo)
   - `Transações` (com acento)
   - `Sheet1` (nome padrão)
   - Ou outro nome

### 2. Configurar a variável GOOGLE_SHEET_TAB

No Netlify, configure a variável `GOOGLE_SHEET_TAB` com o nome **exato** da aba:

1. Acesse: https://app.netlify.com
2. Vá em **Site settings** > **Environment variables**
3. Procure por `GOOGLE_SHEET_TAB`
4. Se não existir, adicione:
   - **Key**: `GOOGLE_SHEET_TAB`
   - **Value**: O nome exato da aba (ex: `Transacoes` ou `Sheet1`)
5. Se já existir, verifique se o valor está correto

**IMPORTANTE**: O nome deve ser **exatamente** igual ao nome da aba, incluindo:
- Maiúsculas/minúsculas
- Acentos
- Espaços

### 3. Criar a aba se não existir

Se a aba não existir, você pode:

**Opção A: Criar manualmente**
1. Abra a planilha
2. Clique no botão "+" no final das abas
3. Renomeie para `Transacoes`
4. Adicione o cabeçalho na linha 1:
   ```
   ID | Data | Descrição | Categoria | Tipo | Valor | Pessoa | Cartão | Parcela | Observação | CreatedAt
   ```

**Opção B: Deixar vazio para usar a primeira aba**
- Remova a variável `GOOGLE_SHEET_TAB` ou deixe vazia
- A função usará a primeira aba da planilha

### 4. Verificar permissões

Certifique-se de que a planilha está compartilhada:

1. Abra a planilha no Google Sheets
2. Clique em **Compartilhar** (botão no canto superior direito)
3. Adicione o email da service account
   - O email está na variável `GOOGLE_CLIENT_EMAIL` no Netlify
   - Formato: `sheets-contas@projeto.iam.gserviceaccount.com`
4. Dê permissão de **Editor**
5. Clique em **Enviar**

### 5. Fazer novo deploy

Após configurar:

1. No Netlify, vá em **Deploys**
2. Clique nos três pontos (...) do último deploy
3. Selecione **Trigger deploy** > **Deploy site**

### 6. Testar novamente

Acesse:
```
https://controle-financeiro12.netlify.app/.netlify/functions/transacoes
```

Agora deve retornar `[]` (array vazio) se não houver transações, ou um array com as transações.

## 🔍 Como descobrir o nome exato da aba

1. Abra a planilha
2. Veja o nome na parte inferior (nas abas)
3. Clique com botão direito na aba
4. Selecione **Renomear** para ver o nome completo
5. Copie o nome exato

## 📋 Exemplo de configuração

Se sua aba se chama `Transacoes`:

```
GOOGLE_SHEET_TAB = Transacoes
```

Se sua aba se chama `Sheet1`:

```
GOOGLE_SHEET_TAB = Sheet1
```

Se você não configurar `GOOGLE_SHEET_TAB`, a função tentará usar `Transacoes` como padrão.

## ⚠️ Erro ainda persiste?

1. Verifique os logs da função no Netlify
2. Confirme que todas as variáveis estão configuradas
3. Teste a função diretamente pela URL acima
4. Verifique se a planilha está realmente compartilhada com a service account
