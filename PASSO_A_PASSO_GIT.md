# 📝 Passo a Passo: Deploy via Git

## 🔧 PASSO 1: Criar Repositório no GitHub

1. Acesse: **https://github.com/new**
2. Faça login (se não estiver logado)
3. Preencha:
   - **Repository name**: `controle-financeiro`
   - **Description**: `App de controle financeiro` (opcional)
   - Deixe **Public** ou escolha **Private**
   - ⚠️ **NÃO** marque nenhuma opção abaixo (README, .gitignore, license)
4. Clique em **"Create repository"** (botão verde)

---

## 🔧 PASSO 2: Conectar Projeto ao GitHub

Depois de criar o repositório, o GitHub mostrará uma página com instruções.

### Você verá algo assim:

```
…or push an existing repository from the command line

git remote add origin https://github.com/SEU_USUARIO/controle-financeiro.git
git branch -M main
git push -u origin main
```

### Execute estes comandos no terminal:

⚠️ **SUBSTITUA `SEU_USUARIO` pelo seu usuário do GitHub!**

```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/controle-financeiro.git
git push -u origin main
```

**Exemplo** (se seu usuário for `matheus123`):
```bash
git branch -M main
git remote add origin https://github.com/matheus123/controle-financeiro.git
git push -u origin main
```

### Se pedir login:

- **Username**: seu usuário do GitHub
- **Password**: NÃO use sua senha! Use um **Personal Access Token**
  - Criar token: https://github.com/settings/tokens
  - Clique em "Generate new token (classic)"
  - Marque "repo" (todas as opções de repositório)
  - Copie o token e use como senha

---

## 🔧 PASSO 3: Conectar Netlify ao GitHub

### 3.1 No Netlify:

1. No Netlify, clique em **"Add new site"** (ou **"New site from Git"**)
2. Escolha **"Deploy with GitHub"** ou **"Import an existing project"**
3. Se pedir, **autorize o Netlify** a acessar seu GitHub
4. Procure e selecione o repositório `controle-financeiro`

### 3.2 Configurar Build Settings:

Você verá uma tela de configuração. Preencha:

- **Branch to deploy**: `main` (ou `master`)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 3.3 Adicionar Variáveis de Ambiente:

⚠️ **ANTES de clicar em "Deploy site"**, adicione as variáveis:

1. Clique em **"Show advanced"** ou **"Environment variables"**
2. Clique em **"New variable"** (ou **"Add variable"**)
3. Adicione:

   **Primeira variável:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://jnjsbyisnpriyyxdcpgn.supabase.co`
   - Clique em **"Add variable"**

   **Segunda variável:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_GB_d0Ip8-wH9Ig5PX_-HMg_DBObDoBM`
   - Clique em **"Add variable"**

4. Clique em **"Deploy site"**

---

## ✅ Pronto!

### Agora funciona assim:

1. Você faz mudanças no código
2. Executa no terminal:
   ```bash
   git add .
   git commit -m "Descrição da mudança"
   git push
   ```
3. O Netlify detecta automaticamente e faz deploy! 🎉

### Onde ver os deploys:

- **Netlify**: Vá em **"Deploys"** para ver histórico
- **Status**: Cada commit aparece como um novo deploy
- **Tempo**: Geralmente 1-3 minutos por deploy

---

## 🐛 Se algo der errado:

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/controle-financeiro.git
```

### Erro: "Authentication failed"
- Use um Personal Access Token ao invés da senha
- Criar token: https://github.com/settings/tokens

### Variáveis não funcionam
- Vá em **Site settings** → **Environment variables** no Netlify
- Verifique se estão corretas
- Faça um novo deploy após adicionar: **Deploys** → **Trigger deploy**

---

**Qualquer dúvida, me avise!** 😊
