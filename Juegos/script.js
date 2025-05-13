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
        parent.style.order = '-1';  // Mueve el elemento encontrado a la primera posición
        parent.scrollIntoView({ behavior: 'smooth' });  // Desplázate hacia el elemento
    }
}

// Evento click en el botón de búsqueda
document.getElementById('searchButton').addEventListener('click', performSearch);

// Evento para activar la búsqueda con la tecla "Enter"
document.getElementById('searchBar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});
