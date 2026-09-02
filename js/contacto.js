/* Contacto: validación client-side + mensaje de éxito en el DOM */

function validarFormulario(form) {
  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  const mensaje = form.mensaje.value.trim();
  
  const errores = {};
  
  // Limpiar errores previos
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

  if (nombre.length < 3) {
    errores.nombre = "Por favor, ingresá tu nombre completo.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errores.email = "Por favor, ingresá un email válido.";
  }

  if (mensaje.length < 10) {
    errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  }

  // Mostrar errores si existen
  if (Object.keys(errores).length > 0) {
    if (errores.nombre) document.getElementById('error-nombre').textContent = errores.nombre;
    if (errores.email) document.getElementById('error-email').textContent = errores.email;
    if (errores.mensaje) document.getElementById('error-mensaje').textContent = errores.mensaje;
  }

  return { ok: Object.keys(errores).length === 0, errores };
}

function mostrarFeedback(mensaje, tipo) {
  const feedback = document.getElementById("form-feedback");
  if (!feedback) return;

  feedback.textContent = mensaje;
  feedback.className = tipo; // 'exito' o 'error'
  
  // Remover el mensaje después de 5 segundos
  setTimeout(() => {
    feedback.className = '';
    feedback.textContent = '';
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const resultado = validarFormulario(form);
    
    if (!resultado.ok) { 
      mostrarFeedback("Por favor, revisá los errores en el formulario.", "error"); 
      return; 
    }
    
    mostrarFeedback("Mensaje enviado con éxito. Gracias por escribirnos, te contactaremos pronto.", "exito");
    form.reset();
  });
});
