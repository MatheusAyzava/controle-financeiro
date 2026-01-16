# 🚀 Guia de Deploy - Controle Financeiro

Este guia explica como fazer o deploy do aplicativo no Supabase e Netlify.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com) (gratuita)
2. Conta no [Netlify](https://netlify.com) (gratuita)
3. Git instalado (opcional, mas recomendado)

## 🔧 Passo 1: Configurar o Supabase

### 1.1 Criar projeto no Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name**: controle-financeiro (ou outro nome)
   - **Database Password**: escolha uma senha forte
   - **Region**: escolha a região mais próxima
4. Aguarde o projeto ser criado (pode levar alguns minutos)

### 1.2 Criar as tabelas

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run** para executar o SQL
5. Verifique se as tabelas foram criadas em **Table Editor**

### 1.3 Obter as credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (será `VITE_SUPABASE_URL`)
   - **anon public** key (será `VITE_SUPABASE_ANON_KEY`)

## 🌐 Passo 2: Deploy no Netlify

### Opção A: Deploy via Netlify CLI (Recomendado)

1. **Instalar Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Fazer login**:
```bash
netlify login
```

3. **Instalar dependências**:
```bash
npm install
```

4. **Criar arquivo .env.local** (localmente para testar):
```bash
# Copie o .env.example e preencha com suas credenciais
cp .env.example .env.local
```

5. **Build local** (para testar):
```bash
npm run build
```

6. **Deploy**:
```bash
netlify deploy --prod
```

### Opção B: Deploy via GitHub (Mais fácil)

1. **Criar repositório no GitHub**:
   - Crie um repositório no GitHub
   - Faça push do código

2. **Conectar ao Netlify**:
   - Acesse [https://app.netlify.com](https://app.netlify.com)
   - Clique em "Add new site" → "Import an existing project"
   - Conecte com GitHub e selecione o repositório

3. **Configurar variáveis de ambiente**:
   - Em **Site settings** → **Environment variables**
   - Adicione:
     - `VITE_SUPABASE_URL` = sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY` = sua chave anon do Supabase

4. **Configurar build**:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Deploy**:
   - Clique em "Deploy site"
   - Aguarde o build completar

### Opção C: Deploy via Drag & Drop

1. **Build local**:
```bash
npm install
npm run build
```

2. **Acesse Netlify**:
   - Vá em [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Arraste a pasta `dist` para a área de drop

3. **Configurar variáveis** (após o primeiro deploy):
   - Vá em **Site settings** → **Environment variables**
   - Adicione as variáveis do Supabase

## ✅ Passo 3: Verificar o Deploy

1. Após o deploy, você receberá uma URL (ex: `seu-app.netlify.app`)
2. Acesse a URL e teste o aplicativo
3. Adicione algumas transações para verificar se está salvando no Supabase

## 🔍 Verificando se está funcionando

1. **No Supabase**:
   - Vá em **Table Editor** → **transacoes**
   - Você deve ver as transações sendo salvas em tempo real

2. **No aplicativo**:
   - Adicione uma transação
   - Recarregue a página
   - A transação deve continuar lá (vindo do Supabase)

## 🐛 Troubleshooting

### Erro: "Variáveis do Supabase não configuradas"
- Verifique se as variáveis de ambiente estão configuradas no Netlify
- Certifique-se de que os nomes estão corretos: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### Erro: "Failed to fetch"
- Verifique se as políticas RLS estão configuradas no Supabase
- Execute novamente o SQL do `supabase-schema.sql`

### Dados não aparecem
- O app usa fallback para localStorage se o Supabase não estiver disponível
- Verifique o console do navegador para erros
- Certifique-se de que as tabelas foram criadas corretamente

## 📱 Acessando de qualquer dispositivo

Após o deploy, você pode acessar o aplicativo de qualquer dispositivo usando a URL do Netlify:
- Computador: `https://seu-app.netlify.app`
- Celular: `https://seu-app.netlify.app`
- Tablet: `https://seu-app.netlify.app`

Todos os dados serão sincronizados via Supabase!

## 🔐 Segurança

- As chaves do Supabase são públicas (anon key) e seguras para uso no frontend
- O RLS (Row Level Security) está configurado para permitir operações
- Para produção, considere implementar autenticação de usuários

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Netlify (Deploys → selecione o deploy → Functions/Logs)
2. Verifique o console do navegador (F12)
3. Verifique o Supabase (Logs → Postgres Logs)
