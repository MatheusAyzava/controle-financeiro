# 🚀 Deploy no Netlify - Guia Rápido

## 📋 Opções de Deploy

### 🎯 Opção 1: Deploy via Drag & Drop (MAIS FÁCIL)

**Esta é a opção mais rápida!**

#### Passo 1: Fazer Build Local

1. No terminal, execute:
```bash
npm run build
```

2. Aguarde o build completar
3. Uma pasta `dist` será criada com os arquivos prontos

#### Passo 2: Fazer Deploy no Netlify

1. Acesse: **https://app.netlify.com/drop**
2. Se não tiver conta, clique em **"Sign up"** (é gratuito)
3. Faça login na sua conta
4. **Arraste a pasta `dist`** para a área de drop do Netlify
5. Aguarde alguns segundos
6. Você receberá uma URL temporária! 🎉

#### Passo 3: Configurar Variáveis de Ambiente

⚠️ **IMPORTANTE**: Sem isso, o Supabase não funcionará!

1. No Netlify, vá em **"Site settings"** (Configurações do Site)
2. No menu lateral, clique em **"Environment variables"** (Variáveis de Ambiente)
3. Clique em **"Add a variable"** (Adicionar variável)
4. Adicione as duas variáveis:

   **Variável 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://jnjsbyisnpriyyxdcpgn.supabase.co`
   
   **Variável 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `sb_publishable_GB_d0Ip8-wH9Ig5PX_-HMg_DBObDoBM`

5. Clique em **"Save"** (Salvar)

#### Passo 4: Fazer Novo Deploy

1. Depois de adicionar as variáveis, você precisa fazer um novo deploy
2. Vá em **"Deploys"** (Deploys)
3. Clique em **"Trigger deploy"** → **"Deploy site"**
4. Aguarde o deploy completar

#### Passo 5: Renomear seu Site

1. Vá em **"Site settings"** → **"Change site name"**
2. Escolha um nome personalizado (ex: `controle-financeiro`)
3. Sua URL será: `https://controle-financeiro.netlify.app`

---

### 🎯 Opção 2: Deploy via Netlify CLI

#### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

#### Passo 2: Fazer Login

```bash
netlify login
```

Isso abrirá o navegador para você fazer login.

#### Passo 3: Fazer Deploy

```bash
netlify deploy --prod
```

Na primeira vez, ele vai perguntar:
- **"Publish directory"**: Digite `dist`
- **"Build command"**: Digite `npm run build`

#### Passo 4: Configurar Variáveis de Ambiente

1. No Netlify, vá em **"Site settings"** → **"Environment variables"**
2. Adicione as variáveis (mesmas da Opção 1)
3. Faça um novo deploy: `netlify deploy --prod`

---

### 🎯 Opção 3: Deploy via GitHub (Automático)

#### Passo 1: Criar Repositório no GitHub

1. Acesse: **https://github.com/new**
2. Crie um novo repositório (ex: `controle-financeiro`)
3. **NÃO** marque "Initialize with README"
4. Clique em **"Create repository"**

#### Passo 2: Fazer Upload do Código

1. No terminal, execute:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/controle-financeiro.git
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu usuário do GitHub**

#### Passo 3: Conectar ao Netlify

1. Acesse: **https://app.netlify.com**
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **"GitHub"**
4. Autorize o Netlify a acessar seu GitHub
5. Selecione o repositório `controle-financeiro`

#### Passo 4: Configurar Build

O Netlify deve detectar automaticamente:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

Se não detectar, preencha manualmente.

#### Passo 5: Adicionar Variáveis de Ambiente

1. Antes de fazer deploy, clique em **"Show advanced"**
2. Clique em **"New variable"**
3. Adicione as duas variáveis:
   - `VITE_SUPABASE_URL` = `https://jnjsbyisnpriyyxdcpgn.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_GB_d0Ip8-wH9Ig5PX_-HMg_DBObDoBM`
4. Clique em **"Deploy site"**

#### Vantagem desta opção:

✅ Toda vez que você fizer `git push`, o Netlify faz deploy automático!

---

## ✅ Depois do Deploy

1. **Teste o site**: Acesse sua URL do Netlify
2. **Adicione uma transação**: Veja se salva no Supabase
3. **Acesse de outro dispositivo**: Os dados devem sincronizar!

## 🔒 Importante

- ✅ As variáveis de ambiente são **essenciais** para o Supabase funcionar
- ✅ Sem elas, o app usará apenas localStorage (não sincroniza)
- ✅ Você pode atualizar as variáveis a qualquer momento em "Site settings"

## 🐛 Problemas Comuns

### "Variáveis do Supabase não configuradas"
- Verifique se adicionou as variáveis no Netlify
- Faça um novo deploy após adicionar as variáveis

### "Failed to fetch"
- Verifique se as variáveis estão corretas
- Verifique se o Supabase está acessível

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Tente fazer build local primeiro: `npm run build`

---

**Pronto!** 🎉 Seu app estará online e acessível de qualquer lugar!
