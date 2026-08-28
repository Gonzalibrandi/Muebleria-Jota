/* Lógica compartida: carrito simulado, carga asíncrona, helpers DOM */

const CART_STORAGE_KEY = "hermanos-jota-carrito";

function obtenerCarrito() {
  // TODO: leer cantidad desde localStorage (o variable en memoria)
}

function guardarCarrito(/* cantidad */) {
  // TODO
}

function actualizarContadorCarrito() {
  // TODO: escribir en #cart-count
}

/** Simula una petición asíncrona al catálogo local */
async function cargarProductos() {
  // TODO: setTimeout + Promise / async-await
  // return PRODUCTOS;
}

function paginaActual() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function renderizarLayout() {
  const pagina = paginaActual();
  const header = document.querySelector(".site-header");
  const footer = document.querySelector(".site-footer");

  if (header) {
    header.innerHTML = `
      <a href="index.html" class="logo" aria-label="Hermanos Jota — Inicio">
        <img src="img/logo.svg" alt="Hermanos Jota" width="120" height="120" />
      </a>
      <nav class="site-nav" aria-label="Principal">
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="productos.html">Catálogo</a></li>
          <li><a href="contacto.html">Contacto</a></li>
        </ul>
      </nav>
      <div class="cart-widget" aria-live="polite" aria-label="Carrito">
        <span class="material-icons" aria-hidden="true">shopping_cart</span>
        <span id="cart-count">0</span>
      </div>
    `;

    header.querySelectorAll(".site-nav a").forEach((link) => {
      const href = link.getAttribute("href");
      const esActual =
        href === pagina || (pagina === "producto.html" && href === "productos.html");
      if (esActual) link.setAttribute("aria-current", "page");
    });
  }

  if (footer) {
    footer.innerHTML = `
      <p>Hermanos Jota Casa Taller — Av. San Juan 2847, San Cristóbal, CABA</p>
      <p>info@hermanosjota.com.ar · +54 11 4567-8900</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarLayout();
  actualizarContadorCarrito();
});
