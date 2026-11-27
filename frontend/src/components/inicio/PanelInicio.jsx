/**
 * Componente PanelInicio
 * Muestra el resumen operativo, tarjetas de indicadores y accesos directos del sistema.
 */
function PanelInicio({ cambiarVista }) {
  const navegar = (evento, destino) => {
    evento.preventDefault();
    cambiarVista(destino);
  };

  return (
    <>
      <div className="encabezado-panel">
        <h1>Panel de inicio</h1>
        <p>Resumen operativo de hoy</p>
      </div>

      {/* Tarjetas de indicadores principales */}
      <div className="contenedor-tarjetas">
        <div className="tarjeta">
          <div className="tarjeta-cabecera">
            <h3>Ventas del día</h3>
            <span className="insignia-positiva">
              <i className="fa-solid fa-arrow-trend-up"></i> +12%
            </span>
          </div>
          <p className="cifra-principal">$850.000 COP</p>
        </div>

        <div className="tarjeta">
          <div className="tarjeta-cabecera">
            <h3>Producción Activa</h3>
            <i className="fa-solid fa-shop icono-produccion"></i>
          </div>
          <div className="contenido-produccion">
            <div className="circulo-progreso">
              <span>65%</span>
            </div>
            <div className="info-produccion">
              <p className="cifra-principal">4 Lotes</p>
              <span className="insignia-estado">En horno</span>
            </div>
          </div>
        </div>

        <div className="tarjeta">
          <div className="tarjeta-cabecera">
            <h3>Alertas de Inventario</h3>
            <span className="icono-alerta">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </span>
          </div>
          <p className="cifra-alerta">3 Insumos</p>
          <span className="insignia-critica">
            <i className="fa-solid fa-circle-exclamation"></i> Stock crítico detectado
          </span>
        </div>
      </div>

      <div className="contenedor-inferior">
        {/* Tabla de actividad reciente */}
        <div className="seccion-actividad">
          <div className="actividad-cabecera">
            <h2>Actividad reciente</h2>
            <a href="#reportes" onClick={(evento) => navegar(evento, 'reportes')}>
              Ver todo
            </a>
          </div>
          <div className="tabla-contenedor">
            <table className="tabla-actividad">
              <thead>
                <tr>
                  <th>Lote / Receta</th>
                  <th>Estado</th>
                  <th>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>R-014 - Croissant Francés</td>
                  <td>
                    <span className="insignia-estado">Finalizado</span>
                  </td>
                  <td>Hoy, 10:30 AM</td>
                </tr>
                <tr>
                  <td>R-001 - Masa Madre Clásica</td>
                  <td>
                    <span className="insignia-estado">En fermentación</span>
                  </td>
                  <td>Hoy, 09:15 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="lista-accesos">
          <a href="#reportes" className="btn-acceso" onClick={(evento) => navegar(evento, 'reportes')}>
            <i className="fa-solid fa-chart-line"></i> Reportes{' '}
            <i className="fa-solid fa-arrow-right flecha"></i>
          </a>
          <a href="#produccion" className="btn-acceso" onClick={(evento) => navegar(evento, 'produccion')}>
            <i className="fa-solid fa-plus"></i> Añadir producción{' '}
            <i className="fa-solid fa-arrow-right flecha"></i>
          </a>
          <a href="#recetas" className="btn-acceso" onClick={(evento) => navegar(evento, 'recetas')}>
            <i className="fa-solid fa-book-open"></i> Consultar recetario{' '}
            <i className="fa-solid fa-arrow-right flecha"></i>
          </a>
        </div>
      </div>
    </>
  );
}

export default PanelInicio;