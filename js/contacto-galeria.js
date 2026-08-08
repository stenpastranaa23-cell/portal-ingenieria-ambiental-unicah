document.addEventListener("DOMContentLoaded", () => {
    let fotos = document.querySelectorAll(".contacto__galeria-foto");

    fotos.forEach((foto) => {
        foto.addEventListener("click", () => {
            let yaSeleccionada = foto.classList.contains("contacto__galeria-foto--seleccionada");

            fotos.forEach((f) => {
                f.classList.remove("contacto__galeria-foto--seleccionada");
            });

            if (!yaSeleccionada) {
                foto.classList.add("contacto__galeria-foto--seleccionada");
            }
        });
    });
});
