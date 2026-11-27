import { useState, useEffect } from 'react';

/**
 * Componente ListaUsuarios
 * Muestra la tabla de personal registrado, filtros en tiempo real y los modales
 * para generar contraseñas temporales (RF 04 y RF 05).
 */
function ListaUsuarios({ onNuevoUsuario, onEditarUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  // Estados para los filtros y la búsqueda de la tabla
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  // Estados para controlar los dos modales de restablecimiento de contraseña (RF 05)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);
  const [modalGeneradaAbierto, setModalGeneradaAbierto] = useState(false);
  const [claveTemporalGenerada, setClaveTemporalGenerada] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [procesandoClave, setProcesandoClave] = useState(false);

  // Carga los usuarios desde MySQL al abrir la pantalla
  const cargarUsuarios = async () => {
    setCargando(true);
    setErrorCarga('');
    try {
      const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/usuarios.php');
      const datos = await respuesta.json();

      if (datos.exito) {
        setUsuarios(datos.usuarios);
      } else {
        setErrorCarga(datos.mensaje || 'No se pudieron cargar los usuarios.');
      }
    } catch (error) {
      setErrorCarga('Error de conexión con el servidor. Verifica que Apache esté encendido.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtra los registros según rol, estado y texto de búsqueda
  const usuariosFiltrados = usuarios.filter((item) => {
    const coincideRol = filtroRol === 'Todos' || item.nombre_rol === filtroRol;
    const estadoTexto = Number(item.estado) === 1 ? 'Activo' : 'Inactivo';
    const coincideEstado = filtroEstado === 'Todos' || estadoTexto === filtroEstado;
    const texto = busqueda.toLowerCase().trim();
    const coincideTexto =
      texto === '' ||
      item.nombre_completo.toLowerCase().includes(texto) ||
      item.correo.toLowerCase().includes(texto) ||
      item.documento.toLowerCase().includes(texto);

    return coincideRol && coincideEstado && coincideTexto;
  });

  // Cálculos de paginación
  const totalResultados = usuariosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalResultados / registrosPorPagina));
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceInicio + registrosPorPagina);

  // Abre el modal de confirmación para el usuario elegido
  const abrirModalConfirmar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalConfirmarAbierto(true);
  };

  // Envía la orden a PHP para generar y guardar la contraseña temporal
  const confirmarGenerarTemporal = async () => {
    if (!usuarioSeleccionado) return;
    setProcesandoClave(true);

    try {
      const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/usuarios.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'generar_temporal',
          id_usuario: usuarioSeleccionado.id_usuario,
        }),
      });

      const datos = await respuesta.json();

      if (datos.exito) {
        setClaveTemporalGenerada(datos.claveTemporal);
        setModalConfirmarAbierto(false);
        setCopiado(false);
        setModalGeneradaAbierto(true);
      } else {
        alert(datos.mensaje || 'No se pudo generar la contraseña temporal.');
      }
    } catch (error) {
      alert('Error de conexión al intentar restablecer la contraseña.');
    } finally {
      setProcesandoClave(false);
    }
  };

  // Copia la contraseña temporal al portapapeles
  const copiarClave = () => {
    navigator.clipboard.writeText(claveTemporalGenerada);
    setCopiado(true);
  };

  return (
    <>
      <div className="encabezado-seccion">
        <div className="titulos">
          <h2>Gestión de Usuarios</h2>
          <p>Gestiona el personal de la panadería, roles y permisos de acceso.</p>
        </div>
        <button
          type="button"
          className="btn-principal"
          onClick={onNuevoUsuario}
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-user-plus"></i> Añadir Usuario
        </button>
      </div>

      <div className="tarjeta-datos">
        <div className="barra-filtros">
          <div className="filtros-select">
            <select
              value={filtroRol}
              onChange={(e) => {
                setFiltroRol(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="Todos">Todos los Roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Cajero">Cajero</option>
              <option value="Panadero">Panadero</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <input
            type="text"
            className="buscador-tabla"
            placeholder="Buscar por nombre, correo o documento..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

        {errorCarga && <div className="alerta-error">{errorCarga}</div>}

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Cargando usuarios...
                </td>
              </tr>
            ) : usuariosPaginados.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron usuarios con esos filtros.
                </td>
              </tr>
            ) : (
              usuariosPaginados.map((item) => {
                const estaActivo = Number(item.estado) === 1;
                return (
                  <tr key={item.id_usuario}>
                    <td>{item.nombre_completo}</td>
                    <td>{item.correo}</td>
                    <td>{item.nombre_rol}</td>
                    <td>
                      <span className={`estado ${estaActivo ? 'activo' : 'inactivo'}`}>
                        ● {estaActivo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-icono btn-abrir-password"
                        title="Restablecer contraseña"
                        onClick={() => abrirModalConfirmar(item)}
                      >
                        <i className="fa-solid fa-key"></i>
                      </button>
                      <button
                        type="button"
                        className="btn-icono"
                        title="Editar usuario"
                        onClick={() => onEditarUsuario(item)}
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="paginacion-tabla">
          <p>
            Mostrando {totalResultados === 0 ? 0 : indiceInicio + 1} a{' '}
            {Math.min(indiceInicio + registrosPorPagina, totalResultados)} de {totalResultados} resultados
          </p>
          <div className="numeros-pagina">
            <button
              type="button"
              className="btn-pagina"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
            >
              &lt;
            </button>
            {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((numero) => (
              <button
                key={numero}
                type="button"
                className={`btn-pagina ${paginaActual === numero ? 'activa' : ''}`}
                onClick={() => setPaginaActual(numero)}
              >
                {numero}
              </button>
            ))}
            <button
              type="button"
              className="btn-pagina"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal Confirmación Restablecer Contraseña */}
      {modalConfirmarAbierto && usuarioSeleccionado && (
        <div id="modal-password" className="fondo-modal">
          <div className="contenido-modal">
            <div className="encabezado-modal-icono">
              <div className="icono-peligro">
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <h3>Restablecer contraseña</h3>
            </div>
            <p>¿Está seguro de que desea generar una contraseña temporal para este usuario?</p>

            <div className="caja-info-usuario">
              <p id="modal-nombre-usuario">
                <i className="fa-regular fa-user"></i> Nombre: {usuarioSeleccionado.nombre_completo}
              </p>
              <p id="modal-correo-usuario">
                <i className="fa-regular fa-envelope"></i> Correo: {usuarioSeleccionado.correo}
              </p>
            </div>

            <div className="acciones-modal">
              <button
                type="button"
                id="btn-cancelar-password"
                className="btn-secundario"
                onClick={() => setModalConfirmarAbierto(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirmar-password"
                className="btn-principal"
                disabled={procesandoClave}
                onClick={confirmarGenerarTemporal}
              >
                <i className="fa-solid fa-key"></i>{' '}
                {procesandoClave ? 'Generando...' : 'Generar contraseña temporal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Contraseña Generada */}
      {modalGeneradaAbierto && (
        <div id="modal-password-generada" className="fondo-modal">
          <div className="contenido-modal">
            <img src="/img/logo.jpg" alt="Logo Pan en su punto" className="logo-modal" />

            <p className="etiqueta-modal">Nueva credencial temporal:</p>
            <div className="caja-copiar">
              <span id="texto-contrasena-temp">{claveTemporalGenerada}</span>
              <button
                type="button"
                id="btn-copiar-password"
                className="btn-secundario"
                onClick={copiarClave}
              >
                <i className="fa-regular fa-copy"></i> {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="caja-advertencia">
              <div className="icono-escudo">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <p>
                Esta contraseña es temporal. El usuario deberá cambiarla obligatoriamente en su próximo inicio de
                sesión por motivos de seguridad.
              </p>
            </div>

            <button
              type="button"
              id="btn-cerrar-generada"
              className="btn-principal boton-ancho"
              onClick={() => setModalGeneradaAbierto(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ListaUsuarios;