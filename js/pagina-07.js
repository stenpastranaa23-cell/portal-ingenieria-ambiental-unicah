// PÁGINA 07 - BLOG
// Dueño: Noel

document.addEventListener('DOMContentLoaded', () => {
  blogIniciarMenu();
  blogIniciarVistas();
});

function blogIniciarMenu() {
  const btnMenu = document.getElementById('btn-menu');
  const menuPanel = document.getElementById('menu-panel');

  btnMenu.addEventListener('click', () => {
    menuPanel.classList.toggle('menu-panel--abierto');
  });

  document.addEventListener('click', (evento) => {
    const clickDentroDelMenu = menuPanel.contains(evento.target);
    const clickEnElBoton = btnMenu.contains(evento.target);

    if (!clickDentroDelMenu && !clickEnElBoton) {
      menuPanel.classList.remove('menu-panel--abierto');
    }
  });
}

function blogIniciarVistas() {
  const vistas = document.querySelectorAll('[data-view]');

  function blogMostrarVista(idVista) {
    vistas.forEach((vista) => {
      vista.hidden = vista.dataset.view !== idVista;
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  blogMostrarVista('list');

  document.body.addEventListener('click', (evento) => {
    const disparador = evento.target.closest('[data-goto]');
    if (disparador) {
      blogMostrarVista(disparador.dataset.goto);
    }
  });
}