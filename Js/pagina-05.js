document.addEventListener('DOMContentLoaded', () => {
  vidaIniciarFormacionRevelado();
});

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
