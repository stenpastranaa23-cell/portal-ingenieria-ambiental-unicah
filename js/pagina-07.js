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

function blogIniciarScrollReveal() {
  const seccionInstagram = document.querySelector('[data-instagram-seccion]');

  if (!seccionInstagram || !('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('blog__instagram--visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  observador.observe(seccionInstagram);
}

function blogIniciarBrilloCita() {
  const seccionCita = document.querySelector('[data-dia-cita-seccion]');
  const textoCita = document.querySelector('[data-dia-cita]');

  if (!seccionCita || !textoCita || !('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        observador.unobserve(entrada.target);
        setTimeout(() => {
          textoCita.classList.add('blog__dia-cita--brillo');
        }, 5000);
      }
    });
  }, { threshold: 0.4 });

  observador.observe(seccionCita);
}

document.addEventListener('DOMContentLoaded', () => {
  blogIniciarVistas();
  blogIniciarDestacadas();
  blogIniciarScrollReveal();
  blogIniciarBrilloCita();
});