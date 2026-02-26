# 🚀 Guia Rápido de Migração para Google Sheets

## ⚡ Início Rápido

1. **Instalar dependências:**
   ```bash
   npm run install:all
   ```

2. **Configurar variáveis de ambiente:**
   - Copie `.env.example` para `.env`
   - Preencha com suas credenciais do Google Sheets (veja `MIGRACAO_GOOGLE_SHEETS.md`)

3. **Executar aplicação:**
   ```bash
   npm run dev
   ```

4. **Acessar:**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:3001

## 📋 Checklist de Configuração

- [ ] Service Account criada no Google Cloud
- [ ] Google Sheets API habilitada
- [ ] Planilha criada e compartilhada com a service account
- [ ] Arquivo `.env` configurado
- [ ] Cabeçalho adicionado na planilha (linha 1)
- [ ] Dependências instaladas (`npm run install:all`)

## 🔍 Teste Rápido

1. Cadastre uma transação no app
2. Verifique na planilha Google Sheets que apareceu
3. Recarregue a página e confirme que carrega do Sheets

## 📚 Documentação Completa

Veja `MIGRACAO_GOOGLE_SHEETS.md` para instruções detalhadas.
