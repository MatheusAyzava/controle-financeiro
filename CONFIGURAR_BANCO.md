# 🔧 Guia de Configuração do Banco de Dados (Supabase)

Este guia vai te ajudar a configurar o Supabase para o seu aplicativo de controle financeiro.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com) (gratuita)
2. Navegador web atualizado

## 🚀 Passo 1: Criar Projeto no Supabase

### 1.1 Acessar o Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Clique em **"Sign In"** ou **"Sign Up"** para criar uma conta (se ainda não tiver)
3. Faça login na sua conta

### 1.2 Criar Novo Projeto

1. No painel do Supabase, clique em **"New Project"** (ou **"Novo Projeto"**)
2. Preencha os dados:
   - **Name**: `controle-financeiro` (ou outro nome de sua escolha)
   - **Database Password**: Escolha uma senha forte e **ANOTE ELA** (você vai precisar depois)
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
   - **Pricing Plan**: Selecione **Free** (plano gratuito)
3. Clique em **"Create new project"**
4. Aguarde 2-5 minutos enquanto o projeto é criado (uma tela de loading aparecerá)

## 📊 Passo 2: Criar as Tabelas

### 2.1 Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique no botão **"New Query"** (ou **"Nova Query"**)

### 2.2 Executar o Script SQL

1. Abra o arquivo `supabase-schema.sql` que está na raiz do projeto
2. Copie **TODO** o conteúdo do arquivo
3. Cole no editor SQL do Supabase
4. Clique no botão **"Run"** (ou **"Executar"**) no canto inferior direito
5. Você deve ver uma mensagem de sucesso: **"Success. No rows returned"**

### 2.3 Verificar se as Tabelas Foram Criadas

1. No menu lateral, clique em **"Table Editor"** (ou **"Editor de Tabelas"**)
2. Você deve ver duas tabelas:
   - ✅ `transacoes`
   - ✅ `renda`
3. Se aparecerem, está tudo certo! 🎉

## 🔑 Passo 3: Obter as Credenciais

### 3.1 Acessar as Configurações da API

1. No menu lateral, clique em **"Settings"** (Configurações)
2. Clique em **"API"** (no submenu)

### 3.2 Copiar as Credenciais

Você verá duas informações importantes:

1. **Project URL** (URL do Projeto)
   - Exemplo: `https://xxxxxxxxxxxxx.supabase.co`
   - **Copie este valor** - será sua `VITE_SUPABASE_URL`

2. **anon public** key (Chave Pública Anônima)
   - É uma chave longa que começa com `eyJ...`
   - **Copie este valor** - será sua `VITE_SUPABASE_ANON_KEY`
   - ⚠️ **CUIDADO**: Não compartilhe esta chave publicamente

## 💻 Passo 4: Configurar no Projeto Local

### 4.1 Criar Arquivo de Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env.local`
2. **IMPORTANTE**: O arquivo deve começar com ponto (`.env.local`)
3. Cole o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

4. Substitua:
   - `https://seu-projeto.supabase.co` pela sua **Project URL** do passo 3.2
   - `sua-chave-anon-aqui` pela sua **anon public** key do passo 3.2

### 4.2 Exemplo de .env.local

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxOTM5MDMyNzg5fQ.ExAmPle1234567890
```

## ✅ Passo 5: Testar a Configuração

### 5.1 Reiniciar o Servidor de Desenvolvimento

1. Pare o servidor atual (pressione `Ctrl + C` no terminal)
2. Inicie novamente:
   ```bash
   npm run dev
   ```

### 5.2 Verificar no Console

1. Abra o navegador em `http://localhost:5174` (ou a porta que aparecer)
2. Abra o Console do Desenvolvedor (F12)
3. Vá na aba **Console**
4. Você **NÃO** deve ver o aviso: `"Variáveis do Supabase não configuradas"`
5. Se não aparecer o aviso, está funcionando! ✅

### 5.3 Testar Salvando uma Transação

1. No aplicativo, adicione uma nova transação
2. No Supabase, vá em **Table Editor** → **transacoes**
3. Você deve ver a transação aparecer lá! 🎉
4. Recarregue a página do app - a transação deve continuar lá

## 🔍 Verificando se Está Funcionando

### ✅ Sinais de que está funcionando:

1. **No Console do Navegador**:
   - ❌ Não aparece: `"Variáveis do Supabase não configuradas"`
   - ✅ Não há erros em vermelho relacionados ao Supabase

2. **No Supabase - Table Editor**:
   - ✅ Você consegue ver as transações sendo salvas em tempo real
   - ✅ Você consegue ver a renda sendo salva

3. **No Aplicativo**:
   - ✅ Você adiciona uma transação e ela aparece
   - ✅ Você recarrega a página e a transação continua lá
   - ✅ Você muda de dispositivo e os dados aparecem

## 🐛 Resolução de Problemas

### Problema: "Variáveis do Supabase não configuradas"

**Solução**:
1. Verifique se o arquivo `.env.local` existe na raiz do projeto
2. Verifique se os nomes das variáveis estão corretos (maiúsculas):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Reinicie o servidor de desenvolvimento (`npm run dev`)

### Problema: "Failed to fetch" ou erros de CORS

**Solução**:
1. Verifique se executou o script SQL completo (`supabase-schema.sql`)
2. No Supabase, vá em **Table Editor** e verifique se as tabelas existem
3. Verifique se as políticas RLS estão ativadas:
   - Vá em **Authentication** → **Policies**
   - Verifique se há políticas para as tabelas `transacoes` e `renda`

### Problema: Dados não aparecem no Supabase

**Solução**:
1. Verifique o console do navegador (F12) para erros
2. Verifique se as credenciais no `.env.local` estão corretas
3. Tente executar o script SQL novamente

### Problema: Erro ao executar o SQL

**Solução**:
1. Execute o script SQL linha por linha
2. Se houver erro em uma linha específica, verifique a sintaxe
3. Certifique-se de que não há projetos antigos interferindo

## 📱 Próximos Passos

Depois de configurar o banco localmente, você pode:

1. **Fazer Deploy no Netlify** - Siga o arquivo `DEPLOY.md`
2. **Configurar variáveis no Netlify** - Adicione as mesmas variáveis de ambiente
3. **Acessar de qualquer dispositivo** - Os dados serão sincronizados automaticamente

## 🔐 Segurança

- ✅ A **anon key** é segura para uso no frontend
- ✅ As políticas RLS permitem que qualquer pessoa acesse (ideal para app compartilhado)
- ⚠️ Para produção com múltiplos usuários, considere implementar autenticação

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:
1. Verifique os logs no Supabase: **Logs** → **Postgres Logs**
2. Verifique o console do navegador (F12)
3. Verifique se todas as tabelas foram criadas corretamente

---

**Pronto!** 🎉 Agora seu banco de dados está configurado e pronto para uso!
