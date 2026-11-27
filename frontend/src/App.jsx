import { useState } from 'react';
import Login from './components/usuarios/Login';
import LayoutPrincipal from './components/layout/LayoutPrincipal';
import PanelInicio from './components/inicio/PanelInicio';
import ListaUsuarios from './components/usuarios/ListaUsuarios';
import NuevoUsuario from './components/usuarios/NuevoUsuario';
import EditarUsuario from './components/usuarios/EditarUsuario';
import ActualizarContrasena from './components/usuarios/ActualizarContrasena';
import RecetasInicio from './components/recetas/RecetasInicio';
import GestionRecetas from './components/recetas/GestionRecetas';
import NuevaReceta from './components/recetas/NuevaReceta';
import EditarReceta from './components/recetas/EditarReceta';
import ConsultarReceta from './components/recetas/ConsultarReceta';

/**
 * Componente raíz App
 * Controla la sesión persistente (RF 10), el cierre manual (RF 09),
 * permisos por rol y navegación entre vistas sin recargar la página.
 */
function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuarioActivo');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  const [vistaActual, setVistaActual] = useState('inicio');
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [recetaAEditar, setRecetaAEditar] = useState(null);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActivo');
    setUsuarioActivo(null);
    setVistaActual('inicio');
  };

  if (!usuarioActivo) {
    return <Login onLoginExitoso={(usuario) => setUsuarioActivo(usuario)} />;
  }

  const cambioObligatorio = Number(usuarioActivo.debe_cambiar_contrasena) === 1;
  const esAdministrador = usuarioActivo.nombre_rol?.toLowerCase() === 'administrador';

  // Pantalla completa sin menú lateral para actualizar contraseña (RF 05 y RF 12)
  if (cambioObligatorio || vistaActual === 'cambiar-contrasena') {
    return (
      <ActualizarContrasena
        usuarioActivo={usuarioActivo}
        esObligatorio={cambioObligatorio}
        onContinuar={() => {
          const usuarioActualizado = { ...usuarioActivo, debe_cambiar_contrasena: 0 };
          localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado));
          setUsuarioActivo(usuarioActualizado);
          setVistaActual('inicio');
        }}
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
      case 'recetas':
        return <RecetasInicio usuarioActivo={usuarioActivo} cambiarVista={setVistaActual} />;
      case 'gestion-recetas':
        return esAdministrador ? (
          <GestionRecetas
            onVolver={() => setVistaActual('recetas')}
            onNuevaReceta={() => setVistaActual('nueva-receta')}
            onEditarReceta={(receta) => {
              setRecetaAEditar(receta);
              setVistaActual('editar-receta');
            }}
          />
        ) : (
          <RecetasInicio usuarioActivo={usuarioActivo} cambiarVista={setVistaActual} />
        );
      case 'nueva-receta':
        return esAdministrador ? (
          <NuevaReceta onVolver={() => setVistaActual('gestion-recetas')} />
        ) : (
          <RecetasInicio usuarioActivo={usuarioActivo} cambiarVista={setVistaActual} />
        );
      case 'editar-receta':
        return esAdministrador ? (
          <EditarReceta
            receta={recetaAEditar}
            onVolver={() => {
              setRecetaAEditar(null);
              setVistaActual('gestion-recetas');
            }}
          />
        ) : (
          <RecetasInicio usuarioActivo={usuarioActivo} cambiarVista={setVistaActual} />
        );
      case 'consultar-receta':
        return (
          <ConsultarReceta
            usuarioActivo={usuarioActivo}
            onVolver={() => setVistaActual('recetas')}
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