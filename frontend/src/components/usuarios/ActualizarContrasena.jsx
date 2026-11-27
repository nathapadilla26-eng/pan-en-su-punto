import { useState } from 'react';

/**
 * Componente ActualizarContrasena
 * Permite al usuario autenticado cambiar su contraseña actual o temporal (RF 05 y RF 12).
 * Valida en tiempo real los 5 requisitos de seguridad y muestra confirmación al guardar.
 */
function ActualizarContrasena({ usuarioActivo, onContinuar }) {
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [contrasenaNueva, setContrasenaNueva] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    // Estados para mostrar/ocultar cada campo de contraseña
    const [verActual, setVerActual] = useState(false);
    const [verNueva, setVerNueva] = useState(false);
    const [verConfirmar, setVerConfirmar] = useState(false);

    const [mensajeError, setMensajeError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [actualizadaConExito, setActualizadaConExito] = useState(false);

    // Reglas de validación en tiempo real para la lista de requisitos
    const cumpleLongitud = contrasenaNueva.length >= 8;
    const cumpleMayuscula = /[A-Z]/.test(contrasenaNueva);
    const cumpleMinuscula = /[a-z]/.test(contrasenaNueva);
    const cumpleNumero = /[0-9]/.test(contrasenaNueva);
    const cumpleEspecial = /[!@#$%^&*]/.test(contrasenaNueva);

    const todosRequisitosCumplidos =
        cumpleLongitud && cumpleMayuscula && cumpleMinuscula && cumpleNumero && cumpleEspecial;

    /**
     * Envía la contraseña actual y la nueva al servidor PHP para actualizarla en MySQL.
     */
    const manejarActualizacion = async (evento) => {
        evento.preventDefault();

        if (contrasenaActual === '' || contrasenaNueva === '' || confirmarContrasena === '') {
            setMensajeError('Por favor, completa todos los campos.');
            return;
        }

        if (!todosRequisitosCumplidos) {
            setMensajeError('La nueva contraseña debe cumplir con todos los requisitos de seguridad.');
            return;
        }

        if (contrasenaNueva !== confirmarContrasena) {
            setMensajeError('La nueva contraseña y su confirmación no coinciden.');
            return;
        }

        if (contrasenaActual === contrasenaNueva) {
            setMensajeError('La nueva contraseña debe ser diferente a la actual.');
            return;
        }

        setMensajeError('');
        setGuardando(true);

        try {
            const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/usuarios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'cambiar_contrasena',
                    id_usuario: usuarioActivo.id_usuario,
                    contrasena_actual: contrasenaActual,
                    contrasena_nueva: contrasenaNueva,
                }),
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                setActualizadaConExito(true);
            } else {
                setMensajeError(datos.mensaje || 'No se pudo actualizar la contraseña.');
            }
        } catch (error) {
            setMensajeError('Error de conexión con el servidor. Verifica que Apache esté encendido.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="pantalla-login">
            <main className="login-container">
                <div className="login-box">
                    <div className="logo-container">
                        <img src="/img/logo.jpg" alt="Logo Pan en su punto" className="logo" />
                    </div>

                    {!actualizadaConExito ? (
                        <>
                            <h2 id="titulo-actualizar">Debes actualizar tu contraseña</h2>
                            <p id="texto-actualizar">Por seguridad, crea una nueva contraseña para acceder al sistema.</p>

                            {mensajeError && (
                                <div className="alerta-error" style={{ marginBottom: '14px' }}>
                                    {mensajeError}
                                </div>
                            )}

                            <form id="form-actualizar-pass" onSubmit={manejarActualizacion}>
                                <div className="input-group">
                                    <label htmlFor="pass-temporal">Contraseña actual o temporal</label>
                                    <div className="input-con-icono">
                                        <input
                                            type={verActual ? 'text' : 'password'}
                                            id="pass-temporal"
                                            placeholder="Ingresa tu contraseña actual"
                                            value={contrasenaActual}
                                            onChange={(e) => setContrasenaActual(e.target.value)}
                                        />
                                        <i
                                            className={`fa-solid ${verActual ? 'fa-eye-slash' : 'fa-eye'} icono-ojo`}
                                            onClick={() => setVerActual(!verActual)}
                                            style={{ cursor: 'pointer' }}
                                        ></i>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="pass-nueva">Nueva contraseña</label>
                                    <div className="input-con-icono">
                                        <input
                                            type={verNueva ? 'text' : 'password'}
                                            id="pass-nueva"
                                            placeholder="Ingresa tu nueva contraseña"
                                            value={contrasenaNueva}
                                            onChange={(e) => setContrasenaNueva(e.target.value)}
                                        />
                                        <i
                                            className={`fa-solid ${verNueva ? 'fa-eye-slash' : 'fa-eye'} icono-ojo`}
                                            onClick={() => setVerNueva(!verNueva)}
                                            style={{ cursor: 'pointer' }}
                                        ></i>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="pass-confirmar">Confirmar nueva contraseña</label>
                                    <div className="input-con-icono">
                                        <input
                                            type={verConfirmar ? 'text' : 'password'}
                                            id="pass-confirmar"
                                            placeholder="Repite tu nueva contraseña"
                                            value={confirmarContrasena}
                                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                                        />
                                        <i
                                            className={`fa-solid ${verConfirmar ? 'fa-eye-slash' : 'fa-eye'} icono-ojo`}
                                            onClick={() => setVerConfirmar(!verConfirmar)}
                                            style={{ cursor: 'pointer' }}
                                        ></i>
                                    </div>
                                </div>

                                <div className="caja-requisitos">
                                    <p className="titulo-requisitos">Requisitos de la contraseña:</p>
                                    <ul className="lista-requisitos">
                                        <li className={cumpleLongitud ? 'cumplido' : ''}>
                                            <i className={cumpleLongitud ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>{' '}
                                            Mínimo 8 caracteres
                                        </li>
                                        <li className={cumpleMayuscula ? 'cumplido' : ''}>
                                            <i className={cumpleMayuscula ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>{' '}
                                            Una letra mayúscula
                                        </li>
                                        <li className={cumpleMinuscula ? 'cumplido' : ''}>
                                            <i className={cumpleMinuscula ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>{' '}
                                            Una letra minúscula
                                        </li>
                                        <li className={cumpleNumero ? 'cumplido' : ''}>
                                            <i className={cumpleNumero ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>{' '}
                                            Un número
                                        </li>
                                        <li className={cumpleEspecial ? 'cumplido' : ''}>
                                            <i className={cumpleEspecial ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>{' '}
                                            Un carácter especial (!@#$%^&amp;*)
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    id="btn-ejecutar-actualizacion"
                                    className="btn-principal boton-ancho"
                                    disabled={guardando}
                                    style={{ border: 'none', cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-clock-rotate-left"></i>{' '}
                                    {guardando ? 'Actualizando...' : 'Actualizar contraseña'}
                                </button>

                                <button
                                    type="button"
                                    className="btn-secundario boton-ancho"
                                    onClick={onContinuar}
                                    style={{ marginTop: '10px', border: 'none', cursor: 'pointer' }}
                                >
                                    Cancelar y volver al panel
                                </button>
                            </form>
                        </>
                    ) : (
                        <div id="vista-exito-pass" style={{ textAlign: 'center' }}>
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
                            <h2>Contraseña actualizada correctamente</h2>
                            <p>Tu contraseña ha sido actualizada. Ahora puedes ingresar al sistema con tu nueva contraseña.</p>
                            <button
                                type="button"
                                id="btn-continuar-sistema"
                                className="btn-principal boton-ancho"
                                onClick={onContinuar}
                                style={{ border: 'none', cursor: 'pointer' }}
                            >
                                Continuar al sistema <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ActualizarContrasena;