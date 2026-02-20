/**
 * Generator/Git-Deploy.js
 * Automatiza o push para o GitHub para disparar o deploy no Cloudflare.
 */

const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.GITHUB_TOKEN;
const USER = process.env.GITHUB_USER;

/**
 * Simula um deploy real via Git para Cloudflare Pages
 * @param {string} clientName 
 * @param {string} targetPath - Caminho do repositório/nicho alvo
 * @returns {boolean}
 */
function gitDeploy(clientName, targetPath = '.') {
    console.log(`\n--- Iniciando Deploy Git: ${clientName} ---`);
    console.log(`Diretório alvo: ${path.resolve(targetPath)}`);

    try {
        // No mundo real, aqui faríamos:
        // execSync(`cd ${targetPath} && git add .`);
        // execSync(`cd ${targetPath} && git commit -m "Nova página: ${clientName}"`);
        // execSync(`cd ${targetPath} && git push`);

        // Simulação para o teste local se não houver Git real
        // 1. Git Add
        execSync('git add .', { stdio: 'inherit', cwd: targetPath });
        console.log(`✔ Arquivos stageados.`);

        // 2. Git Commit
        const commitMessage = `Novo cliente: ${clientName} - ${new Date().toISOString()}`;
        try {
            execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit', cwd: targetPath });
            console.log(`✔ Commit realizado: ${commitMessage}`);
        } catch (e) {
            console.log("✔ Nada para commitar (ou commit já existente).");
        }

        // 3. Git Push (Com Autenticação via Token)
        if (TOKEN && USER) {
            const repoName = path.basename(path.resolve(targetPath));
            const remoteUrl = `https://${TOKEN}@github.com/${USER}/${repoName}.git`;

            // Forçar nome da branch para main e dar push
            execSync('git branch -M main', { stdio: 'inherit', cwd: targetPath });
            execSync(`git push ${remoteUrl} main --force`, { stdio: 'inherit', cwd: targetPath });
        } else {
            execSync('git branch -M main', { stdio: 'inherit', cwd: targetPath });
            execSync('git push origin main', { stdio: 'inherit', cwd: targetPath });
        }
        console.log(`✔ Push realizado com sucesso.`);

        console.log(`--- Deploy Finalizado ---`);
        return true;
    } catch (error) {
        console.error(`✖ Erro no Git Deploy: ${error.message}`);
        // Nota: Se não houver alterações para commit, o git commit falha.
        // Em um sistema real, verificaríamos git status antes.
        return false;
    }
}

if (typeof module !== 'undefined') {
    module.exports = { gitDeploy };
}
