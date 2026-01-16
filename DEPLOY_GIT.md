# 🚀 Deploy Automático via Git (GitHub + Netlify)

Com essa configuração, **toda vez que você fizer push no GitHub**, o Netlify faz deploy automaticamente! 🎉

## 📋 Pré-requisitos

1. Conta no [GitHub](https://github.com) (gratuita)
2. Conta no [Netlify](https://netlify.com) (gratuita)
3. Git instalado (geralmente já vem no Windows)

---

## 🔧 Passo 1: Inicializar Git no Projeto

Execute estes comandos no terminal (na pasta do projeto):

```bash
git init
git add .
git commit -m "Initial commit - Controle Financeiro"
```

---

## 🔧 Passo 2: Criar Repositório no GitHub

### 2.1 Criar o repositório

1. Acesse: **https://github.com/new**
2. Preencha:
   - **Repository name**: `controle-financeiro` (ou outro nome)
   - **Description**: `App de controle financeiro compartilhado`
   - **Public** ou **Private** (escolha como preferir)
   - **NÃO** marque "Initialize with README" (já temos arquivos)
3. Clique em **"Create repository"**

### 2.2 Conectar e fazer push

O GitHub vai mostrar comandos. Execute no terminal (substitua `SEU_USUARIO` pelo seu usuário do GitHub):

```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/controle-financeiro.git
git push -u origin main
```

**Se pedir login:**
- GitHub agora usa tokens ao invés de senha
- Se precisar, crie um token em: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Use o token como senha

---

## 🔧 Passo 3: Conectar Netlify ao GitHub

### 3.1 Importar projeto no Netlify

1. No Netlify, vá em **"Add new site"** (ou **"New site"**)
2. Clique em **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Autorize o Netlify a acessar seu GitHub (se pedir)
5. Selecione o repositório `controle-financeiro`

### 3.2 Configurar Build

O Netlify deve detectar automaticamente:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

Se não detectar, preencha manualmente:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 3.3 Adicionar Variáveis de Ambiente

⚠️ **IMPORTANTE**: Antes de fazer o primeiro deploy, adicione as variáveis!

1. Na tela de configuração, clique em **"Show advanced"** ou **"Environment variables"**
2. Clique em **"New variable"**
3. Adicione:

   **Variável 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://jnjsbyisnpriyyxdcpgn.supabase.co`
   
   **Variável 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `sb_publishable_GB_d0Ip8-wH9Ig5PX_-HMg_DBObDoBM`

4. Clique em **"Deploy site"**

---

## ✅ Pronto! Deploy Automático Configurado

### Como funciona agora:

1. **Você faz alterações** no código
2. **Faz commit e push:**
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push
   ```
3. **Netlify detecta automaticamente** e faz deploy! 🎉

### Para fazer deploy de novas atualizações:

Sempre que quiser atualizar o site:

```bash
# 1. Adicionar as mudanças
git add .

# 2. Fazer commit
git commit -m "Adicionei opção Outros com nome personalizado"

# 3. Fazer push (o Netlify faz deploy automaticamente!)
git push
```

---

## 🔍 Verificando o Deploy

1. No Netlify, vá em **"Deploys"**
2. Você verá um novo deploy aparecer automaticamente após cada `git push`
3. O deploy leva 1-3 minutos normalmente

---

## 🐛 Problemas Comuns

### Erro: "Git não encontrado"
- Instale o Git: https://git-scm.com/download/win
- Reinicie o terminal após instalar

### Erro ao fazer push
- Verifique se está logado: `git config --global user.name "Seu Nome"`
- Verifique se está logado: `git config --global user.email "seu@email.com"`
- Se pedir autenticação, use um Personal Access Token do GitHub

### Variáveis não funcionam
- Verifique se adicionou as variáveis no Netlify: **Site settings** → **Environment variables**
- Faça um novo deploy após adicionar variáveis: vá em **Deploys** → **Trigger deploy**

---

**Agora é só fazer `git push` e o site atualiza automaticamente!** 🚀
