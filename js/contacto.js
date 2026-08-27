/* Contacto: validación client-side + mensaje de éxito en el DOM */

function validarFormulario(/* form */) {
  // TODO: nombre, email y mensaje; devolver { ok, errores }
}

function mostrarFeedback(/* mensaje, tipo */) {
  const feedback = document.getElementById("form-feedback");
  if (!feedback) return;

  // TODO: textContent / innerHTML según éxito o error
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    // const resultado = validarFormulario(form);
    // if (!resultado.ok) { mostrarFeedback(...); return; }
    // mostrarFeedback("Mensaje enviado. Gracias por escribirnos.", "exito");
    // form.reset();
  });
});
