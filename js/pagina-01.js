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

function inicioIniciarHeroZoom() {
    const hero = document.querySelector('.inicio__hero');
    const carrusel = document.querySelector('.inicio__carrusel');

    if (!hero || !carrusel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const escalaMaxScroll = 0.15;

    const actualizar = () => {
        const heroRect = hero.getBoundingClientRect();
        const progreso = Math.min(1, Math.max(0, -heroRect.top / hero.offsetHeight));
        carrusel.style.transform = 'scale(' + (1 + progreso * escalaMaxScroll) + ')';
    };

    const activarZoomPorScroll = () => {
        carrusel.style.animation = 'none';

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
    };

    carrusel.addEventListener('animationend', activarZoomPorScroll, { once: true });
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

function inicioIniciarInstagram() {
    const tarjetas = document.querySelectorAll('.instagram__tarjeta');
    const flechaIzq = document.getElementById('instagram-flecha-izq');
    const flechaDer = document.getElementById('instagram-flecha-der');

    if (tarjetas.length === 0) return;

    let instagramIndiceActivo = 2;

    const clasesPosicion = ['instagram__tarjeta--izq2', 'instagram__tarjeta--izq1', 'instagram__tarjeta--activa', 'instagram__tarjeta--der1', 'instagram__tarjeta--der2'];

    function inicioActualizarInstagram() {
        tarjetas.forEach((tarjeta, i) => {
            tarjeta.classList.remove(...clasesPosicion, 'instagram__tarjeta--oculta');
            const posicionRelativa = i - instagramIndiceActivo;

            if (posicionRelativa >= -2 && posicionRelativa <= 2) {
                tarjeta.classList.add(clasesPosicion[posicionRelativa + 2]);
            } else {
                tarjeta.classList.add('instagram__tarjeta--oculta');
            }
        });
    }

    function inicioIrAInstagram(indice) {
        instagramIndiceActivo = Math.max(0, Math.min(indice, tarjetas.length - 1));
        inicioActualizarInstagram();
    }

    flechaDer.addEventListener('click', () => inicioIrAInstagram(instagramIndiceActivo + 1));
    flechaIzq.addEventListener('click', () => inicioIrAInstagram(instagramIndiceActivo - 1));

    tarjetas.forEach((tarjeta, i) => {
        tarjeta.addEventListener('click', (evento) => {
            if (i !== instagramIndiceActivo) {
                evento.preventDefault();
                inicioIrAInstagram(i);
            }
        });
    });

    inicioActualizarInstagram();
}

customElements.define('honduras-map', HondurasMap);

document.addEventListener('DOMContentLoaded', () => {
    inicioIniciarCarrusel();
    inicioIniciarHeroZoom();
    inicioIniciarCaminos();
    inicioIniciarContador();
    inicioIniciarInstagram();
});
