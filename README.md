# Pagina Express WhatsApp

Plataforma escalável para geração automática de páginas de clientes hospedadas no Cloudflare Pages.

## Estrutura do Projeto
- `/template`: Template base HTML/CSS/JS.
- `/clientes`: Páginas geradas para cada cliente.
- `/generator`: Scripts de automação para construção de páginas.
- `/styles`: Estilos globais e base do sistema.
- `/admin`: Painel de administração simples.

## Como Rodar Localmente
1. Clone o repositório.
2. Abra o `index.html` na raiz para acessar o painel de controle.
3. Use o formulário para inserir dados do cliente.

## Fluxo do Sistema
1. Preencher dados no Admin.
2. Script `generator/build-page.js` processa o template com os dados.
3. Nova pasta é criada em `/clientes/slug-do-cliente`.
4. Deploy automático ao dar push no GitHub.

## Como Gerar Páginas
Execute o script de build:
```bash
npm run build
```

## Deploy
Vinculado ao Cloudflare Pages via GitHub. Cada Push na branch `main` dispara o deploy.
