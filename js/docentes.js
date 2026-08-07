document.addEventListener("DOMContentLoaded", () => {
    const datosDocentes = {
        "osmer-ponce": {
            nombre: "Osmer Ponce",
            cargo: "Decano",
            foto: "media/docentes/decano-perfil.jpeg",
            bio: "Al frente de la facultad desde hace más de una década, defiende una ingeniería que se aprende tanto en el aula como en el campo. Llegó a la docencia después de años trabajando en gestión de cuencas para instituciones públicas, y desde entonces ha insistido en que ningún estudiante se gradúe sin haber pisado el territorio que estudia. Bajo su gestión, la facultad amplió las giras de campo y fortaleció los convenios con municipalidades e instituciones ambientales del país.",
            cita: "Al frente de la facultad desde hace más de una década, defiende una ingeniería que se aprende tanto en el aula como en el campo.",
            pasiones: [
                "El Lago de Yojoa: ahí llevó su primera gira de campo como estudiante y sigue siendo su lugar favorito para enseñar.",
                "Un diagnóstico de contaminación en el Río Choluteca que se convirtió en política pública municipal.",
                "Nunca dejes que el aula sea el límite de lo que aprendes — el territorio siempre tiene más que enseñarte."
            ]
        },
        "carmen-izaguirre": {
            nombre: "Carmen Izaguirre",
            cargo: "Catedrática de Zoología",
            foto: "media/docentes/ingCarmenI.png",
            bio: "Imparte zoología, gestión de recursos naturales y calidad de aire y suelo, guiando a los estudiantes a identificar y proteger la fauna y los ecosistemas de Honduras. Sus clases combinan trabajo de campo con análisis técnico, para que cada estudiante aprenda a leer un ecosistema antes de intervenir en él. La zoología permite entender qué especies habitan un territorio y cómo su presencia — o ausencia — revela el estado real del ambiente, mientras que la calidad de aire y suelo aporta las herramientas técnicas para medir el impacto de cualquier actividad humana sobre esos mismos ecosistemas.",
            cita: "Ningún ecosistema se protege desde un escritorio — primero hay que aprender a leerlo en el campo.",
            pasiones: [
                "Zoología: el estudio de la fauna hondureña y su papel dentro de cada ecosistema.",
                "Gestión de Recursos: cómo administrar el agua, el suelo y la biodiversidad de forma sostenible.",
                "Calidad de Aire y Suelo: los indicadores que permiten medir el impacto real de un proyecto sobre el ambiente."
            ]
        },
        "miguel-montoya": {
            nombre: "Miguel Montoya",
            cargo: "Catedrático de Hidráulica y Sanitaria",
            foto: "media/docentes/miguel-montoya.jpg",
            bio: "Enseña hidráulica, ingeniería sanitaria I y II, desechos sólidos e hidrogeología — las bases técnicas para diseñar sistemas de agua, saneamiento y manejo de residuos. Estas materias forman el núcleo de la ingeniería ambiental aplicada: sin un buen diseño hidráulico no hay agua potable confiable, sin ingeniería sanitaria no hay tratamiento adecuado de aguas residuales, y sin un manejo correcto de desechos sólidos cualquier avance ambiental se pierde. La hidrogeología, además, es clave para entender cómo se mueve y se contamina el agua subterránea.",
            cita: "Enseña las bases técnicas para diseñar sistemas de agua, saneamiento y manejo de residuos.",
            pasiones: [
                "Hidráulica: el diseño de sistemas para conducir, almacenar y distribuir agua.",
                "Sanitaria I y II: el tratamiento de agua potable y de aguas residuales.",
                "Desechos Sólidos e Hidrogeología: el manejo de residuos y el estudio del agua subterránea."
            ]
        },
        "juan-meza": {
            nombre: "Juan Meza",
            cargo: "Catedrático de SIG y Evaluación de Impacto Ambiental",
            foto: "media/docentes/juan-meza.jpg",
            bio: "Imparte Sistemas de Información Geográfica (SIG) y Evaluación de Impacto Ambiental I y II, herramientas clave para mapear el territorio y anticipar el efecto de los proyectos sobre el ambiente. El SIG permite representar y analizar información geográfica con precisión, mientras que la Evaluación de Impacto Ambiental es el proceso que identifica, previene y mitiga los efectos de un proyecto de construcción, minería o infraestructura antes de que se ejecute.",
            cita: "Enseña a mapear el territorio y anticipar el efecto de los proyectos sobre el ambiente.",
            pasiones: [
                "SIG: la tecnología para mapear, analizar y visualizar información del territorio.",
                "EIA I: cómo identificar los posibles impactos ambientales de un proyecto antes de ejecutarlo.",
                "EIA II: la evaluación y el seguimiento de las medidas de mitigación una vez el proyecto está en marcha."
            ]
        },
        "thelma-cabrera": {
            nombre: "Thelma Cabrera",
            cargo: "Catedrática de Manejo de Contaminantes",
            foto: "media/docentes/thelma-cabrera.jpg",
            bio: "Imparte manejo de contaminantes, producción limpia, planeación de proyectos y formulación y evaluación de proyectos, formando a los estudiantes para prevenir la contaminación desde el diseño mismo de los procesos. La producción limpia busca reducir residuos y emisiones desde el origen de un proceso industrial, en vez de tratarlos después, mientras que la formulación y evaluación de proyectos le da a los estudiantes las herramientas para planear soluciones ambientales técnica y financieramente viables.",
            cita: "Forma a los estudiantes para prevenir la contaminación desde el diseño mismo de los procesos.",
            pasiones: [
                "Manejo de Contaminantes: cómo identificar, controlar y reducir la contaminación en sus distintas formas.",
                "Producción Limpia: procesos industriales diseñados para generar menos residuos desde el inicio.",
                "Formulación y Evaluación de Proyectos: cómo planear un proyecto ambiental viable, de principio a fin."
            ]
        },
        "carol-elvir": {
            nombre: "Carol Elvir",
            cargo: "Catedrática de Economía Ambiental",
            foto: "media/docentes/carol-elvir.jpg",
            bio: "Enseña economía ambiental, además de energía y ambiente, mostrando cómo las decisiones económicas y energéticas impactan los recursos naturales del país. La economía ambiental estudia cómo asignar valor a los recursos naturales y cómo diseñar incentivos para su uso sostenible, mientras que energía y ambiente analiza el impacto de las distintas fuentes de energía — renovables y no renovables — sobre el entorno y la transición energética en Honduras.",
            cita: "Muestra cómo las decisiones económicas y energéticas impactan los recursos naturales del país.",
            pasiones: [
                "Economía Ambiental: cómo valorar y proteger los recursos naturales desde una perspectiva económica.",
                "Energía y Ambiente: el papel de las fuentes de energía, renovables y no renovables, en el impacto ambiental."
            ]
        },
        "mirtha-ferrari": {
            nombre: "Mirtha Ferrari",
            cargo: "Catedrática de Toxicología y Salud Ambiental",
            foto: "media/docentes/mirtha-ferrari.jpg",
            bio: "Imparte toxicología y salud, además de remediación ambiental, formando a los estudiantes para entender el efecto de los contaminantes en la salud pública y cómo revertir el daño ya causado. La toxicología ambiental estudia cómo las sustancias químicas afectan a las personas y a los ecosistemas, mientras que la remediación ambiental aporta las técnicas para limpiar suelos y cuerpos de agua contaminados y devolverlos a condiciones seguras.",
            cita: "Forma a los estudiantes para entender el efecto de los contaminantes en la salud pública.",
            pasiones: [
                "Toxicología y Salud: cómo los contaminantes afectan el cuerpo humano y la salud de las comunidades.",
                "Remediación Ambiental: las técnicas para limpiar y recuperar suelos y aguas ya contaminados."
            ]
        }
    };

    const overlay = document.getElementById("docentesOverlay");
    const tarjetas = document.querySelectorAll(".docentes__tarjeta");
    const cerrarBtn = document.getElementById("docentesCerrarBtn");

    const detalleFoto = document.getElementById("docentesDetalleFoto");
    const detalleBio = document.getElementById("docentesDetalleBio");
    const detalleCita = document.getElementById("docentesDetalleCita");
    const detallePasiones = document.getElementById("docentesDetallePasiones");
    const detalleCargo = document.getElementById("docentesDetalleCargo");
    const detalleNombre = document.getElementById("docentesDetalleNombre");

    function abrirDetalle(idDocente) {
        const docente = datosDocentes[idDocente];
        if (!docente) {
            return;
        }

        detalleFoto.src = docente.foto;
        detalleFoto.alt = docente.nombre;
        detalleFoto.classList.toggle("docentes__foto--logo", idDocente === "osmer-ponce");
        detalleBio.textContent = docente.bio;
        detalleCita.textContent = docente.cita;
        detalleCargo.textContent = docente.cargo;
        detalleNombre.textContent = docente.nombre;

        detallePasiones.innerHTML = "";
        docente.pasiones.forEach((pasion) => {
            const item = document.createElement("li");
            item.className = "docentes__detalle-pasion";
            item.textContent = pasion;
            detallePasiones.appendChild(item);
        });

        overlay.classList.add("docentes__overlay--abierto");
    }

    function cerrarDetalle() {
        overlay.classList.remove("docentes__overlay--abierto");
    }

    tarjetas.forEach((tarjeta) => {
        tarjeta.addEventListener("click", () => {
            abrirDetalle(tarjeta.dataset.docente);
        });
    });

    cerrarBtn.addEventListener("click", cerrarDetalle);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            cerrarDetalle();
        }
    });

    const menuBtn = document.getElementById("docentesMenuBtn");
    const menu = document.getElementById("docentesMenuDesplegable");

    menuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle("docentes__menu-desplegable--abierto");
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            menu.classList.remove("docentes__menu-desplegable--abierto");
        }
    });
});
