const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

/**
 * Função utilitária para fazer requisições HTTPS
 */
function request(method, url, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const json = JSON.parse(body);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(json);
                } else {
                    reject(json);
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function setup() {
    try {
        console.log("--- Iniciando Diagnóstico Cloudflare via API ---");

        // 0. Verificar Token
        const verify = await request('GET', 'https://api.cloudflare.com/client/v4/user/tokens/verify');
        console.log(`✔ Token status: ${verify.result.status}`);

        // 1. Usar ID da conta extraído da URL do usuário (Audit Fix)
        const accountId = "124354f269a25de1edc370340a02fb76";
        console.log(`✔ Usando Account ID manual: ${accountId}`);

        const repos = [
            'pagina-express-whatsapp',
            'saloes-express-1',
            'delivery-express-1',
            'estetica-express-1'
        ];

        for (const repoName of repos) {
            console.log(`\nConfigurando projeto: ${repoName}...`);
            try {
                const projectData = {
                    name: repoName,
                    production_branch: 'main',
                    build_config: {
                        build_command: '',
                        destination_dir: '',
                        root_dir: '',
                        web_analytics_tag: null,
                        web_analytics_token: null
                    },
                    deployment_configs: {
                        production: {
                            environment_variables: {
                                NODE_VERSION: '16'
                            }
                        }
                    },
                    source: {
                        type: 'github',
                        config: {
                            owner: 'paginaexpress',
                            repo_name: repoName,
                            production_branch: 'main',
                            pr_comments_enabled: true,
                            deployments_enabled: true
                        }
                    }
                };

                const result = await request('POST', `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`, projectData);
                console.log(`✔ Projeto ${repoName} criado/conectado com sucesso!`);
            } catch (err) {
                if (err.errors && err.errors[0].code === 80001) {
                    console.log(`ℹ Projeto ${repoName} já existe no Cloudflare.`);
                } else {
                    console.error(`✖ Erro ao criar ${repoName}:`, JSON.stringify(err));
                }
            }
        }

        console.log("\n--- Projetos e URLs de Produção ---");
        const list = await request('GET', `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`);
        for (const p of list.result) {
            const deploys = await request('GET', `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${p.name}/deployments`);
            const url = deploys.result && deploys.result.length > 0 ? deploys.result[0].url : `https://${p.subdomain}`;
            console.log(`- ${p.name}: ${url}`);
        }

        console.log("\n--- Configuração Finalizada ---");
    } catch (error) {
        console.error("✖ Erro Crítico:", error.message || error);
    }
}

setup();
