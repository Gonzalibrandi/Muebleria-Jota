function obtenerIdDesdeURL() {
  return parseInt(new URLSearchParams(window.location.search).get("id"));
}

function renderizarDetalle(producto) {
  const articulo = document.getElementById("product-detail");
  if (!articulo) return;

  if (!producto) {
    articulo.innerHTML = `<p style="text-align:center; padding: 2rem;">Producto no encontrado.</p>`;
    return;
  }

  // Remove class that was added previously
  articulo.className = "";
  
  articulo.innerHTML = `
    <div class="pd-left">
      <span class="pd-zoom-text">Haz click para ampliar</span>
      <img src="${producto.imagen}" alt="${producto.nombre}" class="pd-image" id="pd-image">
    </div>
    <div class="pd-right">
      <div class="pd-breadcrumb">CATÁLOGO / ${producto.nombre.toUpperCase()}</div>
      <h1 class="pd-title">${producto.nombre}</h1>
      <div class="pd-price">$ ${producto.precio.toLocaleString("es-AR")}</div>
      <div class="pd-description">${producto.descripcion}</div>
      
      <div class="pd-accordion">
        <button class="pd-accordion-btn" id="pd-accordion-btn">
          <span>Ver detalles</span>
          <span class="pd-accordion-icon">+</span>
        </button>
        <div class="pd-accordion-content" id="pd-accordion-content">
          <table class="pd-accordion-table">
            <tbody>
              <tr><td>Medidas</td><td>${producto.medidas}</td></tr>
              <tr><td>Materiales</td><td>${producto.materiales}</td></tr>
              <tr><td>Acabado</td><td>${producto.acabado}</td></tr>
              <tr><td>Peso</td><td>${producto.peso}</td></tr>
              <tr><td>Adicional</td><td>${producto.caracteristica_extra}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <button class="pd-buy-btn" data-add-to-cart="${producto.id}">AÑADIR AL CARRITO</button>
    </div>
  `;

  // Interacción Lupa (Zoom)
  const leftCol = articulo.querySelector(".pd-left");
  const img = articulo.querySelector(".pd-image");
  let isZoomed = false;

  leftCol.addEventListener("click", (e) => {
    isZoomed = !isZoomed;
    if (isZoomed) {
      leftCol.classList.add("zoomed");
      updateTransformOrigin(e);
    } else {
      leftCol.classList.remove("zoomed");
      img.style.transformOrigin = "center 30%"; // Reset to default visual center
    }
  });

  leftCol.addEventListener("mousemove", (e) => {
    if (isZoomed) {
      updateTransformOrigin(e);
    }
  });
  
  leftCol.addEventListener("mouseleave", () => {
    if (isZoomed) {
      leftCol.classList.remove("zoomed");
      isZoomed = false;
      img.style.transformOrigin = "center 30%";
    }
  });

  function updateTransformOrigin(e) {
    const rect = leftCol.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }

  // Interacción Acordeón
  const accordionBtn = document.getElementById("pd-accordion-btn");
  const accordionContent = document.getElementById("pd-accordion-content");
  const accordionText = accordionBtn.querySelector("span:first-child");
  const accordionIcon = accordionBtn.querySelector(".pd-accordion-icon");
  
  accordionBtn.addEventListener("click", () => {
    const isOpen = accordionContent.classList.contains("open");
    if (isOpen) {
      accordionContent.style.maxHeight = null;
      accordionContent.classList.remove("open");
      accordionText.textContent = "Ver detalles";
      accordionIcon.textContent = "+";
    } else {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      accordionContent.classList.add("open");
      accordionText.textContent = "Ocultar detalles";
      accordionIcon.textContent = "-";
    }
  });
}

function agregarAlCarrito(producto) {
  if (typeof addToCart === "function" && producto) {
    addToCart(producto.id, 1);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productos = obtenerProductos();
  const id = obtenerIdDesdeURL() || 1; // Default a 1 para poder testear fácilmente
  const producto = productos.find((p) => p.id === id);
  
  renderizarDetalle(producto);

  const btnBuy = document.querySelector(".pd-buy-btn");
  if (btnBuy) {
    btnBuy.addEventListener("click", () => {
      agregarAlCarrito(producto);
    });
  }
});
