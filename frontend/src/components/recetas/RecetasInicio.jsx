import { useState, useEffect } from 'react';

/**
 * Componente RecetasInicio (RF 22 y RF 30)
 * Muestra el panel de control de recetas y adapta las herramientas disponibles
 * según el rol del usuario autenticado (Administrador o Panadero).
 */
function RecetasInicio({ usuarioActivo, cambiarVista }) {
    const [activas, setActivas] = useState(0);
    const [inactivas, setInactivas] = useState(0);
    const [recientes, setRecientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState('');

    const esAdministrador = usuarioActivo?.nombre_rol?.toLowerCase() === 'administrador';

    useEffect(() => {
        const cargarResumenRecetas = async () => {
            setCargando(true);
            setErrorCarga('');

            try {
                const respuesta = await fetch(
                    'http://localhost/Pan%20en%20su%20punto/backend/recetas.php?accion=resumen'
                );
                const datos = await respuesta.json();

                if (datos.exito) {
                    setActivas(datos.activas);
                    setInactivas(datos.inactivas);
                    setRecientes(datos.recientes);
                } else {
                    setErrorCarga(datos.mensaje || 'No se pudo cargar el resumen de recetas.');
                }
            } catch (error) {
                setErrorCarga('Error de conexión con el servidor. Verifica que Apache esté encendido.');
            } finally {
                setCargando(false);
            }
        };

        cargarResumenRecetas();
    }, []);

    const navegar = (evento, destino) => {
        evento.preventDefault();
        cambiarVista(destino);
    };

    return (
        <>
            <div className="encabezado-seccion">
                <div className="titulos">
                    <h2>Panel de control de recetas</h2>
                    <p>Monitorea el estado de las fórmulas y accede a las herramientas de gestión.</p>
                </div>
            </div>

            {errorCarga && (
                <div className="alerta-error" style={{ marginBottom: '16px' }}>
                    {errorCarga}
                </div>
            )}

            {/* Indicadores principales conectados a MySQL */}
            <div className="kpi-container">
                <div className="kpi-card kpi-normal">
                    <p className="kpi-titulo">Recetas activas</p>
                    <h3>{cargando ? '...' : activas}</h3>
                    <p className="kpi-detalle">Listas para producción</p>
                </div>

                <div className="kpi-card kpi-alerta">
                    <p className="kpi-titulo">Recetas inactivas</p>
                    <h3 className="peligro">{cargando ? '...' : inactivas}</h3>
                    <p className="kpi-detalle">Pausadas o fuera de temporada</p>
                </div>

                <div className="kpi-card kpi-valor">
                    <p className="kpi-titulo">Actualización de costos</p>
                    <h3>
                        <i className="fa-solid fa-check-circle icono-al-dia"></i> Al día
                    </h3>
                    <p className="kpi-detalle">Cálculo dinámico sincronizado</p>
                </div>
            </div>

            {/* Accesos directos según permisos del rol (RF 22 y RF 30) */}
            <div className="modulos-grid">
                {esAdministrador && (
                    <>
                        <a
                            href="#gestion-recetas"
                            className="modulo-card"
                            onClick={(evento) => navegar(evento, 'gestion-recetas')}
                        >
                            <div className="icono-modulo">
                                <i className="fa-solid fa-clipboard-list"></i>
                            </div>
                            <h3>Gestión de recetas</h3>
                            <p>Tabla general para activar, inactivar o editar.</p>
                        </a>

                        <a
                            href="#nueva-receta"
                            className="modulo-card"
                            onClick={(evento) => navegar(evento, 'nueva-receta')}
                        >
                            <div className="icono-modulo">
                                <i className="fa-solid fa-book-open"></i>
                            </div>
                            <h3>Crear receta</h3>
                            <p>Registra una nueva preparación en blanco.</p>
                        </a>
                    </>
                )}

                <a
                    href="#consultar-receta"
                    className="modulo-card"
                    onClick={(evento) => navegar(evento, 'consultar-receta')}
                >
                    <div className="icono-modulo">
                        <i className="fa-solid fa-eye"></i>
                    </div>
                    <h3>Consultar recetas</h3>
                    <p>Vista de solo lectura con ingredientes y paso a paso.</p>
                </a>
            </div>

            {/* Tabla de últimas recetas registradas */}
            <div className="tarjeta-datos tarjeta-recetas-recientes">
                <h3 className="titulo-recientes">Últimas recetas registradas</h3>
                <table className="tabla-datos">
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td style={{ textAlign: 'center', padding: '16px' }}>Cargando recetas...</td>
                            </tr>
                        ) : recientes.length === 0 ? (
                            <tr>
                                <td style={{ textAlign: 'center', padding: '16px' }}>
                                    Aún no hay recetas registradas en la base de datos.
                                </td>
                            </tr>
                        ) : (
                            recientes.map((item) => (
                                <tr key={item.id_receta}>
                                    <td>
                                        <strong>
                                            {item.codigo_producto} - {item.nombre_producto}
                                        </strong>{' '}
                                        <span className="detalle-receta-tabla">
                                            Rendimiento: {item.rendimiento} unidades
                                        </span>
                                    </td>
                                    <td className="fecha-receta-tabla">
                                        <span className={`estado ${Number(item.estado) === 1 ? 'activo' : 'inactivo'}`}>
                                            ● {Number(item.estado) === 1 ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default RecetasInicio;