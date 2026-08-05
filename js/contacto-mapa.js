document.addEventListener("DOMContentLoaded", () => {
    let contenedor = document.getElementById("contactoMapa");
    if (!contenedor) {
        return;
    }

    let coordenadas = [14.1058135, -87.2047053];

    let mapa = L.map("contactoMapa").setView(coordenadas, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapa);

    L.marker(coordenadas)
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
