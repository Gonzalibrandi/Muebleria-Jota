/* Página de inicio: 3–4 productos destacados */

/* Página de inicio: 3–4 productos destacados */

function renderizarDestacados(productos) {
  const contenedor = document.getElementById("featured-products");
  if (!contenedor) return;

  const destacados = productos.filter(prod => prod.destacado).slice(0, 4);

  let html = '';
  destacados.forEach(prod => {
    html += `
      <article class="product-card">
        <div class="image-wrapper">
          <img src="${prod.imagen}" alt="${prod.nombre}" class="product-image" loading="lazy">
          <div class="product-overlay">
            <button class="add-to-cart-btn" aria-label="Añadir ${prod.nombre} al carrito" onclick="console.log('Añadir al carrito: ${prod.id}')">
              <span class="material-icons">add_shopping_cart</span>
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3>${prod.nombre}</h3>
          <p class="price">$ ${prod.precio.toLocaleString('es-AR')}</p>
          <a href="producto.html?id=${prod.id}" class="details-link">
            Ver detalles <span class="arrow material-icons">arrow_forward</span>
          </a>
        </div>
      </article>
    `;
  });

  contenedor.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  const spinner = document.getElementById("loading-spinner");
  const contenedor = document.getElementById("featured-products");
  
  try {
    const productos = await cargarProductos();
    if (spinner) spinner.style.display = 'none';
    if (contenedor) {
      renderizarDestacados(productos);
      contenedor.style.display = 'grid'; // Mostrar grilla después de cargar
    }
  } catch (error) {
    console.error("Error al cargar productos destacados:", error);
    if (spinner) spinner.innerHTML = '<p>Error al cargar el catálogo. Por favor, intentá de nuevo.</p>';
  }
});
