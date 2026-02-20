/**
 * Admin.js - Pagina Express
 * Lógica do painel de controle administrativo.
 */

// 1. Verificação de Autenticação
if (localStorage.getItem('admin_auth') !== 'true') {
    window.location.href = 'login.html';
}

let allClients = [];

// 2. Carregar dados (MOCK para ambiente estático - no Cloudflare usaria fetch no JSON)
async function loadClients() {
    try {
        // Como o Cloudflare Pages é estático, o admin.js lê o arquivo data/clients.json
        const response = await fetch('../data/clients.json');
        allClients = await response.json();
        renderTable(allClients);
        updateStats(allClients);
    } catch (e) {
        console.error('Erro ao carregar clientes:', e);
        // Exemplo fallback se arquivo não existir
        renderTable([]);
    }
}

// 3. Renderizar Tabela
function renderTable(clients) {
    const tbody = document.getElementById('clientTableBody');
    tbody.innerHTML = '';

    clients.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${c.nome_empresa}</strong><br><small>${c.slug}</small></td>
            <td><span class="badge-niche">${c.nicho || '-'}</span></td>
            <td>${c.whatsapp}</td>
            <td>${new Date(c.data_criacao).toLocaleDateString()}</td>
            <td><span class="status status-${c.status_deploy.toLowerCase().replace('/', '-')}">${c.status_deploy}</span></td>
            <td>
                <button class="btn-action" onclick="window.open('${c.url_final}', '_blank')">Ver</button>
                <button class="btn-action" onclick="openEditModal('${c.slug}')">Editar</button>
                <button class="btn-action" onclick="reenviarLink('${c.slug}')">WhatsApp</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. Buscar / Filtrar
function filtrarTabela() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const filtered = allClients.filter(c =>
        c.nome_empresa.toLowerCase().includes(term) ||
        c.whatsapp.includes(term) ||
        c.slug.includes(term)
    );
    renderTable(filtered);
}

// 5. Estatísticas
function updateStats(clients) {
    document.getElementById('totalPages').innerText = clients.length;
    const success = clients.filter(c => c.status_deploy === 'Sucesso').length;
    const rate = clients.length > 0 ? Math.round((success / clients.length) * 100) : 0;
    document.getElementById('successRate').innerText = `${rate}%`;
}

// 6. Modal de Edição
function openEditModal(slug) {
    const client = allClients.find(c => c.slug === slug);
    if (!client) return;

    document.getElementById('editSlug').value = client.slug;
    document.getElementById('editNome').value = client.nome_empresa;
    document.getElementById('editWa').value = client.whatsapp;

    document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

// 7. Ações
function reenviarLink(slug) {
    const client = allClients.find(c => c.slug === slug);
    const message = `Olá! Vim confirmar o link da sua página profissional: ${client.url_final}`;
    const waLink = `https://wa.me/${client.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
}

function exportarClientes() {
    let csv = 'Nome,Slug,WhatsApp,Data,Status,URL\n';
    allClients.forEach(c => {
        csv += `"${c.nome_empresa}","${c.slug}","${c.whatsapp}","${c.data_criacao}","${c.status_deploy}","${c.url_final}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'clientes_pagina_express.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function logout() {
    localStorage.removeItem('admin_auth');
    window.location.href = 'login.html';
}

// Iniciar
loadClients();
