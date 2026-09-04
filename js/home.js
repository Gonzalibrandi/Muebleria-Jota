/* Página de inicio: 3–4 productos destacados en carrusel */

/* Hice cambios e unifique los codigos del Hero*/

function formatMoney(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

function renderizarDestacados(productos) {
  const contenedor = document.getElementById("featured-products");
  if (!contenedor) return;

  const destacados = productos.filter(prod => prod.destacado).slice(0, 4);

  let html = '';
  destacados.forEach(prod => {
    const priceFormatted = formatMoney(prod.precio);
    html += `
      <article class="product-card carousel-item">
        <div class="image-wrapper">
          <img src="${prod.imagen}" alt="${prod.nombre}" class="product-image" loading="lazy">
          <div class="product-overlay">
            <button class="add-to-cart-btn" aria-label="Agregar al carrito" title="Agregar al carrito" onclick="console.log('Añadir al carrito: ${prod.id}')">
              <span class="material-icons">shopping_cart</span>
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3>${prod.nombre}</h3>
          <p class="price">${priceFormatted}</p>
          <a href="producto.html?id=${prod.id}" class="details-link">VER DETALLES <span class="arrow">&rarr;</span></a>
        </div>
      </article>
    `;
  });

  contenedor.innerHTML = html;
}

function inicializarCarruselDestacados() {
  const track = document.getElementById('featured-products');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (!track || !prevBtn || !nextBtn) return;

  let isMoving = false;
  const TRANSITION_MS = 400;

  function getScrollAmount() {
    const card = track.firstElementChild;
    if (!card) return 320;
    const gap = parseInt(window.getComputedStyle(track).gap) || 32;
    return card.offsetWidth + gap;
  }

  prevBtn.addEventListener('click', () => {
    if (isMoving) return;
    isMoving = true;
    
    const itemWidth = getScrollAmount();

    track.prepend(track.lastElementChild);
    track.style.transition = 'none';
    track.style.transform = `translateX(-${itemWidth}px)`;
    
    track.offsetHeight; // Reflow
    
    track.style.transition = `transform ${TRANSITION_MS}ms ease-out`;
    track.style.transform = 'translateX(0)';

    setTimeout(() => {
      isMoving = false;
    }, TRANSITION_MS);
  });

  nextBtn.addEventListener('click', () => {
    if (isMoving) return;
    isMoving = true;
    
    const itemWidth = getScrollAmount();

    track.style.transition = `transform ${TRANSITION_MS}ms ease-out`;
    track.style.transform = `translateX(-${itemWidth}px)`;

    setTimeout(() => {
      track.style.transition = 'none';
      track.appendChild(track.firstElementChild);
      track.style.transform = 'translateX(0)';
      
      isMoving = false;
    }, TRANSITION_MS);
  });
}

/* Carrusel de Fondo / Hero */
function inicializarHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  const slideInterval = 3000; // Configurado a 3 segundos

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  let timer = setInterval(nextSlide, slideInterval);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      
      clearInterval(timer);
      timer = setInterval(nextSlide, slideInterval);
    });
  });
}

/* Inicialización General */
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Inicializar el slider de fondo del Hero
  inicializarHeroSlider();

  // 2. Cargar y renderizar productos destacados
  const spinner = document.getElementById("loading-spinner");
  const carouselContainer = document.getElementById("carousel-container");
  
  try {
    const productos = await cargarProductos();
    if (spinner) spinner.style.display = 'none';
    
    if (carouselContainer) {
      renderizarDestacados(productos);
      carouselContainer.style.display = 'flex';
      inicializarCarruselDestacados();
    }
  } catch (error) {
    console.error("Error al cargar productos destacados:", error);
    if (spinner) spinner.innerHTML = '<p>Error al cargar el catálogo. Por favor, intentá de nuevo.</p>';
  }
});