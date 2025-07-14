// Dados globais
let receitas = JSON.parse(localStorage.getItem('receitas')) || [];
let despesas = JSON.parse(localStorage.getItem('despesas')) || [];
let metas = JSON.parse(localStorage.getItem('metas')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data atual nos campos de data
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data-receita').value = hoje;
    document.getElementById('data-despesa').value = hoje;
    
    // Configurar mês e ano atual nos relatórios
    const agora = new Date();
    document.getElementById('mes-relatorio').value = agora.getMonth() + 1;
    document.getElementById('ano-relatorio').value = agora.getFullYear();
    
    // Carregar dados salvos
    carregarDados();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Atualizar dashboard
    atualizarDashboard();
    
    // Criar gráficos
    criarGraficos();
    
    // Smooth scrolling para links da navegação
    configurarSmoothScrolling();
});

// Configurar event listeners
function configurarEventListeners() {
    // Formulário de receitas
    document.getElementById('form-receita').addEventListener('submit', function(e) {
        e.preventDefault();
        adicionarReceita();
    });
    
    // Formulário de despesas
    document.getElementById('form-despesa').addEventListener('submit', function(e) {
        e.preventDefault();
        adicionarDespesa();
    });
    
    // Formulário de metas
    document.getElementById('form-meta').addEventListener('submit', function(e) {
        e.preventDefault();
        adicionarMeta();
    });
}

// Smooth scrolling
function configurarSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Funções de receitas
function adicionarReceita() {
    const descricao = document.getElementById('descricao-receita').value;
    const valor = parseFloat(document.getElementById('valor-receita').value);
    const categoria = document.getElementById('categoria-receita').value;
    const data = document.getElementById('data-receita').value;
    
    if (!descricao || !valor || !categoria || !data) {
        mostrarAlerta('Por favor, preencha todos os campos!', 'danger');
        return;
    }
    
    const receita = {
        id: Date.now(),
        descricao,
        valor,
        categoria,
        data,
        tipo: 'receita'
    };
    
    receitas.push(receita);
    salvarDados();
    atualizarTabelaReceitas();
    atualizarDashboard();
    atualizarGraficos();
    
    // Limpar formulário
    document.getElementById('form-receita').reset();
    document.getElementById('data-receita').value = new Date().toISOString().split('T')[0];
    
    mostrarAlerta('Receita adicionada com sucesso!', 'success');
}

