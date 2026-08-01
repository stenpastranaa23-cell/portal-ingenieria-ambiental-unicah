/**
 * Pagina 3 - Plan de Estudio
 * Interactividad: progreso, stats, timeline, modal, lineas de requisitos
 */

(function () {
  'use strict';

  // --- CONSTANTES ---
  var TOTAL_CREDITOS = 193;
  var STORAGE_KEY = 'plan-estudio-avance';

  // --- DOM ---
  var barraProgreso = document.getElementById('barra-progreso');
  var porcentajeAvance = document.getElementById('porcentaje-avance');
  var timelineFill = document.getElementById('timeline-fill');
  var cursos = document.querySelectorAll('.plan__curso[data-creditos]');
  var statNumeros = document.querySelectorAll('.plan__stat-numero');
  var modalOverlay = document.getElementById('modal-overlay');
  var modalCerrar = document.getElementById('modal-cerrar');
  var modalSemestre = document.getElementById('modal-semestre');
  var modalNombre = document.getElementById('modal-nombre');
  var modalCreditos = document.getElementById('modal-creditos');
  var modalRequisitoValor = document.getElementById('modal-requisito-valor');
  var svgLineas = document.getElementById('lineas-svg');
  var contenedor = document.querySelector('.plan__contenedor');

  // --- MAPA INVERSO: nombre-del-curso -> [cursos que lo requieren] ---
  function construirMapaDependientes() {
    var mapa = {};
    cursos.forEach(function (curso) {
      var nombre = curso.querySelector('.plan__curso-nombre').textContent;
      var requisito = curso.dataset.requisito;
      if (requisito) {
        if (!mapa[requisito]) mapa[requisito] = [];
        mapa[requisito].push(curso);
      }
    });
    return mapa;
  }

  var mapaDependientes = construirMapaDependientes();

  // --- CARGAR PROGRESO GUARDADO ---
  function cargarProgreso() {
    try {
      var guardado = localStorage.getItem(STORAGE_KEY);
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

  // --- CALCULAR CREDITOS COMPLETADOS ---
  function calcularCreditosCompletados(avance) {
    var total = 0;
    cursos.forEach(function (curso) {
      var nombre = curso.querySelector('.plan__curso-nombre').textContent;
      var semestre = curso.closest('.plan__semestre').dataset.semestre;
      var id = semestre + '-' + nombre;
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
    var semestresCompletados = 0;

    document.querySelectorAll('.plan__semestre').forEach(function (seccion) {
      var num = seccion.dataset.semestre;
      var punto = document.querySelector('.plan__timeline-punto[data-semestre="' + num + '"]');
      if (!punto) return;

      var cursosSemestre = seccion.querySelectorAll('.plan__curso[data-creditos]');
      if (cursosSemestre.length === 0) return;

      var todosCompletados = true;
      cursosSemestre.forEach(function (curso) {
        var nombre = curso.querySelector('.plan__curso-nombre').textContent;
        var id = num + '-' + nombre;
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

    var porcentajeLinea = ((semestresCompletados - 1) / 12) * 100;
    timelineFill.style.width = Math.max(0, porcentajeLinea) + '%';
  }

  // =========================================================
  // --- LINEAS DE REQUISITOS ---
  // =========================================================

  // Obtener bordes de un curso relativa al contenedor
  function obtenerBordesCurso(curso) {
    var contenedorRect = contenedor.getBoundingClientRect();
    var cursoRect = curso.getBoundingClientRect();
    return {
      left: cursoRect.left - contenedorRect.left + contenedor.scrollLeft,
      right: cursoRect.right - contenedorRect.left + contenedor.scrollLeft,
      top: cursoRect.top - contenedorRect.top + contenedor.scrollTop,
      bottom: cursoRect.bottom - contenedorRect.top + contenedor.scrollTop,
      centerX: (cursoRect.left + cursoRect.width / 2) - contenedorRect.left + contenedor.scrollLeft,
      centerY: (cursoRect.top + cursoRect.height / 2) - contenedorRect.top + contenedor.scrollTop
    };
  }

  // Crear path tipo laberinto: sale por ABAJO del origen, entra por ARRIBA del destino
  // Usa limites de semestre como zonas seguras para los segmentos horizontales
  function crearPathLaberinto(cursoOrigen, cursoDestino) {
    var origen = obtenerBordesCurso(cursoOrigen);
    var destino = obtenerBordesCurso(cursoDestino);

    var salidaX = origen.centerX;
    var salidaY = origen.bottom;
    var entradaX = destino.centerX;
    var entradaY = destino.top;

    var canalX = 68;

    // Verificar si estan en la misma columna
    var mismaColumna = Math.abs(salidaX - entradaX) < 50;

    // Obtener numeros de semestre
    var semOrigen = parseInt(cursoOrigen.closest('.plan__semestre').dataset.semestre, 10);
    var semDestino = parseInt(cursoDestino.closest('.plan__semestre').dataset.semestre, 10);

    // Misma columna Y semestres adyacentes (sin cursos en entre) -> linea recta
    if (mismaColumna && Math.abs(semDestino - semOrigen) <= 1) {
      return 'M ' + salidaX + ' ' + salidaY +
             ' L ' + entradaX + ' ' + entradaY;
    }

    // Todos los demas casos -> rodear por el canal izquierdo
    var contenedorRect = contenedor.getBoundingClientRect();

    // Limite inferior del semestre origen (debajo de todas sus tarjetas)
    var semOrigenEl = cursoOrigen.closest('.plan__semestre');
    var semOrigenRect = semOrigenEl.getBoundingClientRect();
    var ySeguroOrigen = semOrigenRect.bottom - contenedorRect.top + contenedor.scrollTop + 8;

    // Limite superior del semestre destino (arriba de todas sus tarjetas)
    var semDestinoEl = cursoDestino.closest('.plan__semestre');
    var semDestinoRect = semDestinoEl.getBoundingClientRect();
    var ySeguroDestino = semDestinoRect.top - contenedorRect.top + contenedor.scrollTop - 8;

    // Mismo semestre o limites cruzados -> usar zona debajo de las tarjetas
    if (ySeguroOrigen >= ySeguroDestino) {
      var viaY = Math.max(salidaY, entradaY) + 35;
      return 'M ' + salidaX + ' ' + salidaY +
             ' L ' + salidaX + ' ' + viaY +
             ' L ' + canalX + ' ' + viaY +
             ' L ' + canalX + ' ' + (viaY + 30) +
             ' L ' + entradaX + ' ' + (viaY + 30) +
             ' L ' + entradaX + ' ' + entradaY;
    }

    // Ruta: bajar del origen -> zona segura -> canal -> zona segura -> destino
    return 'M ' + salidaX + ' ' + salidaY +
           ' L ' + salidaX + ' ' + ySeguroOrigen +
           ' L ' + canalX + ' ' + ySeguroOrigen +
           ' L ' + canalX + ' ' + ySeguroDestino +
           ' L ' + entradaX + ' ' + ySeguroDestino +
           ' L ' + entradaX + ' ' + entradaY;
  }

  // Dibujar linea para un curso completado
  function dibujarLineasCurso(cursoOrigen, animar) {
    var nombreOrigen = cursoOrigen.querySelector('.plan__curso-nombre').textContent;
    var dependientes = mapaDependientes[nombreOrigen];
    if (!dependientes) return;

    dependientes.forEach(function (cursoDestino) {
      if (cursoDestino === cursoOrigen) return;

      var pathD = crearPathLaberinto(cursoOrigen, cursoDestino);

      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('class', 'plan__linea-requisito');
      path.setAttribute('marker-end', 'url(#flecha)');
      path.setAttribute('data-desde', nombreOrigen);
      path.setAttribute('data-hacia', cursoDestino.querySelector('.plan__curso-nombre').textContent);

      svgLineas.appendChild(path);

      var lungime = path.getTotalLength();
      path.style.strokeDasharray = lungime;
      path.style.setProperty('--lungime', lungime);

      if (animar) {
        path.style.strokeDashoffset = lungime;
        path.getBoundingClientRect();
        path.classList.add('animando');
      } else {
        path.style.strokeDashoffset = '0';
      }
    });
  }

  // Eliminar lineas de un curso
  function eliminarLineasCurso(nombreCurso) {
    var lineas = svgLineas.querySelectorAll('[data-desde="' + nombreCurso + '"]');
    lineas.forEach(function (linea) {
      linea.classList.remove('animando');
      linea.classList.add('ocultando');
      setTimeout(function () {
        if (linea.parentNode) linea.parentNode.removeChild(linea);
      }, 300);
    });
  }

  // Redibujar TODAS las lineas (para resize)
  function redibujarTodasLasLineas(avance) {
    // Limpiar SVG
    while (svgLineas.childNodes.length > 1) {
      svgLineas.removeChild(svgLineas.lastChild);
    }

    // Dibujar lineas de todos los cursos completados
    cursos.forEach(function (curso) {
      var nombre = curso.querySelector('.plan__curso-nombre').textContent;
      var semestre = curso.closest('.plan__semestre').dataset.semestre;
      var id = semestre + '-' + nombre;
      if (avance[id]) {
        dibujarLineasCurso(curso, false);
      }
    });
  }

  // --- TOGGLE CURSO ---
  function toggleCurso(curso, avance) {
    var nombre = curso.querySelector('.plan__curso-nombre').textContent;
    var semestre = curso.closest('.plan__semestre').dataset.semestre;
    var id = semestre + '-' + nombre;

    if (avance[id]) {
      delete avance[id];
      curso.classList.remove('completado');
      eliminarLineasCurso(nombre);
    } else {
      avance[id] = true;
      curso.classList.add('completado');
      dibujarLineasCurso(curso, true);
    }

    guardarProgreso(avance);
    var creditosCompletados = calcularCreditosCompletados(avance);
    var porcentaje = (creditosCompletados / TOTAL_CREDITOS) * 100;
    actualizarBarra(porcentaje);
    actualizarTimeline(avance);
  }

  // --- ANIMAR NUMEROS DE STATS ---
  function animarStats() {
    statNumeros.forEach(function (el) {
      var objetivo = parseInt(el.dataset.objetivo, 10);
      var duracion = 1500;
      var inicio = performance.now();

      function actualizar(now) {
        var transcurrido = now - inicio;
        var progreso = Math.min(transcurrido / duracion, 1);
        var eased = 1 - (1 - progreso) * (1 - progreso);
        el.textContent = Math.round(objetivo * eased);
        if (progreso < 1) {
          requestAnimationFrame(actualizar);
        }
      }

      requestAnimationFrame(actualizar);
    });
  }

  // --- MODAL ---
  function abrirModal(curso) {
    var nombre = curso.querySelector('.plan__curso-nombre').textContent;
    var creditos = curso.dataset.creditos;
    var requisito = curso.dataset.requisito;
    var semestre = curso.closest('.plan__semestre').dataset.semestre;

    var romanos = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII'];

    modalSemestre.textContent = 'SEMESTRE ' + romanos[parseInt(semestre, 10) - 1];
    modalNombre.textContent = nombre;
    modalCreditos.textContent = creditos + ' creditos';

    if (requisito) {
      modalRequisitoValor.textContent = 'Haber aprobado ' + requisito;
      modalRequisitoValor.classList.remove('vacio');
    } else {
      modalRequisitoValor.textContent = 'Sin requisito previo';
      modalRequisitoValor.classList.add('vacio');
    }

    modalOverlay.classList.add('activo');
  }

  function cerrarModal() {
    modalOverlay.classList.remove('activo');
  }

  // --- INICIALIZAR ---
  function init() {
    var avance = cargarProgreso();

    // Restaurar estado visual de cursos completados
    cursos.forEach(function (curso) {
      var nombre = curso.querySelector('.plan__curso-nombre').textContent;
      var semestre = curso.closest('.plan__semestre').dataset.semestre;
      var id = semestre + '-' + nombre;
      if (avance[id]) {
        curso.classList.add('completado');
      }

      // Click handler
      curso.addEventListener('click', function () {
        toggleCurso(curso, avance);
      });

      // Doble click -> modal
      curso.addEventListener('dblclick', function (e) {
        e.preventDefault();
        abrirModal(curso);
      });
    });

    // Cerrar modal
    modalCerrar.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) cerrarModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarModal();
    });

    // Calcular y mostrar progreso inicial
    var creditosCompletados = calcularCreditosCompletados(avance);
    var porcentaje = (creditosCompletados / TOTAL_CREDITOS) * 100;
    actualizarBarra(porcentaje);

    // Actualizar timeline con progreso guardado
    actualizarTimeline(avance);

    // Dibujar lineas iniciales (sin animacion, desde localStorage)
    redibujarTodasLasLineas(avance);

    // Animar stats al cargar
    animarStats();

    // Scroll suave al hacer clic en el timeline
    document.querySelectorAll('.plan__timeline-punto').forEach(function (punto) {
      punto.addEventListener('click', function () {
        var semestre = punto.dataset.semestre;
        var seccion = document.querySelector('.plan__semestre[data-semestre="' + semestre + '"]');
        if (seccion) {
          seccion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Redibujar lineas en resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        redibujarTodasLasLineas(avance);
      }, 150);
    });
  }

  // Ejecutar cuando el DOM este listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
