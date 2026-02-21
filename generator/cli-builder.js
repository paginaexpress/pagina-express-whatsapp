/**
 * generator/cli-builder.js
 * Orquestrador central (CLI) para gerar ou visualizar páginas.
 */

const fs = require('fs');
const path = require('path');
const { assembleJson } = require('./core/json-generator');
const { buildHtml } = require('./core/builder');
const { slugify } = require('./utils');

const TEMPLATE_PATH = path.join(__dirname, '../template/index.html');
const CLIENTES_DIR = path.join(__dirname, '../clientes');
const PREVIEW_DIR = path.join(CLIENTES_DIR, 'preview');

/**
 * Orquestra o processo de geração
 * @param {object} rawData - Dados crus vindos do formulário
 * @param {boolean} isPreview - Se é apenas um preview
 */
function runBuilder(rawData, isPreview = false) {
    try {
        console.log(`\n--- [${isPreview ? 'PREVIEW' : 'PUBLISH'}] Iniciando Processamento ---`);

        // 1. O Cérebro: Normalização e Geração de JSON
        const finalJson = assembleJson(rawData);
        const slug = slugify(finalJson.identidade.nome_empresa);
        console.log(`✔ Dados normalizados e JSON gerado para: ${slug}`);

        // 2. O Construtor: Injeção no Template
        const finalHtml = buildHtml(TEMPLATE_PATH, finalJson);
        console.log(`✔ HTML renderizado com sucesso.`);

        // 3. Destino
        let outputFolder;
        if (isPreview) {
            outputFolder = PREVIEW_DIR;
        } else {
            outputFolder = path.join(CLIENTES_DIR, slug);
        }

        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }

        // 4. Salvar Arquivo
        const outputPath = path.join(outputFolder, 'index.html');
        fs.writeFileSync(outputPath, finalHtml, 'utf-8');

        // Salvar JSON de configuração junto (Motor de Dados)
        fs.writeFileSync(path.join(outputFolder, 'config.json'), JSON.stringify(finalJson, null, 2));

        console.log(`✔ Arquivos salvos em: ${outputFolder}`);
        console.log(`--- Processo Finalizado ---\n`);

        return { slug, folder: outputFolder };
    } catch (error) {
        console.error(`✖ Erro no processo: ${error.message}`);
        return null;
    }
}

// Execução de teste automatizado
if (require.main === module) {
    const TEST_DATA_PATH = path.join(__dirname, 'test-client.json');
    if (fs.existsSync(TEST_DATA_PATH)) {
        const testData = JSON.parse(fs.readFileSync(TEST_DATA_PATH, 'utf-8'));
        // Simula o formulário enviando dados novos sugeridos pelo usuário
        const enhancedData = {
            ...testData,
            publico_alvo: "Moradores e Profissionais",
            cidade: "São Paulo",
            servico_principal: "Corte de Cabelo e Barba",
            diferencial: "Atendimento Premium com café",
            cor_manual: "#1a73e8"
        };
        runBuilder(enhancedData, true); // Testa Preview
    }
}

module.exports = { runBuilder };
