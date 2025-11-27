// navegacao.js - pequenas utilidades de navegação
document.addEventListener('DOMContentLoaded', () => {
  // atualiza progress bar caso exista
  if (typeof window.atualizarProgresso === 'function') window.atualizarProgresso();
});
