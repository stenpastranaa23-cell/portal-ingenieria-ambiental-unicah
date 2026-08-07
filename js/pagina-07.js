// PÁGINA 07 - BLOG
// Dueño: Noel

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

function blogIniciarDestacadas() {
  const slides = document.querySelectorAll('[data-destacada-slide]');
  const puntos = document.querySelectorAll('[data-destacada-dot]');

  if (slides.length === 0) return;

  let indiceActual = 0;
  let temporizador = null;

  function blogMostrarDestacada(indice) {
    slides.forEach((slide, i) => {
      const esActivo = i === indice;
      slide.classList.toggle('blog__destacada-slide--activa', esActivo);
      slide.setAttribute('aria-hidden', String(!esActivo));
    });

    puntos.forEach((punto, i) => {
      const esActivo = i === indice;
      punto.classList.toggle('blog__destacada-dot--activo', esActivo);
      punto.setAttribute('aria-selected', String(esActivo));
    });

    indiceActual = indice;
  }

  function blogIniciarAutoplayDestacadas() {
    temporizador = setInterval(() => {
      const siguiente = (indiceActual + 1) % slides.length;
      blogMostrarDestacada(siguiente);
    }, 4500);
  }

  puntos.forEach((punto, i) => {
    punto.addEventListener('click', (evento) => {
      evento.stopPropagation();
      clearInterval(temporizador);
      blogMostrarDestacada(i);
      blogIniciarAutoplayDestacadas();
    });
  });

  blogIniciarAutoplayDestacadas();
}

document.addEventListener('DOMContentLoaded', () => {
  blogIniciarVistas();
  blogIniciarDestacadas();
  blogIniciarFiltros();
});

function blogIniciarFiltros() {
  const filtros = document.querySelectorAll('[data-filtro]');
  const tarjetas = document.querySelectorAll('[data-categoria]');

  if (filtros.length === 0) return;

  filtros.forEach((filtro) => {
    filtro.addEventListener('click', (evento) => {
      evento.stopPropagation();

      const categoriaElegida = filtro.dataset.filtro;

      filtros.forEach((f) => {
        f.classList.toggle('blog__filtro--activo', f === filtro);
        f.setAttribute('aria-selected', String(f === filtro));
      });

      tarjetas.forEach((tarjeta) => {
        const coincide = categoriaElegida === 'todas' || tarjeta.dataset.categoria === categoriaElegida;
        tarjeta.classList.toggle('blog__tarjeta--oculta', !coincide);
      });
    });
  });
}