import { useState } from 'react';

/**
 * Componente Login
 * Pantalla de autenticación de usuarios para el sistema Pan en su punto (RF 01 y RF 02).
 */
function Login({ onLoginExitoso }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (usuario.trim() === '' || contrasena.trim() === '') {
      setMensajeError('Por favor, ingrese su usuario y contraseña');
      return;
    }

    setMensajeError('');
    setCargando(true);

    try {
      const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const datos = await respuesta.json();

      if (datos.exito) {
        // Persiste la sesión activa en el navegador (RF 10) y abre el panel principal
        localStorage.setItem('usuarioActivo', JSON.stringify(datos.usuario));
        onLoginExitoso(datos.usuario);
      } else {
        setMensajeError(datos.mensaje);
      }
    } catch (error) {
      setMensajeError('No se pudo conectar con el servidor. Verifica que Apache esté encendido.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pantalla-login">
      <main className="login-container">
        <div className="login-box">
          <div className="logo-container">
            <img src="/img/logo.jpg" alt="Logo Pan en su punto" className="logo" />
          </div>

          <form id="loginForm" onSubmit={manejarEnvio}>
            <div className="input-group">
              {mensajeError && (
                <div id="mensaje-error" className="alerta-error">
                  {mensajeError}
                </div>
              )}
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                id="usuario"
                placeholder="Ingrese su correo o documento"
                value={usuario}
                onChange={(evento) => setUsuario(evento.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                placeholder="Ingrese su contraseña"
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? 'VALIDANDO...' : 'INGRESAR'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;