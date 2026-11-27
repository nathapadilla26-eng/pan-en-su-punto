import { useState } from 'react';

/**
 * Componente EditarUsuario
 * Permite modificar datos personales, rol, estado (activo/inactivo) y contraseña opcional
 * de un usuario existente en la base de datos (RF 04 y RF 11).
 */
function EditarUsuario({ usuario, onVolver }) {
    const [nombreCompleto, setNombreCompleto] = useState(usuario?.nombre_completo || '');
    const [correo, setCorreo] = useState(usuario?.correo || '');
    const [documento, setDocumento] = useState(usuario?.documento || '');
    const [idRol, setIdRol] = useState(String(usuario?.id_rol || '1'));
    const [estado, setEstado] = useState(String(usuario?.estado ?? '1'));
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    const [mensajeError, setMensajeError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [modalExitoAbierto, setModalExitoAbierto] = useState(false);

    /**
     * Valida formato, longitudes y coincidencia de contraseña antes de actualizar.
     */
    const validarFormulario = () => {
        if (nombreCompleto.trim() === '' || correo.trim() === '' || documento.trim() === '') {
            return 'El nombre, el correo y el documento son obligatorios.';
        }

        if (nombreCompleto.trim().length < 3 || nombreCompleto.trim().length > 100) {
            return 'El nombre completo debe tener entre 3 y 100 caracteres.';
        }

        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombreCompleto.trim())) {
            return 'El nombre completo solo puede contener letras y espacios.';
        }

        if (!/^\d{4,20}$/.test(documento.trim())) {
            return 'El documento de identidad debe contener solo números (entre 4 y 20 dígitos).';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            return 'Ingresa un correo electrónico válido.';
        }

        if (contrasena !== '' || confirmarContrasena !== '') {
            if (contrasena.length < 6) {
                return 'La nueva contraseña debe tener al menos 6 caracteres.';
            }
            if (contrasena !== confirmarContrasena) {
                return 'Las contraseñas nuevas no coinciden.';
            }
        }

        return '';
    };

    /**
     * Envía los cambios al servidor PHP para actualizar el registro en MySQL.
     */
    const manejarActualizar = async (evento) => {
        evento.preventDefault();

        const errorValidacion = validarFormulario();
        if (errorValidacion !== '') {
            setMensajeError(errorValidacion);
            return;
        }

        setMensajeError('');
        setGuardando(true);

        try {
            const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/usuarios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'editar',
                    id_usuario: usuario.id_usuario,
                    documento: documento.trim(),
                    nombre_completo: nombreCompleto.trim(),
                    correo: correo.trim(),
                    id_rol: Number(idRol),
                    estado: Number(estado),
                    contrasena,
                }),
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                setModalExitoAbierto(true);
            } else {
                setMensajeError(datos.mensaje || 'No se pudieron guardar los cambios.');
            }
        } catch (error) {
            setMensajeError('Error de conexión con el servidor. Verifica que Apache esté encendido.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            <div className="tarjeta-formulario">
                <h2>Editar usuario</h2>
                <p>Actualiza los datos del usuario en el sistema.</p>

                {mensajeError && (
                    <div className="alerta-error" style={{ marginBottom: '16px' }}>
                        {mensajeError}
                    </div>
                )}

                <form className="formulario-cuadricula" onSubmit={manejarActualizar}>
                    <div className="grupo-input">
                        <label htmlFor="editNombre">
                            Nombres y apellidos <span className="requerido">*</span>
                        </label>
                        <input
                            type="text"
                            id="editNombre"
                            placeholder="Nombre completo"
                            maxLength={100}
                            value={nombreCompleto}
                            onChange={(e) => setNombreCompleto(e.target.value)}
                        />
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="editCorreo">
                            Correo electrónico <span className="requerido">*</span>
                        </label>
                        <input
                            type="email"
                            id="editCorreo"
                            placeholder="correo@ejemplo.com"
                            maxLength={100}
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="editDocumento">
                            Documento de identidad <span className="requerido">*</span>
                        </label>
                        <input
                            type="text"
                            id="editDocumento"
                            placeholder="Número de documento"
                            maxLength={20}
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                        />
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="editRol">
                            Rol en el sistema <span className="requerido">*</span>
                        </label>
                        <select id="editRol" value={idRol} onChange={(e) => setIdRol(e.target.value)}>
                            <option value="1">Administrador</option>
                            <option value="2">Cajero</option>
                            <option value="3">Panadero</option>
                        </select>
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="editEstado">
                            Estado de la cuenta <span className="requerido">*</span>
                        </label>
                        <select id="editEstado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="editContrasena">Nueva contraseña (opcional)</label>
                        <input
                            type="password"
                            id="editContrasena"
                            placeholder="Dejar en blanco para mantener actual"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                    </div>

                    {contrasena !== '' && (
                        <div className="grupo-input">
                            <label htmlFor="editConfirmarContrasena">
                                Confirmar nueva contraseña <span className="requerido">*</span>
                            </label>
                            <input
                                type="password"
                                id="editConfirmarContrasena"
                                placeholder="Repite la nueva contraseña"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="acciones-formulario">
                        <button
                            type="button"
                            className="btn-secundario"
                            onClick={onVolver}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            id="btn-guardar-usuario"
                            className="btn-principal btn-abrir-modal"
                            disabled={guardando}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            {guardando ? 'Actualizando...' : 'Actualizar cambios'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de éxito */}
            {modalExitoAbierto && (
                <div id="modal-exito" className="fondo-modal">
                    <div className="contenido-modal centrado">
                        <div className="icono-exito">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icono-svg"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3>¡Cambios guardados con éxito!</h3>
                        <p>El usuario ha sido actualizado correctamente.</p>
                        <button
                            type="button"
                            className="btn-principal boton-ancho"
                            onClick={onVolver}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditarUsuario;