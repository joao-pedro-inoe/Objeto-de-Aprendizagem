/* storage.js: controle de progresso e resultados */
const TOTAL_MODULOS = 5;

function salvarResultado(modulo, acertos, total) {
  const resultados = JSON.parse(localStorage.getItem('resultados') || '{}');
  resultados[`mod${modulo}`] = { acertos, total, timestamp: Date.now() };
  localStorage.setItem('resultados', JSON.stringify(resultados));
}

function finalizarModulo(modulo) {
  // marca concluído (usado também para controle de acesso)
  localStorage.setItem(`modulo${modulo}_concluido`, 'true');
  // atualiza progresso visual (se houver)
  atualizarProgresso();

  // redireciona para index (padrão)
  window.location.href = (location.pathname.includes('/modulos/') ? '../index.html' : 'index.html');
}

function carregarProgresso() {
  let concluidos = 0;
  for (let i = 1; i <= TOTAL_MODULOS; i++) {
    if (localStorage.getItem(`modulo${i}_concluido`) === 'true') concluidos++;
  }
  return Math.round((concluidos / TOTAL_MODULOS) * 100);
}

function atualizarProgresso() {
  const p = carregarProgresso();
  // suporta duas localizações diferentes (index ou módulo)
  const barra = document.getElementById('barraProgresso') || document.querySelector('.barra-progresso div');
  if (barra) barra.style.width = p + '%';
  // opcional: mostra texto em elementos com classe progress-text
  const textos = document.querySelectorAll('.progress-text');
  textos.forEach(t => t.textContent = `Progresso: ${p}%`);
}

function podeAcessarModulo(modulo) {
  if (modulo <= 1) return true;
  return localStorage.getItem(`modulo${modulo-1}_concluido`) === 'true';
}

/* Expor funções globalmente para uso via HTML */
window.salvarResultado = salvarResultado;
window.finalizarModulo = finalizarModulo;
window.atualizarProgresso = atualizarProgresso;
window.podeAcessarModulo = podeAcessarModulo;
