document.addEventListener('DOMContentLoaded', () => {
  vidaIniciarCarga();
  vidaIniciarFormacionRevelado();
  vidaIniciarRutaGiras();
  vidaIniciarHeroFijo();
});

function vidaIniciarHeroFijo() {
  const hero = document.querySelector('.vida__hero');
  const contenido = document.querySelector('.vida__hero-contenido');
  const imagen = document.querySelector('.vida__hero-imagen');
  const intro = document.querySelector('.vida__intro');

  if (!hero || !contenido || !imagen) return;

  const alturaHero = hero.offsetHeight;

  const actualizarPosicion = () => {
    const heroRect = hero.getBoundingClientRect();
    const puntoDeAnclaje = window.innerHeight * 0.35;
    const introRect = intro ? intro.getBoundingClientRect() : null;

    if (introRect && introRect.top <= 0) {
      contenido.classList.add('vida__hero-contenido--oculto');
      contenido.classList.remove('vida__hero-contenido--fijo');
    } else if (heroRect.top <= puntoDeAnclaje) {
      contenido.classList.add('vida__hero-contenido--fijo');
      contenido.classList.remove('vida__hero-contenido--oculto');
    } else {
      contenido.classList.remove('vida__hero-contenido--fijo', 'vida__hero-contenido--oculto');
    }

    const progreso = Math.min(1, Math.max(0, -heroRect.top / alturaHero));
    imagen.style.transform = 'scale(' + (1 + progreso * 0.15) + ')';
  };

  window.addEventListener('scroll', actualizarPosicion, { passive: true });
  window.addEventListener('resize', actualizarPosicion);
  actualizarPosicion();
}

function vidaIniciarFormacionRevelado() {
  const filas = document.querySelectorAll('.vida__formacion-fila');

  if (!filas.length) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('vida__formacion-fila--visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.2 });

  filas.forEach((fila) => observador.observe(fila));
}

function vidaIniciarRutaGiras() {
  const sendero = document.querySelector('.vida__ruta-sendero');
  const hitos = document.querySelectorAll('.vida__ruta-hito');

  if (!sendero || !hitos.length) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      sendero.classList.add('vida__ruta-sendero--visible');
      hitos.forEach((hito, indice) => {
        setTimeout(() => {
          hito.classList.add('vida__ruta-hito--visible');
        }, indice * 150);
      });
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.2 });

  observador.observe(sendero);
}

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
