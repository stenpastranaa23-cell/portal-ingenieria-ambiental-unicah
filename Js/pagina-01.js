// PÁGINA 01 - INICIO
// Dueño: Stefany

let inicioIndiceActual = 0;

function inicioIniciarCarrusel() {
  const slides = document.querySelectorAll('.inicio__slide');
  const dots = document.querySelectorAll('.inicio__dot');
  const flechaIzq = document.getElementById('flecha-izq');
  const flechaDer = document.getElementById('flecha-der');

  function inicioMostrarSlide(indice) {
    slides.forEach(s => s.classList.remove('inicio__slide--activo'));
    dots.forEach(d => d.classList.remove('inicio__dot--activo'));
    slides[indice].classList.add('inicio__slide--activo');
    dots[indice].classList.add('inicio__dot--activo');
    inicioIndiceActual = indice;
  }

  function inicioSiguiente() {
    const nuevo = (inicioIndiceActual + 1) % slides.length;
    inicioMostrarSlide(nuevo);
  }

  function inicioAnterior() {
    const nuevo = (inicioIndiceActual - 1 + slides.length) % slides.length;
    inicioMostrarSlide(nuevo);
  }

  flechaDer.addEventListener('click', inicioSiguiente);
  flechaIzq.addEventListener('click', inicioAnterior);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      inicioMostrarSlide(parseInt(dot.dataset.index));
    });
  });

  setInterval(inicioSiguiente, 6000);
}

function inicioIniciarMenu() {
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

function inicioIniciarCaminos() {
  const carrusel = document.getElementById('caminos-carrusel');
  const tarjetas = document.querySelectorAll('.caminos__tarjeta');
  const flechaIzq = document.getElementById('caminos-flecha-izq');
  const flechaDer = document.getElementById('caminos-flecha-der');
  const dotsContenedor = document.getElementById('caminos-dots');

  const tarjetasPorVista = 4;
  const totalPaginas = Math.ceil(tarjetas.length / tarjetasPorVista);
  let caminosPaginaActual = 0;

  for (let i = 0; i < totalPaginas; i++) {
    const dot = document.createElement('span');
    dot.classList.add('caminos__dot');
    if (i === 0) dot.classList.add('caminos__dot--activo');
    dot.addEventListener('click', () => inicioIrAPaginaCaminos(i));
    dotsContenedor.appendChild(dot);
  }

  const dots = document.querySelectorAll('.caminos__dot');

  function inicioIrAPaginaCaminos(pagina) {
    caminosPaginaActual = pagina;
    const anchoTarjeta = tarjetas[0].offsetWidth + 20;
    carrusel.scrollTo({
      left: anchoTarjeta * tarjetasPorVista * pagina,
      behavior: 'smooth'
    });
    dots.forEach(d => d.classList.remove('caminos__dot--activo'));
    dots[pagina].classList.add('caminos__dot--activo');
  }

  flechaDer.addEventListener('click', () => {
    const siguiente = Math.min(caminosPaginaActual + 1, totalPaginas - 1);
    inicioIrAPaginaCaminos(siguiente);
  });

  flechaIzq.addEventListener('click', () => {
    const anterior = Math.max(caminosPaginaActual - 1, 0);
    inicioIrAPaginaCaminos(anterior);
  });
}

// ============================================
// WEB COMPONENT: honduras-map
// ============================================

const hmSitios = [
  {
    nombre: "Intibucá",
    departamento: "Intibucá",
    lat: 14.3167,
    lng: -88.1833,
    descripcion: "Visita a comunidades rurales para conocer proyectos de agua potable.",
    foto: "img/Inicio/mapa-intibucua-agua-potable.jpeg"
  }

  // Próximos sitios a agregar cuando se tengan los datos (coordenadas, foto y descripción real):
  // { nombre: "Lago de Yojoa", departamento: "Cortés / Comayagua", lat: 0, lng: 0, descripcion: "", foto: "img/Inicio/mapa-....jpg" },
  // { nombre: "Río Choluteca", departamento: "Francisco Morazán", lat: 0, lng: 0, descripcion: "", foto: "img/Inicio/mapa-....jpg" },
  // { nombre: "La Tigra", departamento: "Francisco Morazán", lat: 0, lng: 0, descripcion: "", foto: "img/Inicio/mapa-....jpg" },
];

class HondurasMap extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="mapa__contenedor"></div>';
    const contenedor = this.querySelector('.mapa__contenedor');

    const mapa = L.map(contenedor, {
      center: [14.6, -86.8],
      zoom: 7,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    hmSitios.forEach(sitio => {
      const icono = L.divIcon({
        className: 'hm-marcador',
        html: '<span class="hm-marcador__punto"></span><span class="hm-marcador__anillo"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marcador = L.marker([sitio.lat, sitio.lng], { icon: icono }).addTo(mapa);

      const popupHtml = `
        <div class="hm-popup">
          <img src="${sitio.foto}" alt="${sitio.nombre}" class="hm-popup__foto">
          <div class="hm-popup__degradado-arriba"></div>
          <div class="hm-popup__degradado-abajo"></div>
          <div class="hm-popup__encabezado">
            <h3 class="hm-popup__nombre">${sitio.nombre}</h3>
            <span class="hm-popup__departamento">${sitio.departamento}</span>
          </div>
          <div class="hm-popup__info">
            <p class="hm-popup__descripcion">${sitio.descripcion}</p>
          </div>
        </div>
      `;

      marcador.bindPopup(popupHtml, { className: 'hm-popup-wrapper' });
    });
  }
}

function inicioIniciarContador() {
  const numeros = document.querySelectorAll('.cifras__numero');
  if (numeros.length === 0) return;

  function inicioAnimarNumero(elemento) {
    const hasta = parseInt(elemento.dataset.hasta, 10);
    const sufijo = elemento.dataset.sufijo || '';
    const duracion = 1800;
    const inicioTiempo = performance.now();

    function paso(ahora) {
      const progreso = Math.min((ahora - inicioTiempo) / duracion, 1);
      const valorActual = Math.floor(progreso * hasta);
      elemento.textContent = valorActual + sufijo;

      if (progreso < 1) {
        requestAnimationFrame(paso);
      } else {
        elemento.textContent = hasta + sufijo;
      }
    }

    requestAnimationFrame(paso);
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        inicioAnimarNumero(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.5 });

  numeros.forEach(numero => observador.observe(numero));
}

customElements.define('honduras-map', HondurasMap);

document.addEventListener('DOMContentLoaded', () => {
  inicioIniciarCarrusel();
  inicioIniciarMenu();
  inicioIniciarCaminos();
  inicioIniciarContador();
});