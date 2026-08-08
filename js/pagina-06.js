
const galeriaFotos = [
  'IMG_3068.JPG.jpg',
  'galeria-05.jpg',
  'galeria-14.jpeg',
  'galeria-15.jpg',
  'IMG_3053.JPG.jpg',
  'IMG_3055.JPG (1).jpg',
  'IMG_3069.JPG (1).jpg',
  'galeria-01.jpg',
  'IMG_3060.JPG.jpg',
  'IMG_3057.JPG.jpg',
  'IMG_3058.JPG.jpg',
  'galeria-02.jpeg',
  'galeria-14.jpeg',
  'galeria-15.jpg',
  'galeria-16.jpeg',
  'galeria-17.jpg',
  'IMG_4953.JPG.jpeg',
  'galeria-11.jpeg',
  'galeria-03.jpg',
  'galeria-12.jpg',
  'galeria-13.jpeg',
  'galeria-18.jpeg',
  'galeria-04.jpg',
  'galeria-06.jpg',
  'galeria-07.jpg',
  'galeria-08.jpg',
  'galeria-09.jpg',
  'galeria-10.jpeg',
  'IMG_3050.JPG.jpg',
  'galeria-19.jpg'
];

function galeriaGenerarGrid() {
  const contenedor = document.getElementById('galeria-grid');
  if (!contenedor) return;

  galeriaFotos.forEach((archivo, indice) => {
    const img = document.createElement('img');
    img.src = `../Imagenes/Galeria/${archivo}`;
    img.alt = '';
    img.classList.add('galeria__item');

    // Distribución estilo Zara para el mosaico:
    // Índices horizontales (ancho completo)
    if (indice === 2 || indice === 8 || indice === 15) {
      img.classList.add('galeria__item--horizontal');
    } 
    // Índices verticales (2 filas de alto)
    else if (indice === 1 || indice === 5 || indice === 12) {
      img.classList.add('galeria__item--vertical');
    }

    contenedor.appendChild(img);
  });
}

function galeriaIniciarLightbox() {
  const items = document.querySelectorAll('.galeria__item');
  const lightbox = document.getElementById('galeria-lightbox');
  const imagenGrande = document.getElementById('galeria-imagen-grande');
  const btnCerrar = document.getElementById('galeria-cerrar');
  const btnAnterior = document.getElementById('galeria-anterior');
  const btnSiguiente = document.getElementById('galeria-siguiente');

  if (items.length === 0) return;

  let galeriaIndiceActual = 0;

  function galeriaMostrar(indice) {
    galeriaIndiceActual = (indice + items.length) % items.length;
    imagenGrande.src = items[galeriaIndiceActual].src;
  }

  function galeriaAbrir(indice) {
    galeriaMostrar(indice);
    lightbox.classList.add('galeria__lightbox--abierto');
  }

  function galeriaCerrar() {
    lightbox.classList.remove('galeria__lightbox--abierto');
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => galeriaAbrir(i));
  });

  btnCerrar.addEventListener('click', galeriaCerrar);
  btnAnterior.addEventListener('click', () => galeriaMostrar(galeriaIndiceActual - 1));
  btnSiguiente.addEventListener('click', () => galeriaMostrar(galeriaIndiceActual + 1));

  lightbox.addEventListener('click', (evento) => {
    if (evento.target === lightbox) galeriaCerrar();
  });

  document.addEventListener('keydown', (evento) => {
    if (!lightbox.classList.contains('galeria__lightbox--abierto')) return;
    if (evento.key === 'Escape') galeriaCerrar();
    if (evento.key === 'ArrowLeft') galeriaMostrar(galeriaIndiceActual - 1);
    if (evento.key === 'ArrowRight') galeriaMostrar(galeriaIndiceActual + 1);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  galeriaGenerarGrid();
  galeriaIniciarLightbox();
});