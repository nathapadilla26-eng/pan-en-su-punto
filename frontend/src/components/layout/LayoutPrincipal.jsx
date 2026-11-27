import { useState } from 'react';

/**
 * Componente LayoutPrincipal
 * Renderiza el menú lateral y la barra superior con el perfil del usuario activo.
 * Aplica control de acceso por rol (RF 06, RF 07, RF 08) y cierre de sesión manual (RF 09).
 */
function LayoutPrincipal({ usuarioActivo, vistaActual, cambiarVista, cerrarSesion, children }) {
  // Estados para abrir/cerrar el menú en móvil y el menú flotante del avatar
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // Define los módulos visibles según el rol del usuario autenticado
  const rol = usuarioActivo?.nombre_rol || 'Administrador';

  const opcionesMenu = [
    { id: 'inicio', texto: 'Inicio', icono: 'fa-solid fa-house', roles: ['Administrador', 'Cajero', 'Panadero'] },
    { id: 'usuarios', texto: 'Usuarios', icono: 'fa-solid fa-users', roles: ['Administrador'] },
    { id: 'inventario', texto: 'Inventario', icono: 'fa-solid fa-box', roles: ['Administrador', 'Panadero'] },
    { id: 'recetas', texto: 'Recetas', icono: 'fa-solid fa-book', roles: ['Administrador'] },
    { id: 'produccion', texto: 'Producción', icono: 'fa-solid fa-fire-burner', roles: ['Administrador', 'Panadero'] },
    { id: 'ventas', texto: 'Ventas', icono: 'fa-solid fa-cash-register', roles: ['Administrador', 'Cajero'] },
    { id: 'reportes', texto: 'Reportes', icono: 'fa-solid fa-chart-line', roles: ['Administrador'] },
    { id: 'configuracion', texto: 'Configuración', icono: 'fa-solid fa-gear', roles: ['Administrador'] },
  ];

  const menuFiltrado = opcionesMenu.filter((item) => item.roles.includes(rol));

  // Obtiene la inicial del nombre del usuario para el botón circular del avatar
  const inicialUsuario = usuarioActivo?.nombre_completo
    ? usuarioActivo.nombre_completo.charAt(0).toUpperCase()
    : 'U';

  const manejarNavegacion = (evento, idVista) => {
    evento.preventDefault();
    cambiarVista(idVista);
    setMenuMovilAbierto(false);
    setDropdownAbierto(false);
  };

  return (
    <>
      {/* Menú lateral reutilizable */}
      <nav className={`menu-lateral ${menuMovilAbierto ? 'activo' : ''}`}>
        <button
          type="button"
          id="btn-cerrar-menu"
          className="btn-cerrar-menu"
          onClick={() => setMenuMovilAbierto(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="logo-contenedor">
          <img src="/img/logo.jpg" alt="Logo Pan en su punto" />
        </div>

        <ul>
          {menuFiltrado.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={vistaActual === item.id ? 'activo' : ''}
                onClick={(evento) => manejarNavegacion(evento, item.id)}
              >
                <i className={item.icono}></i> {item.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contenedor derecho principal */}
      <main className="contenido-principal">
        <header className="barra-superior">
          <div className="buscador">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Buscar..." />
          </div>

          <div className="iconos-usuario">
            <i className="fa-regular fa-bell"></i>

            {/* Contenedor del avatar con menú desplegable */}
            <div className="contenedor-perfil-cabecera">
              <button
                type="button"
                className="btn-avatar-usuario"
                id="btn-avatar-usuario"
                aria-expanded={dropdownAbierto}
                aria-haspopup="true"
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
              >
                <span>{inicialUsuario}</span>
              </button>

              {/* Menú flotante de perfil y cierre de sesión (RF 09 y RF 12) */}
              <div
                id="dropdown-menu-usuario"
                className={`dropdown-usuario ${dropdownAbierto ? '' : 'oculto'}`}
                role="menu"
              >
                <div className="encabezado-dropdown-usuario">
                  <p className="nombre-usuario-sesion">{usuarioActivo?.nombre_completo}</p>
                  <span className="insignia-rol admin">{rol}</span>
                </div>
                <hr className="separador-dropdown" />
                <ul className="lista-opciones-dropdown">
                  <li>
                    <a
                      href="#cambiar-contrasena"
                      className="opcion-dropdown"
                      role="menuitem"
                      onClick={(evento) => manejarNavegacion(evento, 'cambiar-contrasena')}
                    >
                      <i className="fa-solid fa-key"></i>
                      <span>Cambiar contraseña</span>
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="opcion-dropdown salir"
                      role="menuitem"
                      onClick={cerrarSesion}
                      style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      <span>Cerrar sesión</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Botón hamburguesa para pantallas pequeñas */}
        <div className="encabezado-panel" style={{ paddingBottom: 0 }}>
          <button
            type="button"
            id="btn-hamburguesa"
            className="menu-movil-btn"
            onClick={() => setMenuMovilAbierto(true)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {/* Contenido dinámico de cada módulo */}
        {children}
      </main>
    </>
  );
}

export default LayoutPrincipal;