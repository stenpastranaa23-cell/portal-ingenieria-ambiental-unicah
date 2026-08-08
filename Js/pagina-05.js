document.addEventListener('DOMContentLoaded', () => {
  vidaIniciarCarga();
  vidaIniciarFormacionRevelado();
  vidaIniciarRutaGiras();
  vidaIniciarHeroFijo();
  vidaIniciarEnredaderas();
  vidaIniciarIntroCabecera();
  vidaIniciarRecorrido();
});

function vidaIniciarIntroCabecera() {
  const cabecera = document.querySelector('.vida__intro-cabecera');

  if (!cabecera) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('vida__intro-cabecera--visible');
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.4 });

  observador.observe(cabecera);
}

function vidaIniciarRecorrido() {
  const disparador = document.querySelector('.vida__recorrido-inicio');
  const panel = document.querySelector('.vida__recorrido');
  const paradas = Array.from(document.querySelectorAll('[data-parada]'));

  if (!disparador || !panel || !paradas.length) return;

  const nombre = panel.querySelector('.vida__recorrido-nombre');
  const numero = panel.querySelector('.vida__recorrido-num');
  const total = panel.querySelector('.vida__recorrido-total');
  const barra = panel.querySelector('.vida__recorrido-progreso');
  const salir = panel.querySelector('.vida__recorrido-salir');

  const duracion = 4500;
  const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let indice = -1;
  let temporizador = null;
  total.textContent = paradas.length;

  const limpiar = () => {
    window.clearTimeout(temporizador);
    temporizador = null;
    paradas.forEach((parada) => parada.classList.remove('vida__parada-activa'));
  };

  const cerrar = () => {
    limpiar();
    panel.hidden = true;
    indice = -1;
  };

  const ir = (nuevo) => {
    limpiar();

    if (nuevo >= paradas.length) {
      cerrar();
      return;
    }

    indice = nuevo;
    const destino = paradas[indice];
    destino.classList.add('vida__parada-activa');
    destino.scrollIntoView({
      behavior: suave ? 'smooth' : 'auto',
      block: destino.offsetHeight > window.innerHeight * 0.75 ? 'start' : 'center'
    });

    nombre.textContent = destino.dataset.parada;
    numero.textContent = indice + 1;

    barra.style.transition = 'none';
    barra.style.width = '0%';
    void barra.offsetWidth;
    barra.style.transition = 'width ' + duracion + 'ms linear';
    barra.style.width = '100%';

    temporizador = window.setTimeout(() => ir(indice + 1), duracion);
  };

  disparador.addEventListener('click', () => {
    panel.hidden = false;
    ir(0);
  });

  salir.addEventListener('click', () => {
    cerrar();
    disparador.focus();
  });

  document.addEventListener('keydown', (evento) => {
    if (!panel.hidden && evento.key === 'Escape') cerrar();
  });
}

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
  }, { threshold: 0, rootMargin: '-32% 0px -32% 0px' });

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
  }, { threshold: 0, rootMargin: '-32% 0px -32% 0px' });

  observador.observe(sendero);
}

function vidaIniciarEnredaderas() {
  const contenedor = document.querySelector('.vida__enredaderas');
  const seccion = document.querySelector('.vida__intro');

  if (!contenedor || !seccion) return;

  const izquierda = contenedor.querySelector('.vida__enredadera--izq');

  if (izquierda && !contenedor.querySelector('.vida__enredadera--der')) {
    const derecha = izquierda.cloneNode(true);
    derecha.classList.remove('vida__enredadera--izq');
    derecha.classList.add('vida__enredadera--der');
    contenedor.appendChild(derecha);
  }

  const piezas = Array.from(contenedor.querySelectorAll('[data-s]')).map((el) => ({
    el,
    inicio: parseFloat(el.dataset.s) / 100,
    fin: parseFloat(el.dataset.e) / 100,
    esHoja: el.classList.contains('vida__enr-hoja')
  }));

  if (!piezas.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    piezas.forEach(({ el, esHoja }) => {
      if (esHoja) {
        el.style.opacity = 1;
        el.style.transform = 'scale(1)';
      } else {
        el.style.strokeDashoffset = 0;
      }
    });
    return;
  }

  const actualizar = () => {
    const rect = seccion.getBoundingClientRect();
    const mira = window.innerHeight / 2 - rect.top;
    const progreso = rect.height > 0
      ? Math.min(1, Math.max(0, mira / rect.height))
      : 0;

    piezas.forEach(({ el, inicio, fin, esHoja }) => {
      const avance = Math.min(1, Math.max(0, (progreso - inicio) / (fin - inicio)));

      if (esHoja) {
        el.style.opacity = avance;
        el.style.transform = 'scale(' + (0.15 + avance * 0.85) + ')';
      } else {
        el.style.strokeDashoffset = 1 - avance;
      }
    });
  };

  let pendiente = false;

  window.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      actualizar();
      pendiente = false;
    });
  }, { passive: true });

  window.addEventListener('resize', actualizar);
  actualizar();
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
