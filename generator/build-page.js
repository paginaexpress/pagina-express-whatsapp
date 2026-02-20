/**
 * Generator/Build-Page.js
 * Orquestrador central que gera as páginas dos clientes.
 */

const fs = require('fs');
const path = require('path');
const { slugify } = require('./utils');
const { applyData } = require('./apply-data');

// Caminhos base
const TEMPLATE_PATH = path.join(__dirname, '../template/index.html');
const CLIENTES_DIR = path.join(__dirname, '../clientes');

/**
 * Gera a página de um cliente
 * @param {object} clientData 
 */
function buildPage(clientData) {
    try {
        console.log(`\n--- Iniciando Build: ${clientData.nome_empresa} ---`);

        // 1. Gerar Slug
        const slug = slugify(clientData.nome_empresa);
        if (!slug) throw new Error("Nome da empresa inválido para gerar slug.");
        console.log(`✔ Slug gerado: ${slug}`);

        // 2. Ler Template
        if (!fs.existsSync(TEMPLATE_PATH)) throw new Error("Arquivo de template não encontrado.");
        const templateHTML = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

        // 3. Aplicar Dados
        const finalHTML = applyData(templateHTML, clientData);
        console.log(`✔ Dados injetados com sucesso.`);

        // 4. Criar Pasta do Cliente
        const clientFolder = path.join(CLIENTES_DIR, slug);
        if (!fs.existsSync(clientFolder)) {
            fs.mkdirSync(clientFolder, { recursive: true });
        }

        // 5. Salvar index.html
        const outputPath = path.join(clientFolder, 'index.html');
        fs.writeFileSync(outputPath, finalHTML, 'utf-8');
        console.log(`✔ Arquivo criado: ${outputPath}`);

        // 6. Resultado Final
        console.log(`✔ URL Simulada: https://pagina-express.pages.dev/clientes/${slug}/`);
        console.log(`--- Build Finalizado com Sucesso ---\n`);

        return slug;
    } catch (error) {
        console.error(`✖ Erro no build: ${error.message}`);
        return null;
    }
}

// Execução de teste se houver arquivo test-client.json
const TEST_DATA_PATH = path.join(__dirname, 'test-client.json');
if (require.main === module) {
    if (fs.existsSync(TEST_DATA_PATH)) {
        const testData = JSON.parse(fs.readFileSync(TEST_DATA_PATH, 'utf-8'));
        buildPage(testData);
    } else {
        console.log("Aviso: Arquivo de teste 'test-client.json' não encontrado. Use o Admin no futuro.");
    }
}

module.exports = { buildPage };
