import { useState } from 'react';
import Login from './components/usuarios/Login';
import LayoutPrincipal from './components/layout/LayoutPrincipal';
import PanelInicio from './components/inicio/PanelInicio';
import ListaUsuarios from './components/usuarios/ListaUsuarios';
import NuevoUsuario from './components/usuarios/NuevoUsuario';
import EditarUsuario from './components/usuarios/EditarUsuario';
import ActualizarContrasena from './components/usuarios/ActualizarContrasena';

/**
 * Componente raíz App
 * Controla la sesión persistente (RF 10), el cierre manual (RF 09)
 * y la navegación entre vistas sin recargar la página.
 */
function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuarioActivo');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  const [vistaActual, setVistaActual] = useState('inicio');
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActivo');
    setUsuarioActivo(null);
    setVistaActual('inicio');
  };

  if (!usuarioActivo) {
    return <Login onLoginExitoso={(usuario) => setUsuarioActivo(usuario)} />;
  }

  // Pantalla completa sin menú lateral para actualizar contraseña (RF 05 y RF 12)
  if (vistaActual === 'cambiar-contrasena') {
    return (
      <ActualizarContrasena
        usuarioActivo={usuarioActivo}
        onContinuar={() => setVistaActual('inicio')}
      />
    );
  }

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'inicio':
        return <PanelInicio cambiarVista={setVistaActual} />;
      case 'usuarios':
        return (
          <ListaUsuarios
            onNuevoUsuario={() => setVistaActual('nuevo-usuario')}
            onEditarUsuario={(usuario) => {
              setUsuarioAEditar(usuario);
              setVistaActual('editar-usuario');
            }}
          />
        );
      case 'nuevo-usuario':
        return <NuevoUsuario onVolver={() => setVistaActual('usuarios')} />;
      case 'editar-usuario':
        return (
          <EditarUsuario
            usuario={usuarioAEditar}
            onVolver={() => {
              setUsuarioAEditar(null);
              setVistaActual('usuarios');
            }}
          />
        );
      default:
        return (
          <div className="encabezado-panel">
            <h1>Módulo en construcción: {vistaActual}</h1>
            <p>Aquí conectaremos la pantalla correspondiente.</p>
          </div>
        );
    }
  };

  return (
    <LayoutPrincipal
      usuarioActivo={usuarioActivo}
      vistaActual={vistaActual}
      cambiarVista={setVistaActual}
      cerrarSesion={cerrarSesion}
    >
      {renderizarVista()}
    </LayoutPrincipal>
  );
}

export default App;