const elementosAnimados = document.querySelectorAll(".animar");

function mostrarElementos() {
    elementosAnimados.forEach(elemento => {
        const posicion = elemento.getBoundingClientRect().top;
        const alturaPantalla = window.innerHeight;

        if (posicion < alturaPantalla - 100) {
            elemento.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", mostrarElementos);
window.addEventListener("load", mostrarElementos);

const formulario = document.getElementById("formDonacion");
const modal = document.getElementById("modalConfirmacion");
const resumen = document.getElementById("resumenDonacion");
const btnWhatsApp = document.getElementById("btnWhatsApp");

let mensajeWhatsApp = "";

if (formulario) {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const tipo = document.getElementById("tipo").value;
        const descripcion = document.getElementById("descripcion").value.trim();
        const cantidad = document.getElementById("cantidad").value.trim();
        const fecha = document.getElementById("fecha").value;

        if (nombre.length < 3) {
            alert("Por favor escribe un nombre válido.");
            return;
        }

        if (telefono.length < 8) {
            alert("Por favor escribe un teléfono válido.");
            return;
        }

        if (descripcion.length < 5) {
            alert("Describe un poco mejor tu donación.");
            return;
        }

        resumen.innerHTML = `
            <strong>Nombre:</strong> ${nombre}<br>
            <strong>Teléfono:</strong> ${telefono}<br>
            <strong>Tipo de donación:</strong> ${tipo}<br>
            <strong>Donación:</strong> ${descripcion}<br>
            <strong>Cantidad:</strong> ${cantidad}<br>
            <strong>Fecha estimada:</strong> ${fecha}<br><br>
            <strong>Lugar de entrega:</strong><br>
            CUCEI · Universidad de Guadalajara<br>
            Blvd. Marcelino García Barragán #1421, esquina Calzada Olímpica,<br>
            C.P. 44430, Guadalajara, Jalisco, México.<br><br>
            <strong>Horario:</strong> Lunes a viernes de 9:00 a.m. a 3:00 p.m.
        `;

        mensajeWhatsApp =
`Hola, quiero registrar una donación para la campaña ODS 2 Hambre Cero.

Nombre del donador: ${nombre}
Teléfono del donador: ${telefono}
Tipo de donación: ${tipo}
Descripción: ${descripcion}
Cantidad aproximada: ${cantidad}
Fecha estimada de entrega: ${fecha}

Lugar de entrega:
CUCEI - Universidad de Guadalajara
Blvd. Marcelino García Barragán #1421, esquina Calzada Olímpica,
C.P. 44430, Guadalajara, Jalisco, México.

Horario:
Lunes a viernes de 9:00 a.m. a 3:00 p.m.

Responsable:
José Angel Oceguera Reyes
Tel: 3321218321`;

        modal.style.display = "flex";
    });
}

if (btnWhatsApp) {
    btnWhatsApp.addEventListener("click", function() {
       
        btnWhatsApp.innerText = "Registrando...";
        btnWhatsApp.disabled = true;

  
        const datosDonacion = {
            nombre: document.getElementById("nombre").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            tipo: document.getElementById("tipo").value,
            descripcion: document.getElementById("descripcion").value.trim(),
            cantidad: document.getElementById("cantidad").value.trim(),
            fecha: "'" + document.getElementById("fecha").value
        };

       
        fetch("https://sheetdb.io/api/v1/0i4nvhx0ip8ne", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [datosDonacion]
            })
        })
        .then((response) => response.json())
        .then((data) => {
          
            const numeroResponsable = "523321218321";
            const url = `https://wa.me/${numeroResponsable}?text=${encodeURIComponent(mensajeWhatsApp)}`;

            window.open(url, "_blank");

            formulario.reset();
            cerrarModal();
            alert("¡Gracias! Tu donación se registró en nuestra base de datos.");

          
            btnWhatsApp.innerText = "Enviar por WhatsApp";
            btnWhatsApp.disabled = false;
        })
        .catch((error) => {
            alert("Hubo un error al registrar. Intenta de nuevo.");
            btnWhatsApp.innerText = "Enviar por WhatsApp";
            btnWhatsApp.disabled = false;
            console.error("Error SheetDB:", error);
        });
    });
}

function cerrarModal() {
    modal.style.display = "none";
}