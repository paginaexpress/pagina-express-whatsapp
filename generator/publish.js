/**
 * Generator/Publish.js
 * Orquestrador final do fluxo de publicação.
 */

const fs = require('fs');
const path = require('path');
const { processClient } = require('./process-client');
const { gitDeploy } = require('./git-deploy');
const { generateSitemap } = require('./sitemap');

/**
 * Espelha os arquivos do cliente e assets necessários para o repositório do nicho
 */
function mirrorClientToNicheRepo(client, nichePath) {
    const sourceDir = path.join(__dirname, `../clientes/${client.slug}`);
    const targetDir = path.join(nichePath, `clientes/${client.slug}`);
    const assetsSource = path.join(__dirname, '../assets');
    const assetsTarget = path.join(nichePath, 'assets');
    const stylesSource = path.join(__dirname, '../styles');
    const stylesTarget = path.join(nichePath, 'styles');

    // Cria os diretórios no nicho
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    if (!fs.existsSync(assetsTarget)) fs.mkdirSync(assetsTarget, { recursive: true });
    if (!fs.existsSync(stylesTarget)) fs.mkdirSync(stylesTarget, { recursive: true });

    // Copia index.html do cliente
    fs.copyFileSync(path.join(sourceDir, 'index.html'), path.join(targetDir, 'index.html'));

    // Copia assets e estilos (básico para garantir que a página funcione isolada)
    // No mundo real usaríamos uma estratégia de CDN ou subpastas
    copyRecursiveSync(assetsSource, assetsTarget);
    copyRecursiveSync(stylesSource, stylesTarget);

    console.log(`✔ Arquivos espelhados para o repo: ${path.basename(nichePath)}`);
}

/**
 * Utilitário para cópia recursiva
 */
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

async function publish() {
    // 1. Obter caminho do JSON via argumento
    const jsonPath = process.argv[2];
    if (!jsonPath) {
        console.error("Uso: npm run publish -- ./caminho/do/json.json");
        process.exit(1);
    }

    // 2. Processar cliente e gerar página
    const client = processClient(path.resolve(jsonPath));
    if (!client) {
        console.error("Falha no processamento inicial.");
        process.exit(1);
    }

    // 3. Atualizar Contador de Nicho e Obter Repo Alvo
    const repoInfo = updateNicheRepoCount(client.nicho);
    const targetPath = repoInfo ? path.join(__dirname, '../', repoInfo.repo) : '.';

    // 3.1 Espelhar arquivos para o repositório do nicho
    if (repoInfo) {
        mirrorClientToNicheRepo(client, targetPath);
    }

    // 4. Deploy Git (GitHub -> Cloudflare)
    // Passamos o caminho do repositório do nicho
    const deploySuccess = gitDeploy(client.nome_empresa, targetPath);

    const finalUrl = `https://pagina-express.pages.dev/clientes/${client.slug}/`;

    // 5. Salvar no Banco de Dados JSON
    saveClientToData(client, finalUrl, deploySuccess);

    // 6. Regenerar Sitemap
    generateSitemap();

    // 6. Exibir Log Visual
    console.log(`\n----------------------------`);
    console.log(`Cliente: ${client.nome_empresa}`);
    console.log(`Nicho: ${client.nicho}`);
    console.log(`Slug: ${client.slug}`);
    console.log(`Repo Alvo: ${repoInfo ? repoInfo.repo : 'Padrão'}`);
    console.log(`Página criada: OK`);
    console.log(`Commit enviado: ${deploySuccess ? 'OK' : 'FALHA/SEM ALTERAÇÕES'}`);
    console.log(`Deploy Cloudflare: DISPARADO (via Git)`);
    console.log(`URL final:`);
    console.log(`${finalUrl}`);
    console.log(`----------------------------\n`);

    // 7. Redirecionamento Simulado (para Fase 5)
    console.log(`Para entrega, use: success.html?nome=${encodeURIComponent(client.nome_empresa)}&url=${encodeURIComponent(finalUrl)}&whatsapp=${client.whatsapp}`);
}

/**
 * Atualiza o contador de clientes no repo do nicho correspondente.
 */
function updateNicheRepoCount(nicho) {
    const REPOS_PATH = path.join(__dirname, '../data/repos.json');
    if (!fs.existsSync(REPOS_PATH)) return null;

    let reposData = JSON.parse(fs.readFileSync(REPOS_PATH, 'utf-8'));

    if (!reposData[nicho]) {
        console.warn(`Aviso: Nicho '${nicho}' não encontrado no controle de repos.`);
        return null;
    }

    // Encontra o primeiro repo com espaço disponível (neste protótipo, o primeiro da lista)
    const repo = reposData[nicho][0];
    if (repo) {
        repo.ativos += 1;
        fs.writeFileSync(REPOS_PATH, JSON.stringify(reposData, null, 2), 'utf-8');
        console.log(`✔ Contador atualizado para nicho '${nicho}': ${repo.ativos} clientes.`);
    }

    return repo;
}

/**
 * Salva metadados do cliente em data/clients.json
 */
function saveClientToData(client, url, deploySuccess) {
    const DATA_PATH = path.join(__dirname, '../data/clients.json');
    let clients = [];

    if (fs.existsSync(DATA_PATH)) {
        clients = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    }

    const newClient = {
        nome_empresa: client.nome_empresa,
        nicho: client.nicho,
        slug: client.slug,
        whatsapp: client.whatsapp,
        data_criacao: new Date().toISOString(),
        url_final: url,
        status_deploy: deploySuccess ? 'Sucesso' : 'Erro/Local'
    };

    // Atualiza se já existir, senão adiciona
    const index = clients.findIndex(c => c.slug === client.slug);
    if (index !== -1) {
        clients[index] = newClient;
    } else {
        clients.push(newClient);
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(clients, null, 2), 'utf-8');
    console.log(`✔ Dados salvos em data/clients.json`);
}

publish();
