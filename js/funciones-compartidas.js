/**
 * Funciones compartidas entre paginas
 * Menu de navegacion
 */

document.addEventListener('DOMContentLoaded', function () {
  sitioIniciarMenu();
});

function sitioIniciarMenu() {
  var btnMenu = document.getElementById('btn-menu');
  var menuPanel = document.getElementById('menu-panel');

  if (!btnMenu || !menuPanel) return;

  btnMenu.addEventListener('click', function () {
    var abierto = menuPanel.classList.toggle('menu-panel--abierto');
    btnMenu.setAttribute('aria-expanded', abierto);
  });

  document.addEventListener('click', function (evento) {
    var clickDentroDelMenu = menuPanel.contains(evento.target);
    var clickEnElBoton = btnMenu.contains(evento.target);

    if (!clickDentroDelMenu && !clickEnElBoton) {
      menuPanel.classList.remove('menu-panel--abierto');
      btnMenu.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menuPanel.classList.contains('menu-panel--abierto')) {
      menuPanel.classList.remove('menu-panel--abierto');
      btnMenu.setAttribute('aria-expanded', 'false');
      btnMenu.focus();
    }
  });
}
