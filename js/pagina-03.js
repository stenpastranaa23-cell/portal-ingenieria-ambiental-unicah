/**
 * Página 3 - Plan de Estudio
 * Interactividad: progreso de créditos, animación de stats, persistencia en localStorage
 */

(function () {
  'use strict';

  // --- CONSTANTES ---
  const TOTAL_CREDITOS = 193;
  const STORAGE_KEY = 'plan-estudio-avance';

  // --- DOM ---
  const barraProgreso = document.getElementById('barra-progreso');
  const porcentajeAvance = document.getElementById('porcentaje-avance');
  const timelineFill = document.getElementById('timeline-fill');
  const cursos = document.querySelectorAll('.plan__curso[data-creditos]');
  const statNumeros = document.querySelectorAll('.plan__stat-numero');

  // --- CARGAR PROGRESO GUARDADO ---
  function cargarProgreso() {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : {};
    } catch (e) {
      return {};
    }
  }

  // --- GUARDAR PROGRESO ---
  function guardarProgreso(avance) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(avance));
    } catch (e) {
      // silently fail
    }
  }

  // --- CALCULAR CRÉDITOS COMPLETADOS ---
  function calcularCreditosCompletados(avance) {
    let total = 0;
    cursos.forEach(function (curso) {
      const nombre = curso.querySelector('.plan__curso-nombre').textContent;
      const semestre = curso.closest('.plan__semestre').dataset.semestre;
      const id = semestre + '-' + nombre;
      if (avance[id]) {
        total += parseInt(curso.dataset.creditos, 10) || 0;
      }
    });
    return total;
  }

  // --- ACTUALIZAR BARRA DE PROGRESO ---
  function actualizarBarra(porcentaje) {
    barraProgreso.style.width = porcentaje + '%';
    porcentajeAvance.textContent = Math.round(porcentaje) + '%';
  }

  // --- ACTUALIZAR TIMELINE ---
  function actualizarTimeline(avance) {
    let semestresCompletados = 0;

    document.querySelectorAll('.plan__semestre').forEach(function (seccion) {
      const num = seccion.dataset.semestre;
      const punto = document.querySelector('.plan__timeline-punto[data-semestre="' + num + '"]');
      if (!punto) return;

      // Obtener todos los cursos con créditos de este semestre
      const cursosSemestre = seccion.querySelectorAll('.plan__curso[data-creditos]');
      if (cursosSemestre.length === 0) return;

      // Verificar si todos están completados
      let todosCompletados = true;
      cursosSemestre.forEach(function (curso) {
        const nombre = curso.querySelector('.plan__curso-nombre').textContent;
        const id = num + '-' + nombre;
        if (!avance[id]) {
          todosCompletados = false;
        }
      });

      if (todosCompletados) {
        punto.classList.add('completado');
        semestresCompletados++;
      } else {
        punto.classList.remove('completado');
      }
    });

    // Calcular porcentaje de la línea (12 segmentos entre 13 puntos)
    // 1 semestre = 0% (en el primer punto), 13 semestres = 100% (en el último)
    const porcentajeLinea = ((semestresCompletados - 1) / 12) * 100;
    timelineFill.style.width = Math.max(0, porcentajeLinea) + '%';
  }

  // --- TOGGLE CURSO ---
  function toggleCurso(curso, avance) {
    const nombre = curso.querySelector('.plan__curso-nombre').textContent;
    const semestre = curso.closest('.plan__semestre').dataset.semestre;
    const id = semestre + '-' + nombre;

    if (avance[id]) {
      delete avance[id];
      curso.classList.remove('completado');
    } else {
      avance[id] = true;
      curso.classList.add('completado');
    }

    guardarProgreso(avance);
    const creditosCompletados = calcularCreditosCompletados(avance);
    const porcentaje = (creditosCompletados / TOTAL_CREDITOS) * 100;
    actualizarBarra(porcentaje);
    actualizarTimeline(avance);
  }

  // --- ANIMAR NÚMEROS DE STATS ---
  function animarStats() {
    statNumeros.forEach(function (el) {
      const objetivo = parseInt(el.dataset.objetivo, 10);
      const duracion = 1500;
      const inicio = performance.now();

      function actualizar(now) {
        const transcurrido = now - inicio;
        const progreso = Math.min(transcurrido / duracion, 1);
        // ease-out quad
        const eased = 1 - (1 - progreso) * (1 - progreso);
        el.textContent = Math.round(objetivo * eased);
        if (progreso < 1) {
          requestAnimationFrame(actualizar);
        }
      }

      requestAnimationFrame(actualizar);
    });
  }

  // --- INICIALIZAR ---
  function init() {
    const avance = cargarProgreso();

    // Restaurar estado visual de cursos completados
    cursos.forEach(function (curso) {
      const nombre = curso.querySelector('.plan__curso-nombre').textContent;
      const semestre = curso.closest('.plan__semestre').dataset.semestre;
      const id = semestre + '-' + nombre;
      if (avance[id]) {
        curso.classList.add('completado');
      }

      // Click handler
      curso.addEventListener('click', function () {
        toggleCurso(curso, avance);
      });
    });

    // Calcular y mostrar progreso inicial
    const creditosCompletados = calcularCreditosCompletados(avance);
    const porcentaje = (creditosCompletados / TOTAL_CREDITOS) * 100;
    actualizarBarra(porcentaje);

    // Actualizar timeline con progreso guardado
    actualizarTimeline(avance);

    // Animar stats al cargar
    animarStats();

    // Scroll suave al hacer clic en el timeline
    document.querySelectorAll('.plan__timeline-punto').forEach(function (punto) {
      punto.addEventListener('click', function () {
        const semestre = punto.dataset.semestre;
        const seccion = document.querySelector('.plan__semestre[data-semestre="' + semestre + '"]');
        if (seccion) {
          seccion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
