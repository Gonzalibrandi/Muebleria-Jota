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
  return new Promise((resolve) => {
    // Simular un retraso de red de 1.5 segundos
    setTimeout(() => {
      resolve(obtenerProductos());
    }, 1500);
  });
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
        <img src="img/logo.svg" alt="Hermanos Jota" width="120" />
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
      <div class="footer-grid">
        <div class="footer-col">
          <h4>Showroom y Taller</h4>
          <p>Hermanos Jota — Casa Taller</p>
          <p>Av. San Juan 2847</p>
          <p>C1232AAB — Barrio de San Cristóbal</p>
          <p>Ciudad Autónoma de Buenos Aires, Argentina</p>
        </div>
        <div class="footer-col">
          <h4>Horarios</h4>
          <p>Lunes a Viernes: 10:00 - 19:00</p>
          <p>Sábados: 10:00 - 14:00</p>
        </div>
        <div class="footer-col">
          <h4>Contacto Digital</h4>
          <p><span class="material-icons">language</span> <a href="https://www.hermanosjota.com.ar" target="_blank">www.hermanosjota.com.ar</a></p>
          <p><span class="material-icons">email</span> <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a></p>
          <p><span class="material-icons">shopping_bag</span> <a href="mailto:ventas@hermanosjota.com.ar">ventas@hermanosjota.com.ar</a></p>
          <p><span class="material-icons">camera_alt</span> <a href="https://instagram.com/hermanosjota_ba" target="_blank">@hermanosjota_ba</a></p>
          <p><span class="material-icons">chat</span> <a href="https://wa.me/541145678900" target="_blank">+54 11 4567-8900</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Hermanos Jota. Todos los derechos reservados.</p>
        <p>Este sitio es propiedad de Hermanos Jota Muebles.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarLayout();
  actualizarContadorCarrito();
});
