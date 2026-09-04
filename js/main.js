/* Lógica compartida: carrito simulado, carga asíncrona, helpers DOM */

const CART_STORAGE_KEY = "hermanos_jota_cart";

// Estado global del carrito en memoria
let cart = [];

/** Formateador de moneda en estándar es-AR */
function formatMoney(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

/** Carga el carrito desde localStorage */
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    cart = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(cart)) cart = [];
  } catch (err) {
    console.error('Error al cargar el carrito:', err);
    cart = [];
  }
}

/** Guarda el carrito actual en localStorage */
function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Error al guardar el carrito:', err);
  }
}

/** Abre el drawer lateral del carrito */
function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  }
  if (overlay) {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }
  document.body.classList.add('cart-open');
}

/** Cierra el drawer lateral del carrito */
function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('cart-open');
}

/**
 * Agrega un producto al carrito y actualiza localStorage y vista.
 * Si ya existe, incrementa la cantidad.
 */
function addToCart(productId, quantity = 1) {
  const id = Number(productId);
  const qty = Number(quantity) || 1;
  if (isNaN(id) || qty <= 0) return;

  const productos = typeof obtenerProductos === 'function' ? obtenerProductos() : (typeof PRODUCTOS !== 'undefined' ? PRODUCTOS : []);
  const producto = productos.find(p => p.id === id);

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += qty;
  } else if (producto) {
    cart.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      quantity: qty
    });
  } else {
    console.warn(`Producto con ID ${id} no encontrado en el catálogo.`);
    return;
  }

  saveCart();
  renderCart();
  openCart();
}

/**
 * Modifica la cantidad de un ítem (+1 o -1).
 * Si llega a 0, elimina el ítem.
 */
function updateQuantity(productId, delta) {
  const id = Number(productId);
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart();
  renderCart();
}

/**
 * Elimina un producto individual del carrito.
 */
