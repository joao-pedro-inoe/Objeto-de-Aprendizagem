/* questionario.js - carregar e corrigir questionários */

// caminhoJSON: caminho relativo (ex: "../questionarios/quest_mod1.json")
// modulo: número do módulo (1..5)
function carregarQuestionario(caminhoJSON, modulo) {
  fetch(caminhoJSON)
    .then(r => { if (!r.ok) throw new Error('Falha ao carregar JSON'); return r.json(); })
    .then(data => {
      renderizarQuestionario(data.perguntas, modulo);
    })
    .catch(err => {
      console.error(err);
      const container = document.getElementById('container-questionario');
      if (container) container.innerHTML = '<p>Erro ao carregar questionário.</p>';
    });
}

function renderizarQuestionario(perguntas, modulo) {
  const container = document.getElementById('container-questionario');
  if (!container) return;
  container.innerHTML = '';

  perguntas.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'questao';
    div.innerHTML = `
      <p class="enunciado"><strong>${idx+1}. ${q.enunciado}</strong></p>
      <div class="opcoes">
        ${q.alternativas.map((alt,i) => `
          <label><input type="radio" name="q${idx}" value="${i}"> ${alt}</label>
        `).join('')}
      </div>
    `;
    container.appendChild(div);
  });

  // botão enviar (se já não existir)
  if (!document.getElementById('btnEnviarQuiz')) {
    const btn = document.createElement('button');
    btn.id = 'btnEnviarQuiz';
    btn.className = 'botao primario';
    btn.textContent = 'Enviar respostas';
    btn.style.marginTop = '12px';
    btn.onclick = () => corrigirQuestionario(perguntas, modulo);
    container.appendChild(btn);
  }

  // restaurar respostas salvas (se houver)
  const salvas = JSON.parse(localStorage.getItem(`respostas_mod${modulo}`) || '{}');
  Object.keys(salvas).forEach(k => {
    const input = document.querySelector(`input[name="${k}"][value="${salvas[k]}"]`);
    if (input) input.checked = true;
  });

  // autosave: escutar mudanças
  container.querySelectorAll('input[type=radio]').forEach(inp => {
    inp.addEventListener('change', () => {
      const checked = container.querySelectorAll('input[type=radio]:checked');
      const obj = {};
      checked.forEach(c => obj[c.name] = c.value);
      localStorage.setItem(`respostas_mod${modulo}`, JSON.stringify(obj));
    });
  });
}

function corrigirQuestionario(perguntas, modulo) {
  const total = perguntas.length;
  let acertos = 0;
  const respostas = {};

  perguntas.forEach((p, idx) => {
    const sel = document.querySelector(`input[name="q${idx}"]:checked`);
    const val = sel ? Number(sel.value) : null;
    respostas[`q${idx}`] = val;
    if (val !== null && val === p.correta) acertos++;
  });

  // salva resultado usando storage.js
  if (typeof window.salvarResultado === 'function') {
    window.salvarResultado(modulo, acertos, total);
  } else {
    localStorage.setItem(`resultado_mod${modulo}`, JSON.stringify({acertos,total}));
  }

  // remove respostas temporárias
  localStorage.removeItem(`respostas_mod${modulo}`);

  // --- NOVO: Atualiza a barra ANTES de mudar de página ---
  if (typeof window.atualizarProgresso === 'function') {
    window.atualizarProgresso();
  }

  alert(`Você acertou ${acertos} de ${total} questões.`);

  // finalizar (redireciona)
  if (typeof window.finalizarModulo === 'function') {
    // pequeno atraso para permitir que a barra atualize visualmente
    setTimeout(() => {
      window.finalizarModulo(modulo);
    }, 300);
  } else {
    window.location.href = '../index.html';
  }
}


/* expor funções globais */
window.carregarQuestionario = carregarQuestionario;
window.corrigirQuestionario = corrigirQuestionario;
