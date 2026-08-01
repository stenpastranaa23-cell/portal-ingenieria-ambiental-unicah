/**
 * Página 3 - Plan de Estudio
 * Interactividad: progreso, stats, timeline, modal, líneas de requisitos
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

  // --- MAPA INVERSO: nombre-del-curso → [cursos que lo requieren] ---
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

  // --- CALCULAR CRÉDITOS COMPLETADOS ---
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
  // --- LÍNEAS DE REQUISITOS ---
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
      centerY: (cursoRect.top + cursoRect.height / 2) - contenedorRect.top + contenedor.scrollTop
    };
  }

  // Obtener el borde derecho del contenedor de cursos de un semestre
  function obtenerBordeDerechoSemestre(curso) {
    var seccion = curso.closest('.plan__semestre');
    var cursosContainer = seccion.querySelector('.plan__cursos');
    var contenedorRect = contenedor.getBoundingClientRect();
    var cursosRect = cursosContainer.getBoundingClientRect();
    return cursosRect.right - contenedorRect.left + contenedor.scrollLeft;
  }

  // Obtener el espacio entre semestres (centro del border-bottom)
  function obtenerEspacioSemestre(seccionA, seccionB) {
    var contenedorRect = contenedor.getBoundingClientRect();
    var rectA = seccionA.getBoundingClientRect();
    var rectB = seccionB.getBoundingClientRect();
    // Centro exacto entre el final de A y el inicio de B
    return (rectA.bottom + rectB.top) / 2 - contenedorRect.top + contenedor.scrollTop;
  }

  // Crear path tipo laberinto (orthogonal routing)
  function crearPathLaberinto(cursoOrigen, cursoDestino) {
    var origen = obtenerBordesCurso(cursoOrigen);
    var destino = obtenerBordesCurso(cursoDestino);
    var seccionOrigen = cursoOrigen.closest('.plan__semestre');
    var seccionDestino = cursoDestino.closest('.plan__semestre');
    var numOrigen = parseInt(seccionOrigen.dataset.semestre, 10);
    var numDestino = parseInt(seccionDestino.dataset.semestre, 10);

    var puntos = [];

    if (numOrigen === numDestino) {
      // Misma fila: salir por la derecha del origen, bajar, subir, entrar por la derecha del destino
      var salidaX = origen.right + 12;
      var bordeDerecho = obtenerBordeDerechoSemestre(cursoOrigen);
      var viaX = Math.max(bordeDerecho + 15, Math.max(origen.right, destino.right) + 25);
      var viaY = Math.max(origen.bottom, destino.bottom) + 18;

      puntos.push(origen.right, origen.centerY);
      puntos.push(salidaX, origen.centerY);
      puntos.push(viaX, origen.centerY);
      puntos.push(viaX, viaY);
      puntos.push(viaX, destino.centerY);
      puntos.push(destino.right + 12, destino.centerY);
      puntos.push(destino.right, destino.centerY);
    } else {
      // Filas diferentes: salir derecha → bajar por el borde derecho → entrar al destino
      var salidaX2 = origen.right + 12;
      var bordeDerecho2 = obtenerBordeDerechoSemestre(cursoOrigen);
      var viaX2 = Math.max(bordeDerecho2 + 15, origen.right + 25);

      // Espacio vertical entre semestres
      var espacioY;
      if (numDestino > numOrigen) {
        // Bajar: usar el espacio justo después del semestre origen
        var semestreSiguiente = document.querySelector('.plan__semestre[data-semestre="' + (numOrigen + 1) + '"]');
        if (semestreSiguiente) {
          espacioY = obtenerEspacioSemestre(seccionOrigen, semestreSiguiente);
        } else {
          espacioY = (origen.bottom + destino.top) / 2;
        }
      } else {
        // Subir: usar el espacio justo antes del semestre origen
        var semestreAnterior = document.querySelector('.plan__semestre[data-semestre="' + (numOrigen - 1) + '"]');
        if (semestreAnterior) {
          espacioY = obtenerEspacioSemestre(semestreAnterior, seccionOrigen);
        } else {
          espacioY = (origen.top + destino.bottom) / 2;
        }
      }

      // Punto de entrada al destino
      var entradaX = destino.right + 12;

      puntos.push(origen.right, origen.centerY);
      puntos.push(salidaX2, origen.centerY);
      puntos.push(viaX2, origen.centerY);
      puntos.push(viaX2, espacioY);
      puntos.push(entradaX, espacioY);
      puntos.push(entradaX, destino.centerY);
      puntos.push(destino.right, destino.centerY);
    }

    // Construir path M ... L ... L ...
    var d = 'M ' + puntos[0] + ' ' + puntos[1];
    for (var i = 2; i < puntos.length; i += 2) {
      d += ' L ' + puntos[i] + ' ' + puntos[i + 1];
    }
    return d;
  }

  // Dibujar línea para un curso completado
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

  // Eliminar líneas de un curso
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

  // Redibujar TODAS las líneas (para resize)
  function redibujarTodasLasLineas(avance) {
    // Limpiar SVG
    while (svgLineas.childNodes.length > 1) {
      svgLineas.removeChild(svgLineas.lastChild);
    }

    // Dibujar líneas de todos los cursos completados
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

  // --- ANIMAR NÚMEROS DE STATS ---
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
    modalCreditos.textContent = creditos + ' créditos';

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

      // Doble click → modal
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

    // Dibujar líneas iniciales (sin animación, desde localStorage)
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

    // Redibujar líneas en resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        redibujarTodasLasLineas(avance);
      }, 150);
    });
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