function atualizarTabelaReceitas() {
    const tbody = document.getElementById('tabela-receitas');
    
    if (receitas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma receita cadastrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = receitas.map(receita => `
        <tr class="fade-in-up">
            <td>${formatarData(receita.data)}</td>
            <td>${receita.descricao}</td>
            <td><span class="badge bg-success">${receita.categoria}</span></td>
            <td class="text-success fw-bold">${formatarMoeda(receita.valor)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="removerItem('receitas', ${receita.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Funções de despesas
function adicionarDespesa() {
    const descricao = document.getElementById('descricao-despesa').value;
    const valor = parseFloat(document.getElementById('valor-despesa').value);
    const categoria = document.getElementById('categoria-despesa').value;
    const data = document.getElementById('data-despesa').value;
    
    if (!descricao || !valor || !categoria || !data) {
        mostrarAlerta('Por favor, preencha todos os campos!', 'danger');
        return;
    }
    
    const despesa = {
        id: Date.now(),
        descricao,
        valor,
        categoria,
        data,
        tipo: 'despesa'
    };
    
    despesas.push(despesa);
    salvarDados();
    atualizarTabelaDespesas();
    atualizarDashboard();
    atualizarGraficos();
    
    // Limpar formulário
    document.getElementById('form-despesa').reset();
    document.getElementById('data-despesa').value = new Date().toISOString().split('T')[0];
    
    mostrarAlerta('Despesa adicionada com sucesso!', 'success');
}

function atualizarTabelaDespesas() {
    const tbody = document.getElementById('tabela-despesas');
    
    if (despesas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma despesa cadastrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = despesas.map(despesa => `
        <tr class="fade-in-up">
            <td>${formatarData(despesa.data)}</td>
            <td>${despesa.descricao}</td>
            <td><span class="badge bg-danger">${despesa.categoria}</span></td>
            <td class="text-danger fw-bold">${formatarMoeda(despesa.valor)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="removerItem('despesas', ${despesa.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Funções de metas
function adicionarMeta() {
    const nome = document.getElementById('nome-meta').value;
    const valor = parseFloat(document.getElementById('valor-meta').value);
    const prazo = document.getElementById('prazo-meta').value;
    
    if (!nome || !valor || !prazo) {
        mostrarAlerta('Por favor, preencha todos os campos!', 'danger');
        return;
    }
    
    const meta = {
        id: Date.now(),
        nome,
        valor,
        prazo,
        valorAtual: 0,
        dataCriacao: new Date().toISOString().split('T')[0]
    };
    
    metas.push(meta);
    salvarDados();
    atualizarListaMetas();
    
    // Limpar formulário
    document.getElementById('form-meta').reset();
    
    mostrarAlerta('Meta criada com sucesso!', 'success');
}

function atualizarListaMetas() {
    const container = document.getElementById('lista-metas');
    
    if (metas.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="bi bi-target display-4"></i>
                <p class="mt-3">Nenhuma meta cadastrada</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = metas.map(meta => {
        const progresso = (meta.valorAtual / meta.valor) * 100;
        const diasRestantes = calcularDiasRestantes(meta.prazo);
        
        return `
            <div class="meta-card fade-in-up">
                <div class="meta-info">
                    <h5 class="mb-0">${meta.nome}</h5>
                    <button class="btn btn-sm btn-outline-danger" onclick="removerItem('metas', ${meta.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="meta-progress">
                    <div class="d-flex justify-content-between mb-2">
                        <span>${formatarMoeda(meta.valorAtual)} / ${formatarMoeda(meta.valor)}</span>
                        <span>${progresso.toFixed(1)}%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-info" style="width: ${progresso}%"></div>
                    </div>
                    <small class="text-muted mt-2 d-block">
                        ${diasRestantes > 0 ? `${diasRestantes} dias restantes` : 'Prazo vencido'}
                    </small>
                </div>
                <div class="mt-3">
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control" placeholder="Valor a adicionar" id="valor-meta-${meta.id}" step="0.01">
                        <button class="btn btn-outline-info" onclick="adicionarValorMeta(${meta.id})">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function adicionarValorMeta(metaId) {
    const input = document.getElementById(`valor-meta-${metaId}`);
    const valor = parseFloat(input.value);
    
    if (!valor || valor <= 0) {
        mostrarAlerta('Digite um valor válido!', 'danger');
        return;
    }
    
    const meta = metas.find(m => m.id === metaId);
    if (meta) {
        meta.valorAtual += valor;
        salvarDados();
        atualizarListaMetas();
        input.value = '';
        mostrarAlerta('Valor adicionado à meta!', 'success');
    }
}

// Funções do dashboard
function atualizarDashboard() {
    const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
    const saldoTotal = totalReceitas - totalDespesas;
    
    // Receitas e despesas do mês atual
    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();
    
    const receitasMes = receitas.filter(r => {
        const data = new Date(r.data);
        return data.getMonth() + 1 === mesAtual && data.getFullYear() === anoAtual;
    }).reduce((sum, r) => sum + r.valor, 0);
    
    const despesasMes = despesas.filter(d => {
        const data = new Date(d.data);
        return data.getMonth() + 1 === mesAtual && data.getFullYear() === anoAtual;
    }).reduce((sum, d) => sum + d.valor, 0);
    
    const economiaMes = receitasMes - despesasMes;
    
    // Atualizar elementos
    document.getElementById('saldo-total').textContent = formatarMoeda(saldoTotal);
    document.getElementById('receitas-mes').textContent = formatarMoeda(receitasMes);
    document.getElementById('despesas-mes').textContent = formatarMoeda(despesasMes);
    document.getElementById('economia-mes').textContent = formatarMoeda(economiaMes);
    
    // Atualizar cores baseadas nos valores
    document.getElementById('saldo-total').className = saldoTotal >= 0 ? 'card-title text-success' : 'card-title text-danger';
    document.getElementById('economia-mes').className = economiaMes >= 0 ? 'card-title text-info' : 'card-title text-danger';
}

// Funções de gráficos
function criarGraficos() {
    criarGraficoReceitas();
    criarGraficoDespesas();
}

function criarGraficoReceitas() {
    const ctx = document.getElementById('chartReceitas').getContext('2d');
    
    // Dados dos últimos 6 meses
    const meses = [];
    const receitasData = [];
    const despesasData = [];
    
    for (let i = 5; i >= 0; i--) {
        const data = new Date();
        data.setMonth(data.getMonth() - i);
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        
        meses.push(data.toLocaleDateString('pt-BR', { month: 'short' }));
        
        const receitasMes = receitas.filter(r => {
            const dataReceita = new Date(r.data);
            return dataReceita.getMonth() + 1 === mes && dataReceita.getFullYear() === ano;
        }).reduce((sum, r) => sum + r.valor, 0);
        
        const despesasMes = despesas.filter(d => {
            const dataDespesa = new Date(d.data);
            return dataDespesa.getMonth() + 1 === mes && dataDespesa.getFullYear() === ano;
        }).reduce((sum, d) => sum + d.valor, 0);
        
        receitasData.push(receitasMes);
        despesasData.push(despesasMes);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Receitas',
                data: receitasData,
                borderColor: '#198754',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Despesas',
                data: despesasData,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoDespesas() {
    const ctx = document.getElementById('chartDespesas').getContext('2d');
    
    // Agrupar despesas por categoria
    const categorias = {};
    despesas.forEach(despesa => {
        if (!categorias[despesa.categoria]) {
            categorias[despesa.categoria] = 0;
        }
        categorias[despesa.categoria] += despesa.valor;
    });
    
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    const cores = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: cores.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function atualizarGraficos() {
    // Destruir gráficos existentes e recriar
    Chart.getChart('chartReceitas')?.destroy();
    Chart.getChart('chartDespesas')?.destroy();
    criarGraficos();
}

// Funções de relatórios
function atualizarRelatorio() {
    const mes = parseInt(document.getElementById('mes-relatorio').value);
    const ano = parseInt(document.getElementById('ano-relatorio').value);
    
    const receitasFiltradas = receitas.filter(r => {
        const data = new Date(r.data);
        return data.getMonth() + 1 === mes && data.getFullYear() === ano;
    });
    
    const despesasFiltradas = despesas.filter(d => {
        const data = new Date(d.data);
        return data.getMonth() + 1 === mes && data.getFullYear() === ano;
    });
    
    const totalReceitas = receitasFiltradas.reduce((sum, r) => sum + r.valor, 0);
    const totalDespesas = despesasFiltradas.reduce((sum, d) => sum + d.valor, 0);
    const saldo = totalReceitas - totalDespesas;
    
    document.getElementById('total-receitas-relatorio').textContent = formatarMoeda(totalReceitas);
    document.getElementById('total-despesas-relatorio').textContent = formatarMoeda(totalDespesas);
    document.getElementById('saldo-relatorio').textContent = formatarMoeda(saldo);
    document.getElementById('saldo-relatorio').className = saldo >= 0 ? 'text-success' : 'text-danger';
}

// Funções da calculadora
function calcularJuros() {
    const capital = parseFloat(document.getElementById('capital-inicial').value);
    const taxa = parseFloat(document.getElementById('taxa-juros').value) / 100;
    const periodo = parseInt(document.getElementById('periodo').value);
    
    if (!capital || !taxa || !periodo) {
        mostrarAlerta('Preencha todos os campos da calculadora!', 'danger');
        return;
    }
    
    const montante = capital * Math.pow(1 + taxa, periodo);
    const juros = montante - capital;
    
    document.getElementById('resultado-juros').innerHTML = `
        <div class="alert alert-info">
            <h6>Resultado:</h6>
            <p><strong>Capital Inicial:</strong> ${formatarMoeda(capital)}</p>
            <p><strong>Juros:</strong> ${formatarMoeda(juros)}</p>
            <p><strong>Montante Final:</strong> ${formatarMoeda(montante)}</p>
        </div>
    `;
}

function calcularEconomia() {
    const valorMensal = parseFloat(document.getElementById('valor-mensal').value);
    const meses = parseInt(document.getElementById('meses-economia').value);
    const rendimento = parseFloat(document.getElementById('rendimento').value) / 100;
    
    if (!valorMensal || !meses || rendimento < 0) {
        mostrarAlerta('Preencha todos os campos do simulador!', 'danger');
        return;
    }
    
    let total = 0;
    for (let i = 0; i < meses; i++) {
        total = (total + valorMensal) * (1 + rendimento);
    }
    
    const totalInvestido = valorMensal * meses;
    const rendimentoTotal = total - totalInvestido;
    
    document.getElementById('resultado-economia').innerHTML = `
        <div class="alert alert-success">
            <h6>Resultado:</h6>
            <p><strong>Total Investido:</strong> ${formatarMoeda(totalInvestido)}</p>
            <p><strong>Rendimento:</strong> ${formatarMoeda(rendimentoTotal)}</p>
            <p><strong>Total Final:</strong> ${formatarMoeda(total)}</p>
        </div>
    `;
}

// Funções utilitárias
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

function calcularDiasRestantes(prazo) {
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diferenca = dataPrazo - hoje;
    return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

function removerItem(tipo, id) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        if (tipo === 'receitas') {
            receitas = receitas.filter(r => r.id !== id);
            atualizarTabelaReceitas();
        } else if (tipo === 'despesas') {
            despesas = despesas.filter(d => d.id !== id);
            atualizarTabelaDespesas();
        } else if (tipo === 'metas') {
            metas = metas.filter(m => m.id !== id);
            atualizarListaMetas();
        }
        
        salvarDados();
        atualizarDashboard();
        atualizarGraficos();
        mostrarAlerta('Item removido com sucesso!', 'success');
    }
}

function salvarDados() {
    localStorage.setItem('receitas', JSON.stringify(receitas));
    localStorage.setItem('despesas', JSON.stringify(despesas));
    localStorage.setItem('metas', JSON.stringify(metas));
}

function carregarDados() {
    atualizarTabelaReceitas();
    atualizarTabelaDespesas();
    atualizarListaMetas();
    atualizarRelatorio();
}

function mostrarAlerta(mensagem, tipo) {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alertaDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    alertaDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertaDiv);
    
    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        if (alertaDiv.parentNode) {
            alertaDiv.remove();
        }
    }, 3000);
}

