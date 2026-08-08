document.addEventListener("DOMContentLoaded", () => {
    contactoIniciarRevelado();
    contactoIniciarEnredaderas();
});

function contactoIniciarRevelado() {
    const elementos = document.querySelectorAll(".contacto__revelar");
    if (!elementos.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elementos.forEach((el) => el.classList.add("contacto__revelar--visible"));
        return;
    }

    const grupos = new Map();
    elementos.forEach((el) => {
        const padre = el.parentElement;
        if (!grupos.has(padre)) grupos.set(padre, []);
        grupos.get(padre).push(el);
    });

    elementos.forEach((el) => {
        const hermanos = grupos.get(el.parentElement);
        const indice = hermanos.indexOf(el);
        el.style.transitionDelay = (indice * 0.08) + "s";
    });

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add("contacto__revelar--visible");
            observador.unobserve(entrada.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    elementos.forEach((el) => observador.observe(el));
}

function contactoIniciarEnredaderas() {
    const contenedor = document.querySelector(".contacto__enredaderas");
    const seccion = document.querySelector(".contacto__canales");

    if (!contenedor || !seccion) return;

    const izquierda = contenedor.querySelector(".vida__enredadera--izq");

    if (izquierda && !contenedor.querySelector(".vida__enredadera--der")) {
        const derecha = izquierda.cloneNode(true);
        derecha.classList.remove("vida__enredadera--izq");
        derecha.classList.add("vida__enredadera--der");
        contenedor.appendChild(derecha);
    }

    const piezas = Array.from(contenedor.querySelectorAll("[data-s]")).map((el) => ({
        el,
        inicio: parseFloat(el.dataset.s) / 100,
        fin: parseFloat(el.dataset.e) / 100,
        esHoja: el.classList.contains("vida__enr-hoja")
    }));

    if (!piezas.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        piezas.forEach(({ el, esHoja }) => {
            if (esHoja) {
                el.style.opacity = 1;
                el.style.transform = "scale(1)";
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
                el.style.transform = "scale(" + (0.15 + avance * 0.85) + ")";
            } else {
                el.style.strokeDashoffset = 1 - avance;
            }
        });
    };

    let pendiente = false;

    window.addEventListener("scroll", () => {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => {
            actualizar();
            pendiente = false;
        });
    }, { passive: true });

    window.addEventListener("resize", actualizar);
    actualizar();
}
