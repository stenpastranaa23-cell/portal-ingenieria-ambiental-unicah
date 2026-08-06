document.addEventListener("DOMContentLoaded", () => {
    let contenedor = document.getElementById("contactoMapa");
    if (!contenedor) {
        return;
    }

    let coordenadas = [14.1058135, -87.2047053];

    let mapa = L.map("contactoMapa", {
        scrollWheelZoom: false
    }).setView(coordenadas, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapa);

    let icono = L.divIcon({
        className: "contacto__mapa-marcador",
        html: "<span class=\"contacto__mapa-marcador-punto\"></span><span class=\"contacto__mapa-marcador-anillo\"></span>",
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker(coordenadas, { icon: icono })
        .addTo(mapa)
        .bindPopup("<strong>Campus Sagrado Corazón de Jesús</strong><br>Cl. Los Alcaldes, Comayagüela, Tegucigalpa")
        .openPopup();

    window.addEventListener("load", () => {
        mapa.invalidateSize();
        mapa.setView(coordenadas, 15);
    });

    window.addEventListener("resize", () => {
        mapa.invalidateSize();
    });
});
