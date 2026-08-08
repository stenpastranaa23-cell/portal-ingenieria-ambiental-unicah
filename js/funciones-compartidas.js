function sitioIniciarMenu() {
  const btnMenu = document.getElementById('btn-menu');
  const menuPanel = document.getElementById('menu-panel');
  if (!btnMenu || !menuPanel) return;
  btnMenu.addEventListener('click', () => {
    const abierto = menuPanel.classList.toggle('menu-panel--abierto');
    btnMenu.setAttribute('aria-expanded', abierto);
  });
  document.addEventListener('click', (evento) => {
    const clickDentroDelMenu = menuPanel.contains(evento.target);
    const clickEnElBoton = btnMenu.contains(evento.target);
    if (!clickDentroDelMenu && !clickEnElBoton) {
      menuPanel.classList.remove('menu-panel--abierto');
      btnMenu.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menuPanel.classList.contains('menu-panel--abierto')) {
      menuPanel.classList.remove('menu-panel--abierto');
      btnMenu.setAttribute('aria-expanded', 'false');
      btnMenu.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  vidaIniciarCarga();
  sitioIniciarMenu();
});

function vidaIniciarCarga() {
  const carga = document.querySelector('.vida__carga');
  if (!carga) return;

  const ocultar = () => {
    carga.classList.add('vida__carga--oculta');
    carga.addEventListener('transitionend', () => carga.remove(), { once: true });
    window.setTimeout(() => carga.remove(), 1200);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ocultar();
    return;
  }

  const inicio = Date.now();
  const tiempoMinimo = 1500;
  const terminar = () => {
    const restante = tiempoMinimo - (Date.now() - inicio);
    window.setTimeout(ocultar, Math.max(0, restante));
  };

  if (document.readyState === 'complete') terminar();
  else window.addEventListener('load', terminar);

  window.setTimeout(ocultar, 4000);
}
