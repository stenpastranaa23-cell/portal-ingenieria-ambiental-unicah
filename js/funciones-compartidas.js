document.addEventListener('DOMContentLoaded', () => {
  sitioIniciarMenu();
});

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
 