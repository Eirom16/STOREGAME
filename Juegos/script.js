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
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function performSearch() {
  const searchTerm = normalizarTexto(document.getElementById('searchBar').value.trim());
  const juegosDivs = document.querySelectorAll('.game-download');

  if (searchTerm === "") {
    // Si el campo está vacío, mostrar todos
    juegosDivs.forEach(div => {
      div.style.display = '';
      div.style.order = '0';
    });
    return;
  }

  const resultados = [];

  juegosDivs.forEach(div => {
    const tituloElem = div.querySelector('.titulo-game');
    const texto = normalizarTexto(tituloElem.textContent);

    if (texto.includes(searchTerm)) {
      let prioridad = 2;
      if (texto.startsWith(searchTerm)) prioridad = 1;
      if (texto === searchTerm) prioridad = 0;

      resultados.push({ elemento: div, prioridad });
    } else {
      div.style.display = 'none'; // Ocultar los que no coinciden
    }
  });

  if (resultados.length > 0) {
    // Mostrar y ordenar los que coinciden
    resultados.sort((a, b) => a.prioridad - b.prioridad);
    resultados.forEach((resultado, i) => {
      resultado.elemento.style.display = '';
      resultado.elemento.style.order = `${i - 1000}`;
    });

    resultados[0].elemento.scrollIntoView({ behavior: 'smooth' });
  }
}


// Eventos de búsqueda
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', performSearch); // Búsqueda en tiempo real
document.getElementById('searchButton').addEventListener('click', performSearch);
searchBar.addEventListener('keydown', function(event) {
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

  // FUNCIONES GENERALES
  function activarBotonConValor(botones, tipo, valorGuardado) {
    botones.forEach(btn => {
      const valor = btn.dataset[tipo];
      if (valor === valorGuardado) {
        btn.classList.add('activo');
      } else {
        btn.classList.remove('activo');
      }
    });
  }

  // PLATAFORMAS
  const botonesPlataforma = document.querySelectorAll('.plataforma-btn');

  botonesPlataforma.forEach(btn => {
    btn.addEventListener('click', () => {
      const valor = btn.dataset.plataforma;
      localStorage.setItem('plataformaSeleccionada', valor);
      activarBotonConValor(botonesPlataforma, 'plataforma', valor);
    });
  });

  // CATEGORÍAS
  const botonesCategoria = document.querySelectorAll('.categoria-btn');

  botonesCategoria.forEach(btn => {
    btn.addEventListener('click', () => {
      const valor = btn.dataset.categoria;
      localStorage.setItem('categoriaSeleccionada', valor);
      activarBotonConValor(botonesCategoria, 'categoria', valor);
    });
  });

  // AL CARGAR LA PÁGINA: restaurar selección
  window.addEventListener('DOMContentLoaded', () => {
    const plataformaGuardada = localStorage.getItem('plataformaSeleccionada');
    const categoriaGuardada = localStorage.getItem('categoriaSeleccionada');

    if (plataformaGuardada) {
      activarBotonConValor(botonesPlataforma, 'plataforma', plataformaGuardada);
    }

    if (categoriaGuardada) {
      activarBotonConValor(botonesCategoria, 'categoria', categoriaGuardada);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const logo = document.querySelector(".logo");
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const botonesCategoria = document.querySelectorAll(".categoria-btn");

    function toggleMenu() {
        header.classList.toggle("visible");

        // Oculta o muestra el main dependiendo del estado del header
        if (header.classList.contains("visible")) {
            main.style.display = "none";
        } else {
            main.style.display = "block";
        }
    }

    // Click en el logo
    logo.addEventListener("click", toggleMenu);

    // Click en cualquier botón de categoría
    botonesCategoria.forEach(btn => {
        btn.addEventListener("click", toggleMenu);
    });
});