function removeFromCart(productId) {
  const id = Number(productId);
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

/**
 * Vacía todo el carrito.
 */
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

/**
 * Renderiza dinámicamente los elementos en el HTML, actualiza el total y el badge del header.
 */
function renderCart() {
  const itemsContainer = document.getElementById('cart-items');
  const countBadge = document.getElementById('cart-count');
  const totalElement = document.getElementById('cart-total');
  const clearBtn = document.getElementById('cart-clear-btn');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  // Cantidad total de productos para el badge
  const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  if (countBadge) {
    countBadge.textContent = totalCount;
  }

  // Total en dinero
  const totalAmount = cart.reduce((acc, item) => acc + ((item.precio || 0) * (item.quantity || 0)), 0);
  if (totalElement) {
    totalElement.textContent = formatMoney(totalAmount);
  }

  const isEmpty = cart.length === 0;
  if (clearBtn) clearBtn.disabled = isEmpty;
  if (checkoutBtn) checkoutBtn.disabled = isEmpty;

  if (!itemsContainer) return;

  if (isEmpty) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon-wrap">
          <span class="material-icons">shopping_bag</span>
        </div>
        <p class="cart-empty-title">Tu carrito está vacío</p>
        <p class="cart-empty-desc">Explorá nuestras piezas artesanales de estética mid-century modern.</p>
        <a href="productos.html" class="cart-empty-link">Ver Colección</a>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <article class="cart-item" data-id="${item.id}">
      <div class="cart-item-img-wrap">
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img" loading="lazy">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-header">
          <h3 class="cart-item-name">${item.nombre}</h3>
          <button type="button" class="cart-item-delete" data-id="${item.id}" aria-label="Eliminar ${item.nombre}" title="Eliminar ítem">
            <span class="material-icons">delete_outline</span>
          </button>
        </div>
        <p class="cart-item-unit-price">${formatMoney(item.precio)}</p>
        <div class="cart-item-footer">
          <div class="cart-qty-control" role="group" aria-label="Control de cantidad">
            <button type="button" class="cart-qty-btn cart-qty-minus" data-id="${item.id}" aria-label="Restar una unidad">
              <span class="material-icons">remove</span>
            </button>
            <span class="cart-qty-value">${item.quantity}</span>
            <button type="button" class="cart-qty-btn cart-qty-plus" data-id="${item.id}" aria-label="Sumar una unidad">
              <span class="material-icons">add</span>
            </button>
          </div>
          <div class="cart-item-subtotal">
            <span class="cart-item-subtotal-val">${formatMoney(item.precio * item.quantity)}</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

/** Garantiza que el overlay y el drawer existan en el DOM */
function asegurarEstructuraCarrito() {
  if (!document.getElementById('cart-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.className = 'cart-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }

  if (!document.getElementById('cart-drawer')) {
    const drawer = document.createElement('aside');
    drawer.id = 'cart-drawer';
    drawer.className = 'cart-drawer';
    drawer.setAttribute('aria-label', 'Carrito de compras');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <div class="cart-header-title">
          <h2>Tu Carrito</h2>
          <span class="cart-header-subtitle">Hermanos Jota</span>
        </div>
        <button id="cart-close-btn" class="cart-close-btn" aria-label="Cerrar carrito">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div id="cart-items" class="cart-items"></div>

      <div class="cart-drawer-footer">
        <div class="cart-summary">
          <div class="cart-summary-row">
            <span>Total:</span>
            <span id="cart-total" class="cart-total-amount">$ 0</span>
          </div>
          <p class="cart-shipping-note">Impuestos incluidos. Envío coordinado tras la compra.</p>
        </div>
        <div class="cart-drawer-actions">
          <button id="cart-clear-btn" class="btn-cart-clear" type="button">Vaciar Carrito</button>
          <button id="cart-checkout-btn" class="btn-cart-checkout" type="button">Finalizar Compra</button>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  }
}

/** Inicializa oyentes de eventos del carrito y botones del catálogo */
function inicializarEventosCarrito() {
  asegurarEstructuraCarrito();

  // Abrir carrito desde el widget del header
  const cartWidget = document.querySelector('.cart-widget');
  if (cartWidget) {
    cartWidget.setAttribute('role', 'button');
    cartWidget.setAttribute('tabindex', '0');
    cartWidget.setAttribute('aria-label', 'Abrir carrito');
    cartWidget.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
    cartWidget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCart();
      }
    });
  }

  // Cerrar carrito desde el botón X
  const closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCart);
  }

  // Cerrar carrito desde el overlay
  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCart);
  }

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
    }
  });

  // Delegación de eventos para controles dentro de #cart-items (+, -, eliminar)
  const itemsContainer = document.getElementById('cart-items');
  if (itemsContainer) {
    itemsContainer.addEventListener('click', (e) => {
      const minusBtn = e.target.closest('.cart-qty-minus');
      if (minusBtn) {
        const id = Number(minusBtn.dataset.id);
        updateQuantity(id, -1);
        return;
      }

      const plusBtn = e.target.closest('.cart-qty-plus');
      if (plusBtn) {
        const id = Number(plusBtn.dataset.id);
        updateQuantity(id, 1);
        return;
      }

      const deleteBtn = e.target.closest('.cart-item-delete');
      if (deleteBtn) {
        const id = Number(deleteBtn.dataset.id);
        removeFromCart(id);
        return;
      }
    });
  }

  // Botón Vaciar Carrito
  const clearBtn = document.getElementById('cart-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (cart.length > 0 && confirm('¿Deseas vaciar todos los productos del carrito?')) {
        clearCart();
      }
    });
  }

  // Botón Finalizar Compra
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      alert('¡Gracias por elegir Hermanos Jota! En breve te contactaremos para coordinar la entrega de tus piezas.');
    });
  }

  // Conectar el evento 'click' de todos los botones .add-to-cart-btn y .pd-buy-btn
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn, .pd-buy-btn');
    if (!btn) return;

    e.preventDefault();
    let productId = btn.dataset.id || btn.dataset.productId || btn.dataset.addToCart;

    // Si el botón no contiene data-id explícito, intentar resolverlo desde la tarjeta o enlace cercano
    if (!productId) {
      const card = btn.closest('.product-card, #product-detail');
      if (card) {
        const link = card.querySelector('a[href*="id="]');
        if (link) {
          const match = link.href.match(/id=(\d+)/);
          if (match) productId = match[1];
        }
      }
    }

    if (productId) {
      addToCart(productId, 1);
    }
  });
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
  loadCart();
  renderCart();
  inicializarEventosCarrito();
});
