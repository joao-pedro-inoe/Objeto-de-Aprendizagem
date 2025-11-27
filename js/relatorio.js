// relatorio.js - gera visão simples dos resultados
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dados-relatorio');
  if (!container) return;

  const resultados = JSON.parse(localStorage.getItem('resultados') || '{}');
  if (!Object.keys(resultados).length) {
    container.innerHTML = '<p>Nenhum resultado encontrado. Faça os questionários para gerar um relatório.</p>';
    return;
  }

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.innerHTML = `
    <thead>
      <tr><th style="text-align:left;padding:8px">Módulo</th><th style="text-align:left;padding:8px">Acertos</th><th style="text-align:left;padding:8px">Total</th><th style="text-align:left;padding:8px">Percentual</th></tr>
    </thead>
    <tbody></tbody>
  `;

  let totalAcertos = 0, totalQuestoes = 0;
  const tbody = table.querySelector('tbody');

  Object.keys(resultados).sort().forEach(k => {
    const r = resultados[k];
    const perc = Math.round((r.acertos / r.total) * 100);
    tbody.innerHTML += `<tr>
      <td style="padding:8px">${k.toUpperCase()}</td>
      <td style="padding:8px">${r.acertos}</td>
      <td style="padding:8px">${r.total}</td>
      <td style="padding:8px">${perc}%</td>
    </tr>`;
    totalAcertos += r.acertos;
    totalQuestoes += r.total;
  });

  container.appendChild(table);

  const geral = document.createElement('div');
  geral.style.marginTop = '16px';
  const percGeral = Math.round((totalAcertos / totalQuestoes) * 100);
  geral.innerHTML = `<strong>Desempenho geral: ${percGeral}%</strong>`;
  container.appendChild(geral);
});