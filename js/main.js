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

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
});
