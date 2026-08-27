/* Catálogo: grilla + búsqueda (bonus) */

function crearTarjetaProducto(/* producto */) {
  // TODO: article/tarjeta con imagen, nombre, precio y link a detalle
}

function renderizarCatalogo(/* productos */) {
  const contenedor = document.getElementById("product-list");
  if (!contenedor) return;

  // TODO: vaciar contenedor y appendChild de cada tarjeta
}

function filtrarProductos(/* productos, query */) {
  // TODO: filtrar por nombre / descripción
}

document.addEventListener("DOMContentLoaded", async () => {
  // const productos = await cargarProductos();
  // renderizarCatalogo(productos);

  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    // TODO
  });

  input?.addEventListener("input", () => {
    // TODO (opcional: filtrar en vivo)
  });
});
