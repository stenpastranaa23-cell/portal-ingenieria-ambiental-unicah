document.addEventListener("DOMContentLoaded", () => {
    let boton = document.getElementById("contactoMenuBtn");
    let menu = document.getElementById("contactoMenuDesplegable");

    if (!boton || !menu) {
        return;
    }

    boton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle("contacto__menu-desplegable--abierto");
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !boton.contains(e.target)) {
            menu.classList.remove("contacto__menu-desplegable--abierto");
        }
    });
});
