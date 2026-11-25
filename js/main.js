// Bloque del Login
const formularioLogin = document.getElementById('loginForm');
if (formularioLogin) {
    formularioLogin.addEventListener('submit', function (event) {
        event.preventDefault();

        const contrasena = document.getElementById('contrasena').value;
        const usuario = document.getElementById('usuario').value;

        if (usuario.trim() === '' || contrasena.trim() === '') {
            document.getElementById('mensaje-error').classList.remove('oculto');
        } else {
            // Redirección real al panel de inicio
            window.location.href = 'panel.html';
        }
    });
}

// Bloque del Panel
const canvasGrafico = document.getElementById('graficoVentas');
if (canvasGrafico) {
    const ctx = canvasGrafico.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
            datasets: [{
                data: [400, 450, 420, 600, 580, 750, 850],
                borderColor: '#E67E22',
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}
const btnHamburguesa = document.getElementById('btn-hamburguesa');
const menuLateral = document.querySelector('.menu-lateral');
if (btnHamburguesa && menuLateral) {
    btnHamburguesa.addEventListener('click', () => {
        menuLateral.classList.toggle('activo');
    });
}
const btnCerrar = document.getElementById('btn-cerrar-menu');
if (btnCerrar && menuLateral) {
    btnCerrar.addEventListener('click', () => {
        menuLateral.classList.remove('activo');
    });
}
// Modal de Nuevo Usuario
const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
const modalExito = document.getElementById('modal-exito');
const btnAceptarModal = document.getElementById('btn-aceptar-modal');

if (btnGuardarUsuario && modalExito) {
    btnGuardarUsuario.addEventListener('click', () => {
        modalExito.classList.remove('oculto');
        modalExito.classList.add('mostrar-modal');
    });
}

if (btnAceptarModal) {
    btnAceptarModal.addEventListener('click', () => {
        window.location.href = 'usuarios.html';
    });
}

const botonesAbrirPassword = document.querySelectorAll('.btn-abrir-password');
const modalPassword = document.getElementById('modal-password');
const btnCancelarPassword = document.getElementById('btn-cancelar-password');
const textoNombreModal = document.getElementById('modal-nombre-usuario');
const textoCorreoModal = document.getElementById('modal-correo-usuario');

if (botonesAbrirPassword.length > 0 && modalPassword) {
    botonesAbrirPassword.forEach(boton => {
        boton.addEventListener('click', () => {
            const fila = boton.closest('tr');
            if (fila && textoNombreModal && textoCorreoModal) {
                const nombre = fila.cells[0].textContent;
                const correo = fila.cells[1].textContent;
                textoNombreModal.innerHTML = `<i class="fa-regular fa-user"></i> Nombre: ${nombre}`;
                textoCorreoModal.innerHTML = `<i class="fa-regular fa-envelope"></i> Correo: ${correo}`;
            }
            modalPassword.classList.remove('oculto');
            modalPassword.classList.add('mostrar-modal');
        });
    });
}

if (btnCancelarPassword && modalPassword) {
    btnCancelarPassword.addEventListener('click', () => {
        modalPassword.classList.remove('mostrar-modal');
        modalPassword.classList.add('oculto');
    });
}

const btnConfirmarPassword = document.getElementById('btn-confirmar-password');
const modalPasswordGenerada = document.getElementById('modal-password-generada');
const btnCerrarGenerada = document.getElementById('btn-cerrar-generada');
const btnCopiarPassword = document.getElementById('btn-copiar-password');
const textoContrasenaTemp = document.getElementById('texto-contrasena-temp');

if (btnConfirmarPassword && modalPassword && modalPasswordGenerada) {
    btnConfirmarPassword.addEventListener('click', () => {
        modalPassword.classList.remove('mostrar-modal');
        modalPassword.classList.add('oculto');
        modalPasswordGenerada.classList.remove('oculto');
        modalPasswordGenerada.classList.add('mostrar-modal');
    });
}

if (btnCerrarGenerada && modalPasswordGenerada) {
    btnCerrarGenerada.addEventListener('click', () => {
        modalPasswordGenerada.classList.remove('mostrar-modal');
        modalPasswordGenerada.classList.add('oculto');
    });
}

if (btnCopiarPassword && textoContrasenaTemp) {
    btnCopiarPassword.addEventListener('click', () => {
        navigator.clipboard.writeText(textoContrasenaTemp.textContent);
        btnCopiarPassword.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
        setTimeout(() => {
            btnCopiarPassword.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
        }, 2000);
    });
} const btnEjecutarActualizacion = document.getElementById('btn-ejecutar-actualizacion');
const formActualizarPass = document.getElementById('form-actualizar-pass');
const vistaExitoPass = document.getElementById('vista-exito-pass');
const tituloActualizar = document.getElementById('titulo-actualizar');
const textoActualizar = document.getElementById('texto-actualizar');

if (btnEjecutarActualizacion && formActualizarPass && vistaExitoPass) {
    btnEjecutarActualizacion.addEventListener('click', () => {
        formActualizarPass.classList.add('oculto');
        tituloActualizar.classList.add('oculto');
        textoActualizar.classList.add('oculto');
        vistaExitoPass.classList.remove('oculto');
    });
}
let filaAEliminar = null;
const modalEliminar = document.getElementById('modal-eliminar');

document.addEventListener('click', (e) => {
    const btnEliminar = e.target.closest('.btn-eliminar-fila');
    if (btnEliminar) {
        e.preventDefault();
        filaAEliminar = btnEliminar.closest('tr');
        if (modalEliminar) {
            modalEliminar.classList.remove('oculto');
            modalEliminar.classList.add('mostrar-modal');
        }
    }
});

const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
if (btnCancelarEliminar && modalEliminar) {
    btnCancelarEliminar.addEventListener('click', () => {
        modalEliminar.classList.remove('mostrar-modal');
        modalEliminar.classList.add('oculto');
        filaAEliminar = null;
    });
}

const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
if (btnConfirmarEliminar && modalEliminar) {
    btnConfirmarEliminar.addEventListener('click', () => {
        if (filaAEliminar) {
            filaAEliminar.remove();
            filaAEliminar = null;
        }
        modalEliminar.classList.remove('mostrar-modal');
        modalEliminar.classList.add('oculto');
    });
}
// --- 1. CAPTURAR DATOS DE LA TABLA Y REDIRIGIR ---
document.addEventListener('click', (e) => {
    const btnEditar = e.target.closest('.btn-editar-fila');
    if (btnEditar) {
        e.preventDefault();

        // Obtener la fila completa donde se hizo clic
        const fila = btnEditar.closest('tr');
        const celdas = fila.querySelectorAll('td');

        // Extraer los textos de las celdas (según el orden de tus columnas)
        const proveedor = {
            nit: celdas[0].innerText.trim(),
            empresa: celdas[1].innerText.trim(),
            contacto: celdas[2].innerText.trim(),
            telefono: celdas[3].innerText.trim(),
            direccion: celdas[4].innerText.trim()
        };

        // Guardar la información temporalmente en el navegador
        localStorage.setItem('proveedorEdicion', JSON.stringify(proveedor));

        // Cambiar de pantalla
        window.location.href = 'editar-proveedor.html';
    }
});

// --- RELLENAR EL FORMULARIO DE EDICIÓN ---
document.addEventListener('DOMContentLoaded', () => {

    const tituloSeccion = document.querySelector('.titulos h2');

    if (tituloSeccion && tituloSeccion.innerText.includes('Editar Proveedor')) {
        const datosGuardados = localStorage.getItem('proveedorEdicion');

        if (datosGuardados) {
            const proveedor = JSON.parse(datosGuardados);
            const inputs = document.querySelectorAll('.formulario-estandar input');


            if (inputs.length >= 5) {
                inputs[0].value = proveedor.nit;
                inputs[1].value = proveedor.empresa;
                inputs[2].value = proveedor.contacto;
                inputs[3].value = proveedor.telefono;
                inputs[4].value = proveedor.direccion;
            }
        }
    }
});
// --- CAPTURAR DATOS DEL PRODUCTO ---
document.addEventListener('click', (e) => {
    const btnEditarProd = e.target.closest('.btn-editar-producto');
    if (btnEditarProd) {
        e.preventDefault();
        const celdas = btnEditarProd.closest('tr').querySelectorAll('td');

        const producto = {
            codigo: celdas[0].innerText.trim(),
            nombre: celdas[1].innerText.trim(),
            categoria: celdas[2].innerText.trim(),
            precio: celdas[3].innerText.trim().replace(/[^0-9]/g, ''),
            stock: celdas[4].innerText.trim().replace(/[^0-9]/g, ''),
            estado: celdas[5].innerText.trim()
        };

        localStorage.setItem('productoEdicion', JSON.stringify(producto));
        window.location.href = 'editar-producto-terminado.html';
    }
});

// --- RELLENAR FORMULARIO DE PRODUCTO ---
document.addEventListener('DOMContentLoaded', () => {
    const tituloSeccion = document.querySelector('.titulos h2');

    if (tituloSeccion && tituloSeccion.innerText.includes('Editar Producto Terminado')) {
        const datosGuardados = localStorage.getItem('productoEdicion');

        if (datosGuardados) {
            const prod = JSON.parse(datosGuardados);

            document.getElementById('edit-prod-codigo').value = prod.codigo;
            document.getElementById('edit-prod-nombre').value = prod.nombre;
            document.getElementById('edit-prod-categoria').value = prod.categoria;
            document.getElementById('edit-prod-precio').value = prod.precio;
            document.getElementById('edit-prod-stock').value = prod.stock;
            document.getElementById('edit-prod-estado').value = prod.estado;
        }
    }
});
// --- VER DETALLES DE ENTRADA DE INVENTARIO ---
document.addEventListener('click', (e) => {
    const btnVer = e.target.closest('.btn-ver-detalle');
    if (btnVer) {
        e.preventDefault();

        // Obtener la fila y sus celdas
        const celdas = btnVer.closest('tr').querySelectorAll('td');

        // Rellenar el modal con los datos de la fila
        document.getElementById('det-fecha').innerText = celdas[0].innerText.trim();
        document.getElementById('det-proveedor').innerText = celdas[1].innerText.trim();
        document.getElementById('det-materia').innerText = celdas[2].innerText.trim();
        document.getElementById('det-cantidad').innerText = celdas[3].innerText.trim();
        document.getElementById('det-costo').innerText = celdas[4].innerText.trim();
        document.getElementById('det-responsable').innerText = celdas[5].innerText.trim();

        // Mostrar el modal
        const modalDetalle = document.getElementById('modal-detalle-entrada');
        if (modalDetalle) {
            modalDetalle.classList.remove('oculto');
            modalDetalle.classList.add('mostrar-modal');
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar-ingrediente');
    const tablaIngredientes = document.getElementById('tabla-ingredientes');
    const btnGuardarReceta = document.getElementById('btn-guardar-receta');
    const modalExito = document.getElementById('modal-exito');

    if (btnAgregar && tablaIngredientes) {
        btnAgregar.addEventListener('click', () => {
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>
                    <select class="input-tabla">
                        <option value="">Seleccione materia prima...</option>
                        <option value="1">Harina de trigo</option>
                        <option value="2">Azúcar blanca</option>
                        <option value="3">Mantequilla</option>
                        <option value="4">Levadura fresca</option>
                    </select>
                </td>
                <td><input type="number" placeholder="Ej: 100" class="input-tabla ancho-corto"></td>
                <td>
                    <select class="input-tabla">
                        <option>g</option>
                        <option>kg</option>
                        <option>ml</option>
                        <option>und</option>
                    </select>
                </td>
                <td class="celda-valor">$ 0</td>
                <td>
                    <a href="#" class="btn-icono btn-eliminar-fila">
                        <i class="fa-solid fa-trash btn-eliminar"></i>
                    </a>
                </td>
            `;
            tablaIngredientes.appendChild(nuevaFila);
        });

        tablaIngredientes.addEventListener('click', (evento) => {
            const botonEliminar = evento.target.closest('.btn-eliminar-fila');
            if (botonEliminar) {
                evento.preventDefault();
                botonEliminar.closest('tr').remove();
            }
        });
    }

    const botonesAbrirModal = document.querySelectorAll('.btn-abrir-modal');

    if (botonesAbrirModal.length > 0 && modalExito) {
        botonesAbrirModal.forEach(boton => {
            boton.addEventListener('click', () => {
                modalExito.classList.remove('oculto');
                modalExito.classList.add('mostrar-modal');
            });
        });
    }
});
const btnContinuarSistema = document.getElementById('btn-continuar-sistema');
if (btnContinuarSistema) {
    btnContinuarSistema.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
const btnCerrarDetalle = document.getElementById('btn-cerrar-detalle');
const modalDetalleEntrada = document.getElementById('modal-detalle-entrada');

if (btnCerrarDetalle && modalDetalleEntrada) {
    btnCerrarDetalle.addEventListener('click', () => {
        modalDetalleEntrada.classList.remove('mostrar-modal');
        modalDetalleEntrada.classList.add('oculto');
    });
}
document.addEventListener('click', (e) => {
    const btnVer = e.target.closest('.btn-ver');
    if (btnVer) {
        e.preventDefault();

        // Obtener la fila y sus celdas
        const fila = btnVer.closest('tr');
        if (!fila) return;
        const celdas = fila.querySelectorAll('td');

        // Rellenar el modal con los datos de la fila
        if (celdas.length > 5) {
            const detFecha = document.getElementById('det-fecha');
            const detProveedor = document.getElementById('det-proveedor');
            const detMateria = document.getElementById('det-materia');
            const detCantidad = document.getElementById('det-cantidad');
            const detCosto = document.getElementById('det-costo');
            const detResponsable = document.getElementById('det-responsable');

            if (detFecha) detFecha.innerText = celdas[0].innerText.trim();
            if (detProveedor) detProveedor.innerText = celdas[1].innerText.trim();
            if (detMateria) detMateria.innerText = celdas[2].innerText.trim();
            if (detCantidad) detCantidad.innerText = celdas[3].innerText.trim();
            if (detCosto) detCosto.innerText = celdas[4].innerText.trim();
            if (detResponsable) detResponsable.innerText = celdas[5].innerText.trim();
        }

        // Mostrar el modal usando clases limpias
        const modalDetalle = document.getElementById('modal-detalle-entrada');
        if (modalDetalle) {
            modalDetalle.classList.remove('oculto');
            modalDetalle.classList.add('mostrar-modal');
        }
    }
});
const btnGuardarEntrada = document.getElementById('btn-guardar-entrada');
if (btnGuardarEntrada) {
    btnGuardarEntrada.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('modal-exito');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
    });
}
const btnGuardarMateria = document.getElementById('btn-guardar-materia');
if (btnGuardarMateria) {
    btnGuardarMateria.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('modal-exito');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
    });
}
const btnGuardarMerma = document.getElementById('btn-guardar-merma');
if (btnGuardarMerma) {
    btnGuardarMerma.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('modal-exito');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
    });
}
const btnGuardarProducto = document.getElementById('btn-guardar-producto');
if (btnGuardarProducto) {
    btnGuardarProducto.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('modal-exito');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
    });
}
const btnGuardarProveedor = document.getElementById('btn-guardar-proveedor');
if (btnGuardarProveedor) {
    btnGuardarProveedor.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('modal-exito');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
    });
}
// Gestión de restablecer contraseña en usuarios.html
document.addEventListener('click', (e) => {
    const modalPass = document.getElementById('modal-password');
    const modalGen = document.getElementById('modal-password-generada');

    // Abrir primer modal desde la tabla (botón con clase o icono de llave/reloj)
    if (e.target.closest('.btn-restablecer-password')) {
        e.preventDefault();
        if (modalPass) {
            modalPass.classList.remove('oculto');
            modalPass.classList.add('mostrar-modal');
        }
    }

    // Cancelar primer modal
    if (e.target.closest('#btn-cancelar-password')) {
        e.preventDefault();
        if (modalPass) {
            modalPass.classList.remove('mostrar-modal');
            modalPass.classList.add('oculto');
        }
    }

    // Confirmar en el primer modal: cierra este y abre el de la contraseña generada
    if (e.target.closest('#btn-confirmar-password')) {
        e.preventDefault();
        if (modalPass) {
            modalPass.classList.remove('mostrar-modal');
            modalPass.classList.add('oculto');
        }
        if (modalGen) {
            modalGen.classList.remove('oculto');
            modalGen.classList.add('mostrar-modal');
        }
    }

    // Cerrar modal de contraseña generada
    if (e.target.closest('#btn-cerrar-generada')) {
        e.preventDefault();
        if (modalGen) {
            modalGen.classList.remove('mostrar-modal');
            modalGen.classList.add('oculto');
        }
    }
});
// Gestión y cambio dinámico de estado en recetas
let filaRecetaSeleccionada = null;

document.addEventListener('click', (e) => {
    const btnCambiarEstado = e.target.closest('.btn-estado-receta');
    const btnCancelarEstado = e.target.closest('#btn-cancelar-estado');
    const btnConfirmarEstado = e.target.closest('#btn-confirmar-estado');
    const modalEstado = document.getElementById('modal-estado-receta');

    const tituloModal = document.getElementById('modal-estado-titulo');
    const mensajeModal = document.getElementById('modal-estado-mensaje');
    const btnConfirmar = document.getElementById('btn-confirmar-estado');

    // Al abrir el modal, detectar el estado actual y ajustar textos
    if (btnCambiarEstado && modalEstado) {
        e.preventDefault();
        filaRecetaSeleccionada = btnCambiarEstado.closest('tr');
        const badgeActual = filaRecetaSeleccionada.querySelector('.estado-activo, .estado-inactivo');

        if (badgeActual && badgeActual.classList.contains('estado-activo')) {
            // Caso: Está activa y se va a inactivar
            tituloModal.textContent = '¿Inactivar receta?';
            mensajeModal.textContent = 'Si inactivas esta receta, los panaderos no podrán utilizarla para crear nuevas órdenes de producción.';
            btnConfirmar.textContent = 'Inactivar';
        } else {
            // Caso: Está inactiva y se va a activar
            tituloModal.textContent = '¿Activar receta?';
            mensajeModal.textContent = 'Al activar esta receta, quedará disponible inmediatamente para planificar y registrar órdenes de producción.';
            btnConfirmar.textContent = 'Activar';
        }

        modalEstado.classList.remove('oculto');
        modalEstado.classList.add('mostrar-modal');
    }

    // Cancelar: cerrar y limpiar selección
    if (btnCancelarEstado && modalEstado) {
        e.preventDefault();
        modalEstado.classList.remove('mostrar-modal');
        modalEstado.classList.add('oculto');
        filaRecetaSeleccionada = null;
    }

    // Confirmar: alternar estado visual en la fila y cerrar
    if (btnConfirmarEstado && modalEstado) {
        e.preventDefault();
        if (filaRecetaSeleccionada) {
            const badgeEstado = filaRecetaSeleccionada.querySelector('.estado-activo, .estado-inactivo');
            if (badgeEstado) {
                if (badgeEstado.classList.contains('estado-activo')) {
                    badgeEstado.classList.remove('estado-activo');
                    badgeEstado.classList.add('estado-inactivo');
                    badgeEstado.textContent = 'Inactiva';
                } else {
                    badgeEstado.classList.remove('estado-inactivo');
                    badgeEstado.classList.add('estado-activo');
                    badgeEstado.textContent = 'Activa';
                }
            }
        }
        modalEstado.classList.remove('mostrar-modal');
        modalEstado.classList.add('oculto');
        filaRecetaSeleccionada = null;
    }
});
// Modal de éxito al actualizar receta
document.addEventListener('click', (e) => {
    const btnActualizar = e.target.closest('#btn-actualizar-receta');
    const modalExito = document.getElementById('modal-exito-receta');

    if (btnActualizar && modalExito) {
        e.preventDefault();
        modalExito.classList.remove('oculto');
        modalExito.classList.add('mostrar-modal');
    }
});
// Acciones en la tabla de órdenes de producción
let filaOrdenSeleccionada = null;

document.addEventListener('click', (e) => {
    const modalFinalizar = document.getElementById('modal-finalizar-orden');
    const modalAnular = document.getElementById('modal-anular-orden');

    // 1. Abrir modal para Finalizar
    const btnFinalizar = e.target.closest('.btn-accion-finalizar');
    if (btnFinalizar && modalFinalizar) {
        e.preventDefault();
        filaOrdenSeleccionada = btnFinalizar.closest('tr');
        const codigo = filaOrdenSeleccionada.getAttribute('data-orden');
        document.getElementById('modal-finalizar-codigo').textContent = codigo;
        modalFinalizar.classList.remove('oculto');
        modalFinalizar.classList.add('mostrar-modal');
    }

    // Cancelar modal finalizar
    if (e.target.closest('#btn-cancelar-finalizar') && modalFinalizar) {
        e.preventDefault();
        modalFinalizar.classList.remove('mostrar-modal');
        modalFinalizar.classList.add('oculto');
        filaOrdenSeleccionada = null;
    }

    // Confirmar finalización
    if (e.target.closest('#btn-confirmar-finalizar') && modalFinalizar) {
        e.preventDefault();
        if (filaOrdenSeleccionada) {
            const tdEstado = filaOrdenSeleccionada.querySelector('td:nth-child(5)');
            tdEstado.innerHTML = '<span class="estado-finalizada">Finalizada</span>';
        }
        modalFinalizar.classList.remove('mostrar-modal');
        modalFinalizar.classList.add('oculto');
        filaOrdenSeleccionada = null;
    }

    // 2. Abrir modal para Anular
    const btnAnular = e.target.closest('.btn-accion-anular');
    if (btnAnular && modalAnular) {
        e.preventDefault();
        filaOrdenSeleccionada = btnAnular.closest('tr');
        modalAnular.classList.remove('oculto');
        modalAnular.classList.add('mostrar-modal');
    }

    // Cancelar modal anular
    if (e.target.closest('#btn-cancelar-anular') && modalAnular) {
        e.preventDefault();
        modalAnular.classList.remove('mostrar-modal');
        modalAnular.classList.add('oculto');
        filaOrdenSeleccionada = null;
    }

    // Confirmar anulación y mostrar confirmación de éxito
    if (e.target.closest('#btn-confirmar-anular') && modalAnular) {
        e.preventDefault();
        if (filaOrdenSeleccionada) {
            const tdEstado = filaOrdenSeleccionada.querySelector('td:nth-child(5)');
            tdEstado.innerHTML = '<span class="estado-anulada">Anulada</span>';
        }
        // Cierra el modal de advertencia
        modalAnular.classList.remove('mostrar-modal');
        modalAnular.classList.add('oculto');

        // Abre el modal de confirmación
        const modalExitoAnular = document.getElementById('modal-exito-anular');
        if (modalExitoAnular) {
            modalExitoAnular.classList.remove('oculto');
            modalExitoAnular.classList.add('mostrar-modal');
        }
    }

    // Botón Aceptar para cerrar el modal de éxito
    if (e.target.closest('#btn-cerrar-exito-anular')) {
        e.preventDefault();
        const modalExitoAnular = document.getElementById('modal-exito-anular');
        if (modalExitoAnular) {
            modalExitoAnular.classList.remove('mostrar-modal');
            modalExitoAnular.classList.add('oculto');
        }
        filaOrdenSeleccionada = null;
    }
});

// Modal de confirmación al actualizar orden de producción
document.addEventListener('click', (e) => {
    const btnActualizarOrden = e.target.closest('#btn-actualizar-orden');
    const modalExitoOrden = document.getElementById('modal-exito-orden');

    if (btnActualizarOrden && modalExitoOrden) {
        e.preventDefault();
        modalExitoOrden.classList.remove('oculto');
        modalExitoOrden.classList.add('mostrar-modal');
    }
});
// Modal de confirmación al crear nueva orden de producción
document.addEventListener('click', (e) => {
    const btnCrearOrden = e.target.closest('#btn-crear-orden');
    const modalExitoNueva = document.getElementById('modal-exito-nueva-orden');

    if (btnCrearOrden && modalExitoNueva) {
        e.preventDefault();
        modalExitoNueva.classList.remove('oculto');
        modalExitoNueva.classList.add('mostrar-modal');
    }
});
// =========================================
// MÓDULO DE VENTAS: PUNTO DE VENTA (POS)
// =========================================

let descuentoVentaActual = { tipo: 'porcentaje', valor: 0 };

document.addEventListener('click', (e) => {
    // Si no estamos en la pantalla del POS, no ejecutar nada
    if (!document.querySelector('.layout-pos')) return;

    // 1. Filtro por categorías (pestañas)
    const btnCat = e.target.closest('.btn-categoria');
    if (btnCat) {
        const botones = document.querySelectorAll('.btn-categoria');
        botones.forEach((btn) => btn.classList.remove('activo'));
        btnCat.classList.add('activo');

        const categoriaSeleccionada = btnCat.dataset.categoria;
        const tarjetas = document.querySelectorAll('.tarjeta-producto-pos');

        tarjetas.forEach((tarjeta) => {
            if (categoriaSeleccionada === 'todos' || tarjeta.dataset.categoria === categoriaSeleccionada) {
                tarjeta.classList.remove('oculto');
            } else {
                tarjeta.classList.add('oculto');
            }
        });
        return;
    }

    // 2. Agregar producto desde el catálogo al tiquete
    const tarjeta = e.target.closest('.tarjeta-producto-pos');
    if (tarjeta) {
        const nombre = tarjeta.querySelector('h4').textContent.trim();
        const precioTexto = tarjeta.querySelector('.precio-producto-pos span').textContent.trim();
        const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''), 10);

        const contenedorItems = document.querySelector('.lista-items-ticket');
        if (contenedorItems) {
            const items = contenedorItems.querySelectorAll('.item-ticket');
            let itemExistente = null;

            items.forEach((item) => {
                const nombreItem = item.querySelector('.nombre-item').textContent.trim();
                if (nombreItem === nombre) {
                    itemExistente = item;
                }
            });

            if (itemExistente) {
                const spanCantidad = itemExistente.querySelector('.cantidad-item');
                let cantidad = parseInt(spanCantidad.textContent, 10) + 1;
                spanCantidad.textContent = cantidad;

                const spanSubtotal = itemExistente.querySelector('.subtotal-item span');
                spanSubtotal.textContent = `$${(cantidad * precio).toLocaleString('es-CO')}`;
            } else {
                const nuevoItem = document.createElement('div');
                nuevoItem.className = 'item-ticket';
                nuevoItem.dataset.precio = precio;
                nuevoItem.innerHTML = `
                    <div class="detalle-item-ticket">
                        <p class="nombre-item">${nombre}</p>
                        <p class="precio-item">$${precio.toLocaleString('es-CO')} x und</p>
                    </div>
                    <div class="controles-cantidad">
                        <button type="button" class="btn-restar"><i class="fa-solid fa-minus"></i></button>
                        <span class="cantidad-item">1</span>
                        <button type="button" class="btn-sumar"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="subtotal-item">
                        <span>$${precio.toLocaleString('es-CO')}</span>
                        <button type="button" class="btn-eliminar-item"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                `;
                contenedorItems.appendChild(nuevoItem);
            }
            actualizarTotalesPOS();
        }
        return;
    }

    // 3. Botón sumar cantidad en el tiquete
    const btnSumar = e.target.closest('.btn-sumar');
    if (btnSumar) {
        const item = btnSumar.closest('.item-ticket');
        const spanCantidad = item.querySelector('.cantidad-item');
        const precio = parseInt(item.dataset.precio || item.querySelector('.precio-item').textContent.replace(/[^0-9]/g, ''), 10);
        let cantidad = parseInt(spanCantidad.textContent, 10) + 1;
        spanCantidad.textContent = cantidad;
        item.querySelector('.subtotal-item span').textContent = `$${(cantidad * precio).toLocaleString('es-CO')}`;
        actualizarTotalesPOS();
        return;
    }

    // 4. Botón restar cantidad en el tiquete
    const btnRestar = e.target.closest('.btn-restar');
    if (btnRestar) {
        const item = btnRestar.closest('.item-ticket');
        const spanCantidad = item.querySelector('.cantidad-item');
        const precio = parseInt(item.dataset.precio || item.querySelector('.precio-item').textContent.replace(/[^0-9]/g, ''), 10);
        let cantidad = parseInt(spanCantidad.textContent, 10);
        if (cantidad > 1) {
            cantidad -= 1;
            spanCantidad.textContent = cantidad;
            item.querySelector('.subtotal-item span').textContent = `$${(cantidad * precio).toLocaleString('es-CO')}`;
            actualizarTotalesPOS();
        }
        return;
    }

    // 5. Botón eliminar ítem del tiquete
    const btnEliminar = e.target.closest('.btn-eliminar-item');
    if (btnEliminar) {
        const item = btnEliminar.closest('.item-ticket');
        if (item) {
            item.remove();
            actualizarTotalesPOS();
        }
        return;
    }

    // 6. Cancelar venta en la pantalla principal
    const btnCancelar = e.target.closest('#btn-cancelar-venta');
    if (btnCancelar) {
        const contenedorItems = document.querySelector('.lista-items-ticket');
        if (contenedorItems) {
            contenedorItems.innerHTML = '';
            actualizarTotalesPOS();
        }
        return;
    }

    // 6.1. Abrir modal de descuento
    const btnAbrirDesc = e.target.closest('#btn-abrir-modal-descuento');
    if (btnAbrirDesc) {
        const modal = document.getElementById('modal-aplicar-descuento');
        const inputValor = document.getElementById('input-valor-descuento');
        if (inputValor) inputValor.value = descuentoVentaActual.valor > 0 ? descuentoVentaActual.valor : '';
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
        return;
    }

    // 6.2. Cancelar o cerrar modal de descuento
    const btnCancelarDesc = e.target.closest('#btn-cancelar-descuento');
    if (btnCancelarDesc) {
        const modal = document.getElementById('modal-aplicar-descuento');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }
        return;
    }

    // 6.3. Alternar entre Porcentaje y Valor fijo
    const btnTipo = e.target.closest('.btn-tipo-desc');
    if (btnTipo) {
        document.querySelectorAll('.btn-tipo-desc').forEach(b => b.classList.remove('activo'));
        btnTipo.classList.add('activo');

        const tipo = btnTipo.dataset.tipo;
        const simbolo = document.getElementById('simbolo-descuento');
        const label = document.getElementById('label-valor-descuento');
        const atajos = document.getElementById('contenedor-atajos-porcentaje');

        if (tipo === 'porcentaje') {
            if (simbolo) simbolo.textContent = '%';
            if (label) label.textContent = 'Valor del descuento (%)';
            if (atajos) atajos.style.display = 'grid';
        } else {
            if (simbolo) simbolo.textContent = '$';
            if (label) label.textContent = 'Monto del descuento en pesos';
            if (atajos) atajos.style.display = 'none';
        }
        return;
    }

    // 6.4. Botones rápidos de porcentaje (5%, 10%, 15%, 20%)
    const btnAtajo = e.target.closest('.btn-atajo-desc');
    if (btnAtajo) {
        const inputValor = document.getElementById('input-valor-descuento');
        if (inputValor) inputValor.value = btnAtajo.dataset.valor;
        return;
    }

    // 6.5. Quitar descuento aplicado
    const btnQuitarDesc = e.target.closest('#btn-quitar-descuento');
    if (btnQuitarDesc) {
        window.descuentoVentaActual = { tipo: 'porcentaje', valor: 0 };

        // Sumar subtotales del carrito
        let subtotalOriginal = 0;
        document.querySelectorAll('.lista-items-ticket .item-ticket').forEach((item) => {
            const txt = item.querySelector('.subtotal-item span')?.textContent || item.querySelector('.subtotal-item')?.textContent || '$0';
            subtotalOriginal += parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;
        });

        // Restaurar valores en pantalla
        const elemDesc = document.getElementById('ticket-descuento') || document.querySelector('.linea-descuento span:last-child');
        const elemTotal = document.getElementById('ticket-total') || document.querySelector('.total-cobro span:last-child');

        if (elemDesc) elemDesc.textContent = '$0';
        if (elemTotal) elemTotal.textContent = `$${subtotalOriginal.toLocaleString('es-CO')}`;

        // Cerrar modal
        const modal = document.getElementById('modal-aplicar-descuento');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }
        return;
    }

    // 6.6. Confirmar y aplicar descuento en la factura
    const btnGuardarDesc = e.target.closest('#btn-guardar-descuento');
    if (btnGuardarDesc) {
        const tipo = document.querySelector('.btn-tipo-desc.activo')?.dataset.tipo || 'porcentaje';
        const valor = parseFloat(document.getElementById('input-valor-descuento')?.value) || 0;

        if (valor <= 0) {
            alert('Por favor ingrese un valor de descuento mayor a cero.');
            return;
        }

        window.descuentoVentaActual = { tipo: tipo, valor: valor };

        // 1. Sumar los precios de los productos en la lista
        let subtotalBruto = 0;
        document.querySelectorAll('.lista-items-ticket .item-ticket').forEach((item) => {
            const txt = item.querySelector('.subtotal-item span')?.textContent || item.querySelector('.subtotal-item')?.textContent || '$0';
            subtotalBruto += parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;
        });

        // 2. Calcular monto a restar en pesos
        let montoDescuento = 0;
        if (tipo === 'porcentaje') {
            montoDescuento = Math.round((subtotalBruto * valor) / 100);
        } else {
            montoDescuento = Math.min(valor, subtotalBruto);
        }

        const totalFinal = Math.max(0, subtotalBruto - montoDescuento);

        // 3. Escribir directamente los nuevos valores en el tiquete
        const elemDesc = document.getElementById('ticket-descuento') || document.querySelector('.linea-descuento span:last-child');
        const elemTotal = document.getElementById('ticket-total') || document.querySelector('.total-cobro span:last-child');

        if (elemDesc) elemDesc.textContent = `-$${montoDescuento.toLocaleString('es-CO')}`;
        if (elemTotal) elemTotal.textContent = `$${totalFinal.toLocaleString('es-CO')}`;

        // 4. Cerrar modal
        const modal = document.getElementById('modal-aplicar-descuento');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }
        return;
    }
    // 7. Abrir modal de pago y cargar montos
    const btnProcesar = e.target.closest('#btn-procesar-pago');
    if (btnProcesar) {
        const contenedorItems = document.querySelector('.lista-items-ticket');
        const totalTexto = document.querySelector('.resumen-cobro .total-cobro span:last-child')?.textContent || '$0';
        const total = parseInt(totalTexto.replace(/[^0-9]/g, ''), 10) || 0;

        if (!contenedorItems || contenedorItems.children.length === 0 || total === 0) {
            alert('Debe agregar al menos un producto a la factura antes de procesar el pago.');
            return;
        }

        const subtotal = Math.round(total / 1.08);
        const impuestos = total - subtotal;

        document.getElementById('modal-subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
        document.getElementById('modal-impuestos').textContent = `$${impuestos.toLocaleString('es-CO')}`;
        document.getElementById('modal-total').textContent = `$${total.toLocaleString('es-CO')}`;

        const inputRecibido = document.getElementById('display-monto-recibido');
        if (inputRecibido) inputRecibido.value = '0';
        actualizarCambio();

        const modal = document.getElementById('modal-procesar-pago');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
        return;
    }

    // 8. Cerrar modal de pago
    const btnCerrarModal = e.target.closest('#btn-cerrar-modal-pago');
    if (btnCerrarModal) {
        const modal = document.getElementById('modal-procesar-pago');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }
        return;
    }

    // 9. Selección de método de pago dentro del modal
    const btnMetodo = e.target.closest('.btn-metodo');
    if (btnMetodo) {
        // Cambiar el color del botón activo
        document.querySelectorAll('.btn-metodo').forEach((b) => b.classList.remove('activo'));
        btnMetodo.classList.add('activo');

        const metodoSeleccionado = btnMetodo.dataset.metodo;
        const zonaEfectivo = document.getElementById('zona-efectivo');
        const zonaElectronico = document.getElementById('zona-electronico');
        const textoElectronico = document.getElementById('texto-metodo-electronico');
        const iconoElectronico = document.querySelector('#zona-electronico i');

        // Alternar visualización del teclado
        if (metodoSeleccionado === 'efectivo') {
            zonaEfectivo.classList.remove('oculto');
            zonaElectronico.classList.add('oculto');
        } else {
            zonaEfectivo.classList.add('oculto');
            zonaElectronico.classList.remove('oculto');

            // Adaptar mensaje según el método
            if (metodoSeleccionado === 'tarjeta') {
                textoElectronico.textContent = 'Procesa el cobro en el datáfono.';
                iconoElectronico.className = 'fa-solid fa-credit-card';
            } else if (metodoSeleccionado === 'digital') {
                textoElectronico.textContent = 'Verifica la transferencia en la aplicación.';
                iconoElectronico.className = 'fa-solid fa-mobile-screen';
            }
        }
        return;
    }

    // 10. Teclado numérico del modal
    const teclaNum = e.target.closest('.tecla[data-num]');
    if (teclaNum) {
        const num = teclaNum.dataset.num;
        const input = document.getElementById('display-monto-recibido');
        if (input) {
            input.value = input.value === '0' ? num : input.value + num;
            actualizarCambio();
        }
        return;
    }

    // 11. Tecla C (Limpiar)
    if (e.target.closest('#btn-teclado-clear')) {
        const input = document.getElementById('display-monto-recibido');
        if (input) {
            input.value = '0';
            actualizarCambio();
        }
        return;
    }

    // 12. Tecla Borrar dígito
    if (e.target.closest('#btn-teclado-backspace')) {
        const input = document.getElementById('display-monto-recibido');
        if (input) {
            input.value = input.value.length > 1 ? input.value.slice(0, -1) : '0';
            actualizarCambio();
        }
        return;
    }

    // 13. Confirmar pago -> Guardar en sessionStorage y redirigir
    const btnConfirmar = e.target.closest('#btn-confirmar-pago');
    if (btnConfirmar) {
        const totalTexto = document.getElementById('modal-total')?.textContent || '$0';
        const total = parseInt(totalTexto.replace(/[^0-9]/g, ''), 10) || 0;
        const recibido = parseInt(document.getElementById('display-monto-recibido')?.value || '0', 10);
        const metodo = document.querySelector('.btn-metodo.activo')?.dataset.metodo || 'efectivo';

        if (metodo === 'efectivo' && recibido < total) {
            alert('El monto recibido no puede ser inferior al total de la venta.');
            return;
        }

        // Recolectar productos del carrito actual
        const items = [];
        document.querySelectorAll('.lista-items-ticket .item-ticket').forEach((item) => {
            items.push({
                nombre: item.querySelector('.nombre-item').textContent.trim(),
                precioUnitario: item.querySelector('.precio-item').textContent.replace(' x und', '').trim(),
                cantidad: item.querySelector('.cantidad-item').textContent.trim(),
                subtotal: item.querySelector('.subtotal-item span').textContent.trim()
            });
        });

        // Crear objeto de transacción con datos reales
        const ahora = new Date();
        const venta = {
            idTransaccion: 'trx-' + Math.floor(1000 + Math.random() * 9000),
            fechaHora: ahora.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
            subtotal: document.getElementById('modal-subtotal')?.textContent || '$0',
            descuento: document.getElementById('ticket-descuento')?.textContent || '$0',
            impuestos: document.getElementById('modal-impuestos')?.textContent || '$0',
            total: totalTexto,
            items: items
        };

        // Guardar en la memoria temporal del navegador
        sessionStorage.setItem('ultimaVenta', JSON.stringify(venta));

        // Redirigir a la pantalla de comprobante
        window.location.href = 'venta-exitosa.html';
        return;
    }

});

// Función para recalcular automáticamente los totales de la venta
function actualizarTotalesPOS() {
    const items = document.querySelectorAll('.lista-items-ticket .item-ticket');
    let total = 0;

    items.forEach((item) => {
        const subtotalTexto = item.querySelector('.subtotal-item span').textContent;
        const subtotal = parseInt(subtotalTexto.replace(/[^0-9]/g, ''), 10) || 0;
        total += subtotal;
    });

    const elemSubtotal = document.querySelector('.resumen-cobro .linea-resumen:first-child span:last-child');
    const elemTotal = document.querySelector('.resumen-cobro .total-cobro span:last-child');

    if (elemSubtotal) elemSubtotal.textContent = `$${total.toLocaleString('es-CO')}`;
    if (elemTotal) elemTotal.textContent = `$${total.toLocaleString('es-CO')}`;
}

// Cálculo en tiempo real del cambio a devolver en el modal
function actualizarCambio() {
    const totalTexto = document.getElementById('modal-total')?.textContent || '$0';
    const total = parseInt(totalTexto.replace(/[^0-9]/g, ''), 10) || 0;
    const recibido = parseInt(document.getElementById('display-monto-recibido')?.value || '0', 10);
    const cambio = Math.max(0, recibido - total);
    const spanCambio = document.getElementById('monto-cambio');
    if (spanCambio) {
        spanCambio.textContent = `$${cambio.toLocaleString('es-CO')}`;
    }
}
// =========================================
// RENDERIZADO DINÁMICO DE LA TIRILLA DE PAGO
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const contenedorExitosa = document.querySelector('.contenedor-venta-exitosa');
    if (!contenedorExitosa) return;

    const datosGuardados = sessionStorage.getItem('ultimaVenta');
    if (!datosGuardados) return;

    const venta = JSON.parse(datosGuardados);

    // 1. Actualizar número de transacción y fecha
    const textoTransaccion = document.querySelector('.info-transaccion p');
    if (textoTransaccion) {
        textoTransaccion.innerHTML = `<i class="fa-solid fa-receipt"></i> Transacción #${venta.idTransaccion} — ${venta.fechaHora}`;
    }

    // 2. Insertar las filas con los productos reales
    const tbody = document.getElementById('cuerpo-tabla-tirilla');
    if (tbody) {
        tbody.innerHTML = '';
        venta.items.forEach((prod) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${prod.nombre}</td>
                <td class="texto-centro">${prod.cantidad}</td>
                <td class="texto-derecha">${prod.precioUnitario}</td>
                <td class="texto-derecha">${prod.subtotal}</td>
            `;
            tbody.appendChild(fila);
        });
    }

    // 3. Actualizar montos en la tirilla
    const subtotalTirilla = document.getElementById('tirilla-subtotal');
    const impuestosTirilla = document.getElementById('tirilla-impuestos');
    const totalTirilla = document.getElementById('tirilla-total');

    if (subtotalTirilla) subtotalTirilla.textContent = venta.subtotal;
    if (impuestosTirilla) impuestosTirilla.textContent = venta.impuestos;
    if (totalTirilla) totalTirilla.textContent = `${venta.total} COP`;
    const filaDesc = document.getElementById('tirilla-fila-descuento');
    const spanDesc = document.getElementById('tirilla-descuento');
    if (filaDesc && spanDesc && venta.descuento && venta.descuento !== '$0') {
        spanDesc.textContent = venta.descuento;
        filaDesc.classList.remove('oculto');
    } else if (filaDesc) {
        filaDesc.classList.add('oculto');
    }
});
// =========================================
// MÓDULO: ENVÍO DE COMPROBANTE POR WHATSAPP
// =========================================

document.addEventListener('click', (e) => {
    // 1. Abrir modal de WhatsApp
    const btnAbrirWhatsapp = e.target.closest('#btn-abrir-modal-whatsapp');
    if (btnAbrirWhatsapp) {
        const modal = document.getElementById('modal-enviar-whatsapp');
        const inputTel = document.getElementById('input-telefono-cliente');
        if (inputTel) {
            inputTel.value = '';
            inputTel.focus();
        }
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
        return;
    }

    // 2. Cerrar modal de WhatsApp
    const btnCancelarWhatsapp = e.target.closest('#btn-cancelar-envio-whatsapp');
    if (btnCancelarWhatsapp) {
        const modal = document.getElementById('modal-enviar-whatsapp');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }
        return;
    }

    // 3. Confirmar y abrir WhatsApp Web / App
    const btnConfirmarWhatsapp = e.target.closest('#btn-confirmar-envio-whatsapp');
    if (btnConfirmarWhatsapp) {
        const inputTel = document.getElementById('input-telefono-cliente');
        const telefono = inputTel?.value.trim().replace(/\D/g, '');

        if (!telefono || telefono.length !== 10 || !telefono.startsWith('3')) {
            alert('Por favor ingrese un número de celular válido de 10 dígitos (ej: 3101234567).');
            return;
        }

        // Estructura base segura para evitar errores de referencia
        let venta = {
            idTransaccion: 'trx-0000',
            fechaHora: new Date().toLocaleString('es-CO'),
            subtotal: '$0',
            impuestos: '$0',
            total: '$0',
            items: []
        };

        const datosGuardados = sessionStorage.getItem('ultimaVenta');
        if (datosGuardados) {
            try {
                venta = JSON.parse(datosGuardados);
            } catch (err) {
                console.error('Error al procesar los datos de la venta:', err);
            }
        }

        // Armar el listado de productos de forma segura
        let listaItems = '';
        if (Array.isArray(venta.items) && venta.items.length > 0) {
            venta.items.forEach((item) => {
                listaItems += `${item.cantidad}x ${item.nombre}  -->  ${item.subtotal}\n`;
            });
        } else {
            listaItems = 'Artículos registrados en mostrador\n';
        }

        // Mensaje con formato de tiquete fiscal
        const mensaje =
            `================================
*PAN EN SU PUNTO*
NIT: 900.123.456-7
Calle 123 #45-67, Armenia
Tel: +57 (601) 867-5309
================================
*DOCUMENTO EQUIVALENTE ELECTRÓNICO*
*Factura POS:* #${venta.idTransaccion}
*Fecha:* ${venta.fechaHora}
*Cliente:* Mostrador
*Cajero:* Javier M
--------------------------------
*DETALLE DE LA COMPRA:*
${listaItems}--------------------------------
*Subtotal:* ${venta.subtotal}
*Impuestos (8%):* ${venta.impuestos}
*TOTAL A PAGAR:* ${venta.total} COP
--------------------------------
*INFORMACIÓN TRIBUTARIA DIAN*
*CUFE:* 8A98-4C2D-E1F0-55B2

Consulte su factura electrónica aquí:
https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=8A98-4C2D-E1F0-55B2

¡Gracias por su compra!`;

        // Cerrar modal
        const modal = document.getElementById('modal-enviar-whatsapp');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }

        // Abrir WhatsApp
        const urlWhatsapp = `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsapp, '_blank');
        return;
    }
});
// ========================================================
// MÓDULO: GESTIÓN DE CAJA (EGRESOS Y CIERRE)
// ========================================================

document.addEventListener('click', (e) => {
    // 1. Abrir modal de Registrar Egreso
    const btnAbrirEgreso = e.target.closest('#btn-registrar-egreso');
    if (btnAbrirEgreso) {
        const modal = document.getElementById('modal-registrar-egreso');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
        return;
    }

    // 2. Cerrar modal de Registrar Egreso
    const btnCerrarEgreso = e.target.closest('#btn-cancelar-egreso');
    if (btnCerrarEgreso) {
        const modal = document.getElementById('modal-registrar-egreso');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
            // Limpiar los campos al cancelar
            document.getElementById('form-registro-egreso')?.reset();
        }
        return;
    }
});

// 3. Manejar el envío del formulario de Egreso y actualizar la caja
document.addEventListener('submit', (e) => {
    const formEgreso = e.target.closest('#form-registro-egreso');
    if (formEgreso) {
        e.preventDefault();

        const concepto = document.getElementById('input-concepto-egreso').value;
        const valorInput = parseFloat(document.getElementById('input-valor-egreso').value) || 0;

        if (valorInput <= 0) return;

        // A. Insertar la nueva fila en la tabla de movimientos
        const tbody = document.querySelector('.seccion-movimientos-caja tbody');
        if (tbody) {
            const horaActual = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }).toLowerCase();
            const nuevaFila = document.createElement('tr');

            nuevaFila.innerHTML = `
                <td>${horaActual}</td>
                <td><span class="insignia-movimiento egreso">Egreso</span></td>
                <td>${concepto}</td>
                <td class="texto-derecha valor-negativo">-$${valorInput.toLocaleString('es-CO')}</td>
                <td class="texto-centro">Admin</td>
            `;
            tbody.prepend(nuevaFila);
        }

        // B. Actualizar las tarjetas de "Salidas" y "Total esperado"
        const elemEgresos = document.querySelector('.tarjeta-total-caja .valor-total.negativo');
        const elemTotal = document.querySelector('.tarjeta-total-caja.destacado .valor-total.principal');

        if (elemEgresos && elemTotal) {
            // Extraer números actuales limpiando los símbolos
            const egresosActuales = parseInt(elemEgresos.textContent.replace(/[^0-9]/g, ''), 10) || 0;
            const totalActual = parseInt(elemTotal.textContent.replace(/[^0-9]/g, ''), 10) || 0;

            // Calcular nuevos valores
            const nuevosEgresos = egresosActuales + valorInput;
            const nuevoTotal = totalActual - valorInput;

            // Inyectar al HTML
            elemEgresos.textContent = `-$${nuevosEgresos.toLocaleString('es-CO')}`;
            elemTotal.textContent = `$${nuevoTotal.toLocaleString('es-CO')}`;
        }

        // C. Cerrar modal y resetear el formulario
        const modal = document.getElementById('modal-registrar-egreso');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
            formEgreso.reset();
        }
    }
});
// ========================================================
// MÓDULO: CERRAR TURNO (ARQUEO)
// ========================================================

document.addEventListener('click', (e) => {
    // 4. Abrir modal de Cerrar Turno
    const btnAbrirCierre = e.target.closest('#btn-cerrar-turno');
    if (btnAbrirCierre) {
        const modal = document.getElementById('modal-cerrar-turno');
        const elemTotalEsperado = document.querySelector('.tarjeta-total-caja.destacado .valor-total.principal');
        const spanArqueoEsperado = document.getElementById('arqueo-total-esperado');
        const spanDiferencia = document.getElementById('arqueo-diferencia');
        const inputEfectivo = document.getElementById('input-efectivo-real');

        if (modal && elemTotalEsperado && spanArqueoEsperado) {
            // Pasar el valor de la tarjeta superior al modal
            spanArqueoEsperado.textContent = elemTotalEsperado.textContent;

            // Resetear campos
            if (inputEfectivo) inputEfectivo.value = '';
            if (spanDiferencia) {
                spanDiferencia.textContent = '$0';
                spanDiferencia.style.color = '#374151'; // Gris neutro
            }
            const obs = document.getElementById('input-observaciones-cierre');
            if (obs) obs.value = '';

            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
        return;
    }

    // 5. Cancelar Cierre de Turno
    const btnCancelarCierre = e.target.closest('#btn-cancelar-cierre');
    if (btnCancelarCierre) {
        const modal = document.getElementById('modal-cerrar-turno');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }
        return;
    }
});

// 6. Calcular diferencia en tiempo real al escribir el efectivo
document.addEventListener('input', (e) => {
    if (e.target.id === 'input-efectivo-real') {
        const spanArqueoEsperado = document.getElementById('arqueo-total-esperado');
        const spanDiferencia = document.getElementById('arqueo-diferencia');

        if (spanArqueoEsperado && spanDiferencia) {
            const totalEsperado = parseInt(spanArqueoEsperado.textContent.replace(/[^0-9]/g, ''), 10) || 0;
            const efectivoReal = parseFloat(e.target.value) || 0;

            const diferencia = efectivoReal - totalEsperado;

            // Formatear moneda y color (Verde sobrante, Rojo faltante)
            if (diferencia === 0) {
                spanDiferencia.textContent = '$0';
                spanDiferencia.style.color = '#374151';
            } else if (diferencia > 0) {
                spanDiferencia.textContent = `+$${diferencia.toLocaleString('es-CO')}`;
                spanDiferencia.style.color = '#16A34A';
            } else {
                spanDiferencia.textContent = `-$${Math.abs(diferencia).toLocaleString('es-CO')}`;
                spanDiferencia.style.color = '#DC2626';
            }
        }
    }
});

// 7. Enviar formulario de Cierre de Caja
document.addEventListener('submit', (e) => {
    const formCierre = e.target.closest('#form-cierre-turno');
    if (formCierre) {
        e.preventDefault();

        // 1. Ocultar el modal de arqueo
        const modalCierre = document.getElementById('modal-cerrar-turno');
        if (modalCierre) {
            modalCierre.classList.remove('mostrar-modal');
            modalCierre.classList.add('oculto');
        }

        // 2. Mostrar nuestro propio modal de éxito
        const modalExito = document.getElementById('modal-exito-cierre');
        if (modalExito) {
            modalExito.classList.remove('oculto');
            modalExito.classList.add('mostrar-modal');
        }

        // 3. Esperar 2 segundos y redirigir al panel de ventas
        setTimeout(() => {
            window.location.href = 'ventas-inicio.html';
        }, 2000);
    }
});
// ========================================================
// MÓDULO: CONFIGURACIÓN DE IMPUESTOS
// ========================================================

document.addEventListener('submit', (e) => {
    const formConfig = e.target.closest('#form-config-impuestos');
    if (formConfig) {
        e.preventDefault();

        // 1. Leer los valores ingresados
        const nombreImpuesto = document.getElementById('input-nombre-impuesto').value;
        const porcentajeImpuesto = parseFloat(document.getElementById('input-porcentaje-impuesto').value) || 0;
        const impuestoActivo = document.getElementById('toggle-estado-impuesto').checked;

        // Aquí se guardarían los datos en la memoria o base de datos de tu sistema
        console.log(`Configuración guardada: ${nombreImpuesto} al ${porcentajeImpuesto}%. Activo: ${impuestoActivo}`);

        // 2. Mostrar el modal de éxito propio
        const modalExitoConfig = document.getElementById('modal-exito-config');
        if (modalExitoConfig) {
            modalExitoConfig.classList.remove('oculto');
            modalExitoConfig.classList.add('mostrar-modal');

            // 3. Ocultar el modal automáticamente después de 2 segundos
            setTimeout(() => {
                modalExitoConfig.classList.remove('mostrar-modal');
                modalExitoConfig.classList.add('oculto');
            }, 2000);
        }
    }
});
// ========================================================
// MÓDULO: PRECIOS DE VENTA
// ========================================================

document.addEventListener('click', (e) => {
    // 1. Abrir modal y cargar datos de la fila
    const btnEditarPrecio = e.target.closest('.btn-abrir-edicion-precio');
    if (btnEditarPrecio) {
        const fila = btnEditarPrecio.closest('tr');
        const nombreProducto = fila.querySelector('.id-transaccion').textContent;
        const costoProduccionTexto = fila.cells[2].textContent;
        const margenTexto = fila.cells[3].textContent;
        const precioFinalTexto = fila.cells[4].textContent;

        // Limpiar símbolos para operar con números puros
        const costoNumerico = parseInt(costoProduccionTexto.replace(/[^0-9]/g, ''), 10) || 0;
        const margenNumerico = parseInt(margenTexto.replace(/[^0-9]/g, ''), 10) || 0;
        const precioNumerico = parseInt(precioFinalTexto.replace(/[^0-9]/g, ''), 10) || 0;

        // Inyectar en el modal
        document.getElementById('nombre-producto-modal').textContent = nombreProducto;
        document.getElementById('costo-produccion-modal').textContent = costoProduccionTexto;
        document.getElementById('costo-produccion-modal').dataset.costoReal = costoNumerico; // Guardar valor oculto para cálculos
        document.getElementById('input-margen-ganancia').value = margenNumerico;
        document.getElementById('input-precio-final').value = precioNumerico;

        const modal = document.getElementById('modal-editar-precio');
        if (modal) {
            modal.classList.remove('oculto');
            modal.classList.add('mostrar-modal');
        }
        return;
    }

    // 2. Cancelar y cerrar modal
    const btnCancelarPrecio = e.target.closest('#btn-cancelar-precio');
    if (btnCancelarPrecio) {
        const modal = document.getElementById('modal-editar-precio');
        if (modal) {
            modal.classList.remove('mostrar-modal');
            modal.classList.add('oculto');
        }
        return;
    }
});

// 3. Cálculos automáticos en tiempo real (Margen <-> Precio)
document.addEventListener('input', (e) => {
    const elementoCosto = document.getElementById('costo-produccion-modal');
    if (!elementoCosto) return;

    const costo = parseInt(elementoCosto.dataset.costoReal, 10) || 0;
    if (costo === 0) return;

    // Si escribe en el margen, calcula el precio final
    if (e.target.id === 'input-margen-ganancia') {
        const margen = parseFloat(e.target.value) || 0;
        const nuevoPrecio = costo + (costo * (margen / 100));
        document.getElementById('input-precio-final').value = Math.round(nuevoPrecio);
    }

    // Si escribe en el precio final, calcula el margen
    if (e.target.id === 'input-precio-final') {
        const precioFinal = parseFloat(e.target.value) || 0;
        const nuevoMargen = ((precioFinal - costo) / costo) * 100;
        document.getElementById('input-margen-ganancia').value = Math.round(nuevoMargen);
    }
});

// 4. Guardar formulario y mostrar éxito
document.addEventListener('submit', (e) => {
    const formPrecio = e.target.closest('#form-editar-precio');
    if (formPrecio) {
        e.preventDefault();

        // Cerrar modal de edición
        document.getElementById('modal-editar-precio').classList.replace('mostrar-modal', 'oculto');

        // Abrir modal de éxito (el diseño limpio)
        const modalExito = document.getElementById('modal-exito-precio');
        modalExito.classList.remove('oculto');
        modalExito.classList.add('mostrar-modal');

        // Ocultar éxito después de 2 segundos
        setTimeout(() => {
            modalExito.classList.replace('mostrar-modal', 'oculto');
        }, 2000);
    }
});
// ========================================================
// MÓDULO: GENERACIÓN Y EXPORTACIÓN DE REPORTES
// ========================================================

document.addEventListener('submit', (e) => {
    const formReporteVentas = e.target.closest('#form-generar-reporte-ventas');

    if (formReporteVentas) {
        e.preventDefault();

        // 1. Mostrar la sección de resultados
        const resultados = document.getElementById('resultados-reporte-ventas');
        if (resultados) {
            resultados.classList.remove('oculto');
        }
    }
});

document.addEventListener('click', (e) => {
    // 2. Simular exportación a PDF/Excel
    const btnExportar = e.target.closest('.btn-exportar');
    if (btnExportar) {
        const formato = btnExportar.classList.contains('pdf') ? 'PDF' : 'Excel';

        // Usamos el modal de éxito existente para mantener la consistencia
        const modalExito = document.getElementById('modal-exito-precio'); // Reutilizamos modal de diseño limpio
        if (modalExito) {
            modalExito.querySelector('h3').textContent = '¡Reporte Exportado!';
            modalExito.querySelector('p').textContent = `El documento se ha descargado en formato ${formato}.`;

            modalExito.classList.remove('oculto');
            modalExito.classList.add('mostrar-modal');

            setTimeout(() => {
                modalExito.classList.remove('mostrar-modal');
                modalExito.classList.add('oculto');
            }, 2500);
        }
    }
});
// ========================================================
// MÓDULO: REPORTE DE INVENTARIO
// ========================================================

document.addEventListener('submit', (e) => {
    const formReporteInventario = e.target.closest('#form-generar-reporte-inventario');

    if (formReporteInventario) {
        e.preventDefault();

        // Mostrar la sección de resultados del inventario
        const resultadosInv = document.getElementById('resultados-reporte-inventario');
        if (resultadosInv) {
            resultadosInv.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: REPORTE DE FLUJO DE CAJA
// ========================================================

document.addEventListener('submit', (e) => {
    const formReporteFlujo = e.target.closest('#form-generar-reporte-flujo');

    if (formReporteFlujo) {
        e.preventDefault();

        // Mostrar la sección de resultados de flujo de caja
        const resultadosFlujo = document.getElementById('resultados-reporte-flujo');
        if (resultadosFlujo) {
            resultadosFlujo.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: REPORTE DE PRODUCTOS MÁS VENDIDOS
// ========================================================

document.addEventListener('submit', (e) => {
    const formRanking = e.target.closest('#form-generar-reporte-mas-vendidos');
    
    if (formRanking) {
        e.preventDefault();
        
        // Mostrar sección de resultados
        const resultadosRanking = document.getElementById('resultados-reporte-mas-vendidos');
        if (resultadosRanking) {
            resultadosRanking.classList.remove('oculto');
        }
    }
});// ========================================================
// MÓDULO: REPORTE DE ALERTAS DE STOCK MÍNIMO
// ========================================================

document.addEventListener('submit', (e) => {
    const formAlertasStock = e.target.closest('#form-generar-reporte-alertas-stock');
    
    if (formAlertasStock) {
        e.preventDefault();
        
        // Mostrar sección de resultados
        const resultadosAlertas = document.getElementById('resultados-reporte-alertas');
        if (resultadosAlertas) {
            resultadosAlertas.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: REPORTE DE MATERIA PRIMA PRÓXIMA A VENCER
// ========================================================

document.addEventListener('submit', (e) => {
    const formVencimiento = e.target.closest('#form-generar-reporte-vencimiento');
    
    if (formVencimiento) {
        e.preventDefault();
        
        // Mostrar sección de resultados
        const resultadosVencimiento = document.getElementById('resultados-reporte-vencimiento');
        if (resultadosVencimiento) {
            resultadosVencimiento.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: REPORTE KARDEX (MOVIMIENTOS)
// ========================================================

document.addEventListener('submit', (e) => {
    const formKardex = e.target.closest('#form-generar-reporte-kardex');
    
    if (formKardex) {
        e.preventDefault();
        
        // Mostrar sección de resultados
        const resultadosKardex = document.getElementById('resultados-reporte-kardex');
        if (resultadosKardex) {
            resultadosKardex.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: REPORTE DE PRODUCCIÓN
// ========================================================

document.addEventListener('submit', (e) => {
    const formReporteProd = e.target.closest('#form-generar-reporte-produccion');
    
    if (formReporteProd) {
        e.preventDefault();
        
        // Mostrar sección de resultados
        const resultadosProd = document.getElementById('resultados-reporte-produccion');
        if (resultadosProd) {
            resultadosProd.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: REPORTE DE MERMAS
// ========================================================

document.addEventListener('submit', (e) => {
    const formReporteMermas = e.target.closest('#form-generar-reporte-mermas');
    
    if (formReporteMermas) {
        e.preventDefault();
        
        // Mostrar sección de resultados de mermas
        const resultadosMermas = document.getElementById('resultados-reporte-mermas');
        if (resultadosMermas) {
            resultadosMermas.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: AUDITORÍA DE REPORTES
// ========================================================

document.addEventListener('submit', (e) => {
    const formAuditoria = e.target.closest('#form-generar-reporte-auditoria');
    
    if (formAuditoria) {
        e.preventDefault();
        
        // Mostrar sección de resultados de auditoría
        const resultadosAuditoria = document.getElementById('resultados-reporte-auditoria');
        if (resultadosAuditoria) {
            resultadosAuditoria.classList.remove('oculto');
        }
    }
});
// ========================================================
// MÓDULO: CONFIGURACIÓN GENERAL
// ========================================================

// 1. Conectar clic del círculo con el input de archivo
document.addEventListener('click', (e) => {
    const previewLogo = e.target.closest('#preview-logo');
    if (previewLogo) {
        document.getElementById('input-archivo-logo').click();
    }
});

// 2. Simulación de carga y previsualización del logo
const inputLogo = document.getElementById('input-archivo-logo');
if (inputLogo) {
    inputLogo.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const lector = new FileReader();
            lector.onload = function (e) {
                const cajaPreview = document.getElementById('preview-logo');
                cajaPreview.style.backgroundImage = `url('${e.target.result}')`;
                cajaPreview.style.backgroundSize = 'cover';
                cajaPreview.style.backgroundPosition = 'center';
                cajaPreview.innerHTML = ''; // Limpiar ícono y texto
            };
            lector.readAsDataURL(this.files[0]);
        }
    });
}

// 3. Envío de formularios de configuración
document.addEventListener('submit', (e) => {
    const formEmpresa = e.target.closest('#form-datos-empresa');
    const formRecibo = e.target.closest('#form-preferencias-recibo');

    if (formEmpresa || formRecibo) {
        e.preventDefault();
        
        const modalExito = document.getElementById('modal-exito-precio');
        if (modalExito) {
            modalExito.querySelector('h3').textContent = '¡Configuración guardada!';
            modalExito.querySelector('p').textContent = 'Los parámetros se han actualizado exitosamente.';
            modalExito.classList.remove('oculto');
            modalExito.classList.add('mostrar-modal');

            setTimeout(() => {
                modalExito.classList.remove('mostrar-modal');
                modalExito.classList.add('oculto');
            }, 2000);
        }
    }
});

// 4. Simulación de copia de seguridad (Backup)
document.addEventListener('click', (e) => {
    const btnBackup = e.target.closest('#btn-generar-backup');
    if (btnBackup) {
        const modalExito = document.getElementById('modal-exito-precio');
        if (modalExito) {
            modalExito.querySelector('h3').textContent = '¡Copia de seguridad creada!';
            modalExito.querySelector('p').textContent = 'El respaldo de la base de datos se generó y guardó con éxito.';
            modalExito.classList.remove('oculto');
            modalExito.classList.add('mostrar-modal');

            setTimeout(() => {
                modalExito.classList.remove('mostrar-modal');
                modalExito.classList.add('oculto');
            }, 2500);
        }
    }
});
// ========================================================
// CONTROL: MODAL DE ÉXITO DE COPIA DE SEGURIDAD
// ========================================================

document.addEventListener('click', (e) => {
    // 1. Clic en el botón "Generar copia de seguridad" (o su ícono)
    const btnGenerar = e.target.closest('#btn-generar-backup');
    if (btnGenerar) {
        const modalBackup = document.getElementById('modal-backup-exito');
        if (modalBackup) {
            // Actualizar la fecha y la hora en tiempo real
            const ahora = new Date();
            const formatoFecha = ahora.toLocaleDateString('es-CO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            const formatoHora = ahora.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const elementoFecha = document.getElementById('texto-fecha-backup');
            if (elementoFecha) {
                elementoFecha.textContent = `${formatoFecha}, ${formatoHora}`;
            }

            // Remueve la clase para que tome efecto display: flex
            modalBackup.classList.remove('oculto');
        }
        return;
    }

    // 2. Clic en el botón "Entendido" del modal
    const btnCerrar = e.target.closest('#btn-cerrar-modal-backup');
    if (btnCerrar) {
        const modalBackup = document.getElementById('modal-backup-exito');
        if (modalBackup) {
            modalBackup.classList.add('oculto');
        }
        return;
    }

    // 3. Clic sobre la capa oscura exterior
    const modalBackup = document.getElementById('modal-backup-exito');
    if (modalBackup && e.target === modalBackup) {
        modalBackup.classList.add('oculto');
    }
});

// 4. Cerrar con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modalBackup = document.getElementById('modal-backup-exito');
        if (modalBackup && !modalBackup.classList.contains('oculto')) {
            modalBackup.classList.add('oculto');
        }
    }
});
// ========================================================
// CONTROL: MODAL DE GUARDAR CONFIGURACIÓN
// ========================================================

// 1. Envío de formularios de configuración
document.addEventListener('submit', (e) => {
    const formEmpresa = e.target.closest('#form-datos-empresa');
    const formRecibo = e.target.closest('#form-preferencias-recibo');

    if (formEmpresa || formRecibo) {
        e.preventDefault();

        const modalGuardar = document.getElementById('modal-guardar-exito');
        const mensajeGuardar = document.getElementById('mensaje-modal-guardar');

        if (modalGuardar && mensajeGuardar) {
            if (formEmpresa) {
                mensajeGuardar.textContent = 'Los datos fiscales de la panadería han sido actualizados para la impresión en recibos.';
            } else if (formRecibo) {
                mensajeGuardar.textContent = 'El pie de página del recibo y los días de alerta de caducidad se guardaron correctamente.';
            }
            modalGuardar.classList.remove('oculto');
        }
    }
});

// 2. Cerrar modal de guardado (botón "Entendido" o clic fuera)
document.addEventListener('click', (e) => {
    const btnCerrarGuardar = e.target.closest('#btn-cerrar-modal-guardar');
    if (btnCerrarGuardar) {
        const modalGuardar = document.getElementById('modal-guardar-exito');
        if (modalGuardar) {
            modalGuardar.classList.add('oculto');
        }
        return;
    }

    const modalGuardar = document.getElementById('modal-guardar-exito');
    if (modalGuardar && e.target === modalGuardar) {
        modalGuardar.classList.add('oculto');
    }
});

// 3. Cerrar con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modalGuardar = document.getElementById('modal-guardar-exito');
        if (modalGuardar && !modalGuardar.classList.contains('oculto')) {
            modalGuardar.classList.add('oculto');
        }
    }
});
// ========================================================
// CONTROL: DROPDOWN DE USUARIO EN CABECERA
// ========================================================

document.addEventListener('click', (e) => {
    const btnAvatar = e.target.closest('#btn-avatar-usuario');
    const menuDropdown = document.getElementById('dropdown-menu-usuario');

    // 1. Clic sobre el botón del avatar (abrir / alternar)
    if (btnAvatar) {
        if (menuDropdown) {
            const estaOculto = menuDropdown.classList.toggle('oculto');
            btnAvatar.setAttribute('aria-expanded', !estaOculto);
        }
        return;
    }

    // 2. Clic fuera del contenedor: cerrar el menú
    if (menuDropdown && !e.target.closest('.contenedor-perfil-cabecera')) {
        menuDropdown.classList.add('oculto');
        const boton = document.getElementById('btn-avatar-usuario');
        if (boton) {
            boton.setAttribute('aria-expanded', 'false');
        }
    }
});

// 3. Cerrar menú con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menuDropdown = document.getElementById('dropdown-menu-usuario');
        if (menuDropdown && !menuDropdown.classList.contains('oculto')) {
            menuDropdown.classList.add('oculto');
            const boton = document.getElementById('btn-avatar-usuario');
            if (boton) {
                boton.setAttribute('aria-expanded', 'false');
            }
        }
    }
});