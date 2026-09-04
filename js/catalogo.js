/* Catálogo: grilla + búsqueda (bonus) */

function formatMoney(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}


function crearTarjetaProducto(producto) {
  const article = document.createElement("article");
  article.classList.add("product-card");


  const priceFormatted = formatMoney(producto.precio);


  article.innerHTML = `
    <div class="image-wrapper">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" loading="lazy">
      <div class="product-overlay">
        <button class="add-to-cart-btn" data-id="${producto.id}" aria-label="Agregar al carrito" title="Agregar al carrito">
          <span class="material-icons">shopping_cart</span>
        </button>
      </div>
    </div>
    <div class="product-info">
      <h3>${producto.nombre}</h3>
      <p class="price">${priceFormatted}</p>
      <a href="producto.html?id=${producto.id}" class="details-link">VER DETALLES <span class="arrow">&rarr;</span></a>
    </div>
  `;

  return article;
}


function renderizarCatalogo(productos) {
  const contenedor = document.getElementById("product-list");
  if (!contenedor) return;

  contenedor.innerHTML = "";


  productos.forEach(producto => {
    const card = crearTarjetaProducto(producto);
    contenedor.appendChild(card);
  });
}

function filtrarProductos(productos, query) {
  const termino = query.toLowerCase().trim();
  return productos.filter(producto =>
    producto.nombre.toLowerCase().includes(termino)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const productos = obtenerProductos();
  renderizarCatalogo(productos);

  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");


  form?.addEventListener("submit", (event) => {
    event.preventDefault();
  });


  input?.addEventListener("input", (event) => {
    const query = event.target.value;
    const productosFiltrados = filtrarProductos(productos, query);
    renderizarCatalogo(productosFiltrados);
  });
});
