/* Detalle de producto: ?id=  +  Añadir al carrito */

function obtenerIdDesdeURL() {
  // TODO: new URLSearchParams(window.location.search).get("id")
}

function renderizarDetalle(/* producto */) {
  const articulo = document.getElementById("product-detail");
  if (!articulo) return;

  // TODO: imagen grande, descripción, fabricación, precio, botón
}

function agregarAlCarrito(/* producto */) {
  // TODO: incrementar contador y persistir
}

document.addEventListener("DOMContentLoaded", async () => {
  // const productos = await cargarProductos();
  // const id = obtenerIdDesdeURL();
  // const producto = productos.find((p) => p.id === id);
  // renderizarDetalle(producto);

  // document.querySelector("[data-add-to-cart]")?.addEventListener("click", () => {
  //   agregarAlCarrito(producto);
  // });
});
