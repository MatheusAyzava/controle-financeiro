# 💰 Controle Financeiro - Separação de Gastos

Aplicativo web profissional para controle financeiro com separação de gastos entre pessoas que compartilham o mesmo cartão.

## 🎯 Funcionalidades

- ✅ **Separação de Gastos**: Registre transações separadas por pessoa (Você e Sogra)
- 📊 **Dashboard Completo**: Visualize totais, percentuais e distribuição de gastos
- 📝 **Categorização**: Organize despesas por categorias (Alimentação, Transporte, Compras, etc.)
- 💾 **Armazenamento Local**: Dados salvos automaticamente no navegador
- 🎨 **UI/UX Moderna**: Interface bonita, responsiva e intuitiva
- 🔍 **Filtros**: Filtre transações por pessoa ou visualize todas
- 📅 **Histórico Completo**: Todas as transações com data e hora

## 🚀 Como Usar

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse o aplicativo no navegador (geralmente em `http://localhost:5173`)

### Build para Produção

```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

## 📱 Como Funciona

1. **Adicionar Transação**: Use o formulário à direita para registrar uma nova despesa
   - Informe a descrição (ex: "Supermercado")
   - Digite o valor
   - Selecione quem pagou (Você ou Sogra)
   - Escolha a categoria
   - Defina a data

2. **Visualizar Resumo**: O dashboard mostra:
   - Total geral de gastos
   - Seus gastos e percentual
   - Gastos da sogra e percentual
   - Total de transações
   - Gráfico de distribuição

3. **Filtrar Transações**: Use os botões de filtro para ver apenas suas transações, apenas da sogra, ou todas

4. **Remover Transação**: Clique no ícone de lixeira para remover uma transação

## 🛠️ Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **LocalStorage** - Armazenamento local dos dados

## 📋 Estrutura do Projeto

```
controle-financeiro/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Componente do dashboard
│   │   ├── ListaTransacoes.tsx     # Lista de transações
│   │   └── FormularioTransacao.tsx # Formulário de nova transação
│   ├── types/
│   │   └── index.ts                # Tipos TypeScript
│   ├── utils/
│   │   ├── storage.ts              # Funções de armazenamento
│   │   └── formatacao.ts           # Formatação de valores
│   ├── App.tsx                     # Componente principal
│   ├── main.tsx                    # Ponto de entrada
│   └── index.css                   # Estilos globais
├── index.html
├── package.json
└── README.md
```

## 💡 Dicas de Uso

- **Adicione transações imediatamente** após usar o cartão para manter o controle sempre atualizado
- **Use categorias** para facilitar a organização e futuras análises
- **Verifique o dashboard regularmente** para acompanhar a distribuição de gastos
- **Os dados são salvos automaticamente** no navegador, não é necessário salvar manualmente

## 🔮 Melhorias Futuras

- [ ] Exportar dados para Excel/CSV
- [ ] Gráficos mais detalhados
- [ ] Filtros por data e categoria
- [ ] Notificações de gastos altos
- [ ] Integração com APIs bancárias (quando disponível)
- [ ] Modo escuro
- [ ] Backup na nuvem

## 📄 Licença

Este projeto é de uso pessoal.

---

Desenvolvido com ❤️ para facilitar o controle financeiro compartilhado
