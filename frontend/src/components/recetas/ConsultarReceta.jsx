import { useState, useEffect } from 'react';

/**
 * Componente ConsultarReceta (RF 22 y RF 30)
 * Vista de solo lectura con selector de fórmula, parámetros de producción,
 * tabla de ingredientes y paso a paso de preparación.
 */
function ConsultarReceta({ usuarioActivo, onVolver }) {
    const [recetas, setRecetas] = useState([]);
    const [idRecetaSeleccionada, setIdRecetaSeleccionada] = useState('');
    const [detalleReceta, setDetalleReceta] = useState(null);
    const [ingredientes, setIngredientes] = useState([]);

    const [cargandoLista, setCargandoLista] = useState(true);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);
    const [errorCarga, setErrorCarga] = useState('');

    const esPanadero = usuarioActivo?.nombre_rol?.toLowerCase() === 'panadero';

    const formatearCodigoReceta = (idReceta) => {
        return `R-${String(idReceta).padStart(3, '0')}`;
    };

    const formatearUnidad = (unidad) => {
        const mapaUnidades = {
            g: 'Gramos (g)',
            gr: 'Gramos (g)',
            kg: 'Kilogramos (kg)',
            ml: 'Mililitros (ml)',
            l: 'Litros (l)',
            lt: 'Litros (l)',
            und: 'Unidades (und)',
        };
        const clave = (unidad || '').toLowerCase().trim();
        return mapaUnidades[clave] || unidad || '-';
    };

    // Extrae tiempos, temperatura y pasos desde el campo instrucciones
    const descomponerInstrucciones = (textoCompleto) => {
        const texto = textoCompleto || '';
        const partes = texto.split('\n\n');

        if (partes.length >= 2 && (partes[0].includes('min') || partes[0].includes('°C'))) {
            const encabezado = partes[0];
            const cuerpo = partes.slice(1).join('\n\n');

            const matchPrep = encabezado.match(/Tiempo de preparación:\s*(\d+)\s*min/i);
            const matchTemp = encabezado.match(/Temperatura de horneado:\s*(\d+)\s*°C/i);
            const matchHorn = encabezado.match(/Tiempo de horneado:\s*(\d+)\s*min/i);

            return {
                prep: matchPrep ? `${matchPrep[1]} minutos` : 'No especificado',
                temp: matchTemp ? `${matchTemp[1]} °C` : 'No especificada',
                horn: matchHorn ? `${matchHorn[1]} minutos` : 'No especificado',
                pasos: cuerpo,
            };
        }

        return {
            prep: 'No especificado',
            temp: 'No especificada',
            horn: 'No especificado',
            pasos: texto,
        };
    };

    // 1. Carga el listado de recetas disponibles para el selector
    useEffect(() => {
        const cargarListaRecetas = async () => {
            setCargandoLista(true);
            setErrorCarga('');

            try {
                const respuesta = await fetch(
                    'http://localhost/Pan%20en%20su%20punto/backend/recetas.php?accion=listar'
                );
                const datos = await respuesta.json();

                if (datos.exito) {
                    // El panadero solo consulta recetas activas; el administrador puede ver todas
                    const listaFiltrada = esPanadero
                        ? datos.recetas.filter((item) => Number(item.estado) === 1)
                        : datos.recetas;

                    setRecetas(listaFiltrada);

                    if (listaFiltrada.length > 0) {
                        setIdRecetaSeleccionada(String(listaFiltrada[0].id_receta));
                    }
                } else {
                    setErrorCarga(datos.mensaje || 'No se pudieron cargar las recetas.');
                }
            } catch (error) {
                setErrorCarga('Error de conexión con el servidor. Verifica que Apache esté encendido.');
            } finally {
                setCargandoLista(false);
            }
        };

        cargarListaRecetas();
    }, [esPanadero]);

    // 2. Carga la ficha técnica e ingredientes cuando cambia la receta seleccionada
    useEffect(() => {
        const cargarDetalle = async () => {
            if (!idRecetaSeleccionada) {
                setDetalleReceta(null);
                setIngredientes([]);
                return;
            }

            setCargandoDetalle(true);
            setErrorCarga('');

            try {
                const respuesta = await fetch(
                    `http://localhost/Pan%20en%20su%20punto/backend/recetas.php?accion=detalle&id_receta=${idRecetaSeleccionada}`
                );
                const datos = await respuesta.json();

                if (datos.exito) {
                    setDetalleReceta(datos.receta);
                    setIngredientes(datos.ingredientes);
                } else {
                    setErrorCarga(datos.mensaje || 'No se pudo cargar la ficha técnica.');
                }
            } catch (error) {
                setErrorCarga('Error de conexión al consultar los ingredientes de la receta.');
            } finally {
                setCargandoDetalle(false);
            }
        };

        cargarDetalle();
    }, [idRecetaSeleccionada]);

    const infoInstrucciones = descomponerInstrucciones(detalleReceta?.instrucciones);
    const listaPasos = infoInstrucciones.pasos
        .split('\n')
        .map((linea) => linea.trim().replace(/^\d+[\.\)\-]\s*/, ''))
        .filter((linea) => linea !== '');

    return (
        <>
            <div className="encabezado-seccion">
                <div>
                    <h2>Ficha técnica de receta</h2>
                    <p>Consulta estandarizada de ingredientes, proporciones e instrucciones para el horneado.</p>
                </div>
                <div className="acciones-encabezado">
                    <button
                        type="button"
                        className="btn-principal"
                        onClick={onVolver}
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-arrow-left"></i> Volver
                    </button>
                </div>
            </div>

            {errorCarga && (
                <div className="alerta-error" style={{ marginBottom: '16px' }}>
                    {errorCarga}
                </div>
            )}

            {/* Selector de receta para cambiar de fórmula rápidamente */}
            <div className="tarjeta-datos barra-filtro-receta">
                <div className="grupo-input">
                    <label htmlFor="selector-receta-consulta">Seleccionar receta para consultar:</label>
                    <select
                        id="selector-receta-consulta"
                        value={idRecetaSeleccionada}
                        onChange={(e) => setIdRecetaSeleccionada(e.target.value)}
                        disabled={cargandoLista || recetas.length === 0}
                    >
                        {recetas.length === 0 ? (
                            <option value="">No hay recetas disponibles para consultar</option>
                        ) : (
                            recetas.map((item) => (
                                <option key={item.id_receta} value={item.id_receta}>
                                    {formatearCodigoReceta(item.id_receta)} - Fórmula {item.nombre_producto} ({item.nombre_producto})
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>

            {cargandoLista || cargandoDetalle ? (
                <div className="tarjeta-datos">
                    <p style={{ textAlign: 'center', padding: '24px' }}>Cargando ficha técnica...</p>
                </div>
            ) : !detalleReceta ? (
                <div className="tarjeta-datos">
                    <p style={{ textAlign: 'center', padding: '24px' }}>
                        Aún no hay recetas registradas para mostrar en la ficha técnica.
                    </p>
                </div>
            ) : (
                <div className="tarjeta-datos ficha-lectura">
                    {/* Resumen de ficha */}
                    <div className="cabecera-ficha">
                        <div className="info-principal-receta">
                            <span className="etiqueta-codigo">
                                {formatearCodigoReceta(detalleReceta.id_receta)}
                            </span>
                            <h3>Fórmula {detalleReceta.nombre_producto}</h3>
                            <p className="subtitulo-producto">
                                Producto vinculado: <strong>{detalleReceta.nombre_producto}</strong>
                            </p>
                        </div>
                        <div className="estado-ficha">
                            <span
                                className={
                                    Number(detalleReceta.estado) === 1 ? 'estado-activo' : 'estado-inactivo'
                                }
                            >
                                {Number(detalleReceta.estado) === 1 ? 'Receta activa' : 'Receta inactiva'}
                            </span>
                        </div>
                    </div>

                    {/* Parámetros clave de producción */}
                    <div className="metricas-ficha-grid">
                        <div className="metrica-item">
                            <span className="metrica-etiqueta">Rendimiento</span>
                            <span className="metrica-valor">{detalleReceta.rendimiento} unidades</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-etiqueta">Tiempo de preparación</span>
                            <span className="metrica-valor">{infoInstrucciones.prep}</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-etiqueta">Temperatura de horneado</span>
                            <span className="metrica-valor">{infoInstrucciones.temp}</span>
                        </div>
                        <div className="metrica-item">
                            <span className="metrica-etiqueta">Tiempo de horneado</span>
                            <span className="metrica-valor">{infoInstrucciones.horn}</span>
                        </div>
                    </div>

                    {/* Lista de ingredientes */}
                    <h4 className="subtitulo-seccion-ficha">Ingredientes y dosificación</h4>
                    <table className="tabla-datos tabla-solo-lectura">
                        <thead>
                            <tr>
                                <th>Materia prima</th>
                                <th>Cantidad requerida</th>
                                <th>Unidad de medida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredientes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '16px' }}>
                                        Esta receta no tiene ingredientes registrados.
                                    </td>
                                </tr>
                            ) : (
                                ingredientes.map((ing) => (
                                    <tr key={ing.id_detalle_receta}>
                                        <td>{ing.nombre}</td>
                                        <td>{Number(ing.cantidad_requerida).toLocaleString('es-CO')}</td>
                                        <td>{formatearUnidad(ing.unidad_medida)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Procedimiento de preparación */}
                    <h4 className="subtitulo-seccion-ficha">Paso a paso e instrucciones de preparación</h4>
                    <div className="caja-instrucciones-lectura">
                        {listaPasos.length > 0 ? (
                            <ol>
                                {listaPasos.map((paso, index) => (
                                    <li key={index}>{paso}</li>
                                ))}
                            </ol>
                        ) : (
                            <p>Sin instrucciones registradas.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ConsultarReceta;