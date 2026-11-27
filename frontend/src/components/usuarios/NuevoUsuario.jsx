import { useState } from 'react';

/**
 * Componente NuevoUsuario
 * Formulario para registrar nuevo personal en el sistema (RF 04 y RF 11).
 * Incluye validaciones de campos obligatorios, formatos, longitudes y duplicados.
 */
function NuevoUsuario({ onVolver }) {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [correo, setCorreo] = useState('');
    const [documento, setDocumento] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [idRol, setIdRol] = useState('1');

    const [mensajeError, setMensajeError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [modalExitoAbierto, setModalExitoAbierto] = useState(false);

    /**
     * Valida las reglas de negocio y formato antes de enviar los datos a PHP.
     */
    const validarFormulario = () => {
        if (
            nombreCompleto.trim() === '' ||
            correo.trim() === '' ||
            documento.trim() === '' ||
            contrasena === '' ||
            confirmarContrasena === ''
        ) {
            return 'Todos los campos marcados con * son obligatorios.';
        }

        if (nombreCompleto.trim().length < 3 || nombreCompleto.trim().length > 100) {
            return 'El nombre completo debe tener entre 3 y 100 caracteres.';
        }

        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombreCompleto.trim())) {
            return 'El nombre completo solo puede contener letras y espacios.';
        }

        if (!/^\d{5,20}$/.test(documento.trim())) {
            return 'El documento de identidad debe contener solo números (entre 5 y 20 dígitos).';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            return 'Ingresa un correo electrónico válido (ejemplo: usuario@panensupunto.com).';
        }

        if (contrasena.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (contrasena !== confirmarContrasena) {
            return 'Las contraseñas no coinciden. Verifica ambos campos.';
        }

        return '';
    };

    /**
     * Envía el nuevo registro al servidor PHP para guardarlo en MySQL.
     */
    const manejarGuardar = async (evento) => {
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
                    accion: 'crear',
                    documento: documento.trim(),
                    nombre_completo: nombreCompleto.trim(),
                    correo: correo.trim(),
                    contrasena,
                    id_rol: Number(idRol),
                }),
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                setModalExitoAbierto(true);
            } else {
                setMensajeError(datos.mensaje || 'No se pudo registrar el usuario.');
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
                <h2>Crear Nuevo Usuario</h2>
                <p>Completa los datos del usuario para otorgar acceso a la plataforma.</p>

                {mensajeError && (
                    <div className="alerta-error" style={{ marginBottom: '16px' }}>
                        {mensajeError}
                    </div>
                )}

                <form className="formulario-cuadricula" onSubmit={manejarGuardar}>
                    <div className="grupo-input">
                        <label htmlFor="nombreCompleto">
                            Nombres y Apellidos <span className="requerido">*</span>
                        </label>
                        <input
                            type="text"
                            id="nombreCompleto"
                            placeholder="Nombre completo"
                            maxLength={100}
                            value={nombreCompleto}
                            onChange={(e) => setNombreCompleto(e.target.value)}
                        />
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="correo">
                            Correo electrónico <span className="requerido">*</span>
                        </label>
                        <input
                            type="email"
                            id="correo"
                            placeholder="correo@ejemplo.com"
                            maxLength={100}
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="documento">
                            Documento de identidad <span className="requerido">*</span>
                        </label>
                        <input
                            type="text"
                            id="documento"
                            placeholder="Ej: 1094900123"
                            maxLength={20}
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                        />
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="contrasena">
                            Contraseña <span className="requerido">*</span>
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            placeholder="••••••••"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="idRol">
                            Rol en el sistema <span className="requerido">*</span>
                        </label>
                        <select id="idRol" value={idRol} onChange={(e) => setIdRol(e.target.value)}>
                            <option value="1">Administrador</option>
                            <option value="2">Cajero</option>
                            <option value="3">Panadero</option>
                        </select>
                    </div>

                    <div className="grupo-input">
                        <label htmlFor="confirmarContrasena">
                            Confirmar contraseña <span className="requerido">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmarContrasena"
                            placeholder="••••••••"
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                        />
                    </div>

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
                            className="btn-principal"
                            disabled={guardando}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            {guardando ? 'Guardando...' : 'Guardar Usuario'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de Éxito */}
            {modalExitoAbierto && (
                <div id="modal-exito" className="fondo-modal">
                    <div className="contenido-modal centrado">
                        <div className="icono-exito">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3>¡Usuario Creado con Éxito!</h3>
                        <p>El usuario ha sido registrado correctamente y está activo en el sistema.</p>
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

export default NuevoUsuario;