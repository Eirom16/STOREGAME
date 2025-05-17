// Asegúrate de que este archivo se carga después de que las variables de juegos estén disponibles

// Variables de filtros activos
let filtroCategoria = "Todos";
let filtroPlataforma = "Todos";
let paginaActual = 1;

// Combinar todos los juegos
let juegos = {};
if (typeof juegosPC !== "undefined") Object.assign(juegos, juegosPC);
if (typeof juegosPS2 !== "undefined") Object.assign(juegos, juegosPS2);
if (typeof juegosPS3 !== "undefined") Object.assign(juegos, juegosPS3);
if (typeof juegosPSP !== "undefined") Object.assign(juegos, juegosPSP);
if (typeof juegosNDS !== "undefined") Object.assign(juegos, juegosNDS);
if (typeof juegosXbox_360 !== "undefined") Object.assign(juegos, juegosXbox_360);

// Función para realizar la búsqueda
function performSearch() {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  const items = document.querySelectorAll('main h3');

  let foundItem = null;
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      foundItem = item;
    }
  });

  if (foundItem) {
    const parent = foundItem.parentElement;
    parent.style.order = '-1';
    parent.scrollIntoView({ behavior: 'smooth' });
  }
}

// Eventos de búsqueda
document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('searchBar').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') performSearch();
});

// Mostrar juegos según filtros
function mostrarJuegos() {
  const contenedor = document.querySelector(".content-main");
  contenedor.innerHTML = "";

  const juegosFiltrados = Object.entries(juegos).filter(([id, juego]) => {
    const coincideCategoria = filtroCategoria === "Todos" || juego.categoria === filtroCategoria;
    const coincidePlataforma = filtroPlataforma === "Todos" || juego.plataforma === filtroPlataforma;
    return coincideCategoria && coincidePlataforma;
  });

  const filasPorPagina = 15;
  const juegosPorFila = 4;
  const juegosPorPagina = filasPorPagina * juegosPorFila;
  const totalPaginas = Math.ceil(juegosFiltrados.length / juegosPorPagina);
  const inicio = (paginaActual - 1) * juegosPorPagina;
  const juegosPagina = juegosFiltrados.slice(inicio, inicio + juegosPorPagina);

  let fila = document.createElement("div");
  fila.classList.add("filas");

  juegosPagina.forEach(([id, juego], index) => {
    const juegoDiv = document.createElement("div");
    juegoDiv.classList.add("game-download");
    juegoDiv.innerHTML = `
      <a href="Informacion/HTML/informacion.html?id=${id}">
        <img class="portada" src="${juego.imagen}" alt="${juego.titulo}">
        <p class="titulo-game">${juego.titulo}</p>
      </a>
    `;
    fila.appendChild(juegoDiv);

    if ((index + 1) % juegosPorFila === 0) {
      contenedor.appendChild(fila);
      fila = document.createElement("div");
      fila.classList.add("filas");
    }
  });

  if (fila.children.length > 0) contenedor.appendChild(fila);

  mostrarControles(totalPaginas);
}

// Controles de filtros
document.querySelectorAll('.categorias button').forEach(button => {
  button.addEventListener('click', () => {
    filtroCategoria = button.dataset.categoria || "Todos";
    paginaActual = 1;
    mostrarJuegos();
  });
});

document.querySelectorAll('.caja-plataformas button').forEach(button => {
  button.addEventListener('click', () => {
    filtroPlataforma = button.dataset.plataforma || "Todos";
    paginaActual = 1;
    mostrarJuegos();
  });
});

// Paginación
function mostrarControles(totalPaginas) {
  const antiguo = document.querySelector(".paginacion");
  if (antiguo) antiguo.remove();

  const paginacion = document.createElement("div");
  paginacion.className = "paginacion";
  paginacion.style.textAlign = "center";
  paginacion.style.marginTop = "20px";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "← Anterior";
  btnAnterior.className = "btn-paginacion anterior";
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.onclick = () => {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarJuegos();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const textoPagina = document.createElement("span");
  textoPagina.className = "texto-pagina";
  textoPagina.textContent = ` Página ${paginaActual} de ${totalPaginas} `;

  const btnSiguiente = document.createElement("button");
  btnSiguiente.textContent = "Siguiente →";
  btnSiguiente.className = "btn-paginacion siguiente";
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.onclick = () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarJuegos();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  paginacion.appendChild(btnAnterior);
  paginacion.appendChild(textoPagina);
  paginacion.appendChild(btnSiguiente);

  document.querySelector(".content-main").appendChild(paginacion);
}

// Mostrar al cargar (después de unir todos los juegos)
if (Object.keys(juegos).length > 0) {
  mostrarJuegos();
} else {
  console.error("No se han cargado los juegos.");
}