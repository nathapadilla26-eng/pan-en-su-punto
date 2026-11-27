import { useState, useEffect } from 'react';

/**
 * Componente EditarReceta
 * Carga una receta existente desde MySQL con sus ingredientes, permite modificar
 * datos generales, cantidades con conversión automática de unidades (RF 27),
 * estado e instrucciones de preparación.
 */
function EditarReceta({ receta, onVolver }) {
    const [cargando, setCargando] = useState(true);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [materiasPrimas, setMateriasPrimas] = useState([]);

    // Campos de datos generales
    const [nombreReceta, setNombreReceta] = useState('');
    const [idProducto, setIdProducto] = useState('');
    const [rendimiento, setRendimiento] = useState('');
    const [tiempoPreparacion, setTiempoPreparacion] = useState('');
    const [estado, setEstado] = useState('1');

    // Lista dinámica de ingredientes
    const [ingredientes, setIngredientes] = useState([]);

    // Campos de instrucciones
    const [temperaturaHorneado, setTemperaturaHorneado] = useState('');
    const [tiempoHorneado, setTiempoHorneado] = useState('');
    const [pasoAPaso, setPasoAPaso] = useState('');

    // Estados de interfaz
    const [mensajeError, setMensajeError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [modalExitoAbierto, setModalExitoAbierto] = useState(false);

    const codigoRecetaFormateado = receta?.id_receta
        ? `R-${String(receta.id_receta).padStart(3, '0')}`
        : '';

    // Extrae los metadatos de tiempo/temperatura si existen al inicio de instrucciones
    const descomponerInstrucciones = (textoCompleto) => {
        const texto = textoCompleto || '';
        const partes = texto.split('\n\n');

        if (partes.length >= 2 && partes[0].includes('min') || partes[0].includes('°C')) {
            const encabezado = partes[0];
            const cuerpo = partes.slice(1).join('\n\n');

            const matchPrep = encabezado.match(/Tiempo de preparación:\s*(\d+)\s*min/i);
            const matchTemp = encabezado.match(/Temperatura de horneado:\s*(\d+)\s*°C/i);
            const matchHorn = encabezado.match(/Tiempo de horneado:\s*(\d+)\s*min/i);

            return {
                prep: matchPrep ? matchPrep[1] : '',
                temp: matchTemp ? matchTemp[1] : '',
                horn: matchHorn ? matchHorn[1] : '',
                pasos: cuerpo,
            };
        }

        return { prep: '', temp: '', horn: '', pasos: texto };
    };

    useEffect(() => {
        const cargarDetalleReceta = async () => {
            if (!receta?.id_receta) return;
            setCargando(true);
            setMensajeError('');

            try {
                const respuesta = await fetch(
                    `http://localhost/Pan%20en%20su%20punto/backend/recetas.php?accion=detalle&id_receta=${receta.id_receta}`
                );
                const datos = await respuesta.json();

                if (datos.exito) {
                    const info = datos.receta;
                    const descompuesto = descomponerInstrucciones(info.instrucciones);

                    setProductosDisponibles(datos.productos);
                    setMateriasPrimas(datos.materias_primas);

                    setNombreReceta(`Fórmula ${info.nombre_producto}`);
                    setIdProducto(String(info.id_producto));
                    setRendimiento(String(info.rendimiento));
                    setEstado(String(info.estado));
                    setTiempoPreparacion(descompuesto.prep);
                    setTemperaturaHorneado(descompuesto.temp);
                    setTiempoHorneado(descompuesto.horn);
                    setPasoAPaso(descompuesto.pasos);

                    const filasCargadas =
                        datos.ingredientes.length > 0
                            ? datos.ingredientes.map((ing) => ({
                                id_materia_prima: String(ing.id_materia_prima),
                                cantidad_ingresada: String(Number(ing.cantidad_requerida)),
                                unidad_seleccionada: ing.unidad_medida,
                            }))
                            : [{ id_materia_prima: '', cantidad_ingresada: '', unidad_seleccionada: '' }];

                    setIngredientes(filasCargadas);
                } else {
                    setMensajeError(datos.mensaje || 'No se pudo cargar el detalle de la receta.');
                }
            } catch (error) {
                setMensajeError('Error de conexión con el servidor. Verifica que Apache esté encendido.');
            } finally {
                setCargando(false);
            }
        };

        cargarDetalleReceta();
    }, [receta]);

    const obtenerMateriaPrima = (idMateria) => {
        return materiasPrimas.find((mp) => String(mp.id_materia_prima) === String(idMateria));
    };

    // Devuelve las unidades compatibles para conversión automática (RF 27)
    const obtenerUnidadesCompatibles = (unidadBase) => {
        const u = (unidadBase || '').toLowerCase().trim();
        if (u === 'g' || u === 'gr' || u === 'kg') return ['g', 'kg'];
        if (u === 'ml' || u === 'l' || u === 'lt') return ['ml', 'l'];
        return unidadBase ? [unidadBase] : ['-'];
    };

    // Convierte la cantidad digitada a la unidad base registrada en materias_primas (RF 27)
    const convertirAUnidadBase = (cantidad, unidadOrigen, unidadBase) => {
        const valor = Number(cantidad || 0);
        if (valor <= 0) return 0;

        const origen = (unidadOrigen || '').toLowerCase().trim();
        const destino = (unidadBase || '').toLowerCase().trim();

        if (origen === destino) return valor;
        if ((origen === 'g' || origen === 'gr') && destino === 'kg') return valor / 1000;
        if (origen === 'kg' && (destino === 'g' || destino === 'gr')) return valor * 1000;
        if (origen === 'ml' && (destino === 'l' || destino === 'lt')) return valor / 1000;
        if ((origen === 'l' || origen === 'lt') && destino === 'ml') return valor * 1000;

        return valor;
    };

    const calcularCostoFila = (fila) => {
        const materia = obtenerMateriaPrima(fila.id_materia_prima);
        if (!materia) return 0;
        const cantidadBase = convertirAUnidadBase(
            fila.cantidad_ingresada,
            fila.unidad_seleccionada || materia.unidad_medida,
            materia.unidad_medida
        );
        return cantidadBase * Number(materia.costo_unitario || 0);
    };

    const costoTotalEstimado = ingredientes.reduce(
        (acumulado, fila) => acumulado + calcularCostoFila(fila),
        0
    );
    const costoUnitarioEstimado =
        Number(rendimiento) > 0 ? costoTotalEstimado / Number(rendimiento) : 0;

    const formatearMoneda = (valor) => {
        return `$ ${Math.round(Number(valor || 0)).toLocaleString('es-CO')}`;
    };

    const manejarCambioProducto = (nuevoIdProducto) => {
        setIdProducto(nuevoIdProducto);
        const productoEncontrado = productosDisponibles.find(
            (prod) => String(prod.id_producto) === String(nuevoIdProducto)
        );
        if (productoEncontrado) {
            setNombreReceta(`Fórmula ${productoEncontrado.nombre}`);
        }
    };

    const agregarFilaIngrediente = () => {
        setIngredientes((prev) => [
            ...prev,
            { id_materia_prima: '', cantidad_ingresada: '', unidad_seleccionada: '' },
        ]);
    };

    const eliminarFilaIngrediente = (indice) => {
        if (ingredientes.length === 1) {
            setIngredientes([{ id_materia_prima: '', cantidad_ingresada: '', unidad_seleccionada: '' }]);
            return;
        }
        setIngredientes((prev) => prev.filter((_, idx) => idx !== indice));
    };

    const actualizarIngrediente = (indice, campo, valor) => {
        setIngredientes((prev) =>
            prev.map((fila, idx) => {
                if (idx !== indice) return fila;

                if (campo === 'id_materia_prima') {
                    const materia = obtenerMateriaPrima(valor);
                    return {
                        ...fila,
                        id_materia_prima: valor,
                        unidad_seleccionada: materia ? materia.unidad_medida : '',
                    };
                }

                return { ...fila, [campo]: valor };
            })
        );
    };

    const validarFormulario = () => {
        if (nombreReceta.trim() === '') {
            return 'Ingresa el nombre de la receta.';
        }
        if (!idProducto) {
            return 'Selecciona el producto terminado vinculado.';
        }
        if (!rendimiento || Number(rendimiento) <= 0) {
            return 'El rendimiento debe ser mayor a 0 unidades.';
        }
        if (ingredientes.length === 0) {
            return 'Debes mantener al menos un ingrediente en la receta.';
        }

        const idsUsados = new Set();
        for (let i = 0; i < ingredientes.length; i += 1) {
            const fila = ingredientes[i];
            if (!fila.id_materia_prima) {
                return `Selecciona la materia prima en la fila ${i + 1}.`;
            }
            if (idsUsados.has(String(fila.id_materia_prima))) {
                return 'Hay materias primas duplicadas. Consolida la cantidad en una sola fila.';
            }
            idsUsados.add(String(fila.id_materia_prima));

            if (!fila.cantidad_ingresada || Number(fila.cantidad_ingresada) <= 0) {
                return `Ingresa una cantidad mayor a 0 en la fila ${i + 1}.`;
            }
        }

        if (pasoAPaso.trim() === '') {
            return 'El paso a paso detallado es obligatorio.';
        }

        return '';
    };

    const manejarActualizarReceta = async (evento) => {
        evento.preventDefault();

        const errorValidacion = validarFormulario();
        if (errorValidacion !== '') {
            setMensajeError(errorValidacion);
            return;
        }

        setMensajeError('');
        setGuardando(true);

        try {
            const ingredientesNormalizados = ingredientes.map((fila) => {
                const materia = obtenerMateriaPrima(fila.id_materia_prima);
                const cantidadEnBase = convertirAUnidadBase(
                    fila.cantidad_ingresada,
                    fila.unidad_seleccionada || materia?.unidad_medida,
                    materia?.unidad_medida
                );

                return {
                    id_materia_prima: Number(fila.id_materia_prima),
                    cantidad_requerida: Number(cantidadEnBase.toFixed(4)),
                };
            });

            const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/recetas.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'editar',
                    id_receta: receta.id_receta,
                    id_producto: Number(idProducto),
                    rendimiento: Number(rendimiento),
                    estado: Number(estado),
                    tiempo_preparacion: tiempoPreparacion,
                    temperatura_horneado: temperaturaHorneado,
                    tiempo_horneado: tiempoHorneado,
                    paso_a_paso: pasoAPaso.trim(),
                    ingredientes: ingredientesNormalizados,
                }),
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                setModalExitoAbierto(true);
            } else {
                setMensajeError(datos.mensaje || 'No se pudieron guardar los cambios de la receta.');
            }
        } catch (error) {
            setMensajeError('Error de conexión con el servidor. Verifica que Apache esté encendido.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            <div className="encabezado-seccion">
                <div>
                    <h2>Editar receta</h2>
                    <p>Modifica la formulación técnica, ingredientes o rendimiento de la receta.</p>
                </div>
                <button
                    type="button"
                    className="btn-principal"
                    onClick={onVolver}
                    style={{ border: 'none', cursor: 'pointer' }}
                >
                    <i className="fa-solid fa-arrow-left"></i> Volver a recetas
                </button>
            </div>

            <div className="tarjeta-formulario">
                {mensajeError && (
                    <div className="alerta-error" style={{ marginBottom: '16px' }}>
                        {mensajeError}
                    </div>
                )}

                {cargando ? (
                    <p style={{ textAlign: 'center', padding: '24px' }}>Cargando datos de la receta...</p>
                ) : (
                    <form id="form-editar-receta" onSubmit={manejarActualizarReceta}>
                        <h3>Datos generales</h3>
                        <div className="formulario-cuadricula">
                            <div className="grupo-input">
                                <label htmlFor="codigo-receta">
                                    Código de receta <span className="requerido">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="codigo-receta"
                                    value={codigoRecetaFormateado}
                                    readOnly
                                    className="input-bloqueado"
                                />
                            </div>

                            <div className="grupo-input">
                                <label htmlFor="nombre-receta">
                                    Nombre de la receta <span className="requerido">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nombre-receta"
                                    value={nombreReceta}
                                    onChange={(e) => setNombreReceta(e.target.value)}
                                />
                            </div>

                            <div className="grupo-input">
                                <label htmlFor="producto-vinculado">
                                    Producto terminado vinculado <span className="requerido">*</span>
                                </label>
                                <select
                                    id="producto-vinculado"
                                    value={idProducto}
                                    onChange={(e) => manejarCambioProducto(e.target.value)}
                                >
                                    <option value="">Seleccione...</option>
                                    {productosDisponibles.map((prod) => (
                                        <option key={prod.id_producto} value={prod.id_producto}>
                                            {prod.codigo} - {prod.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grupo-input">
                                <label htmlFor="rendimiento">
                                    Rendimiento (unidades) <span className="requerido">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="rendimiento"
                                    min="1"
                                    value={rendimiento}
                                    onChange={(e) => setRendimiento(e.target.value)}
                                />
                            </div>

                            <div className="grupo-input">
                                <label htmlFor="tiempo-prep">Tiempo de preparación (minutos)</label>
                                <input
                                    type="number"
                                    id="tiempo-prep"
                                    min="0"
                                    value={tiempoPreparacion}
                                    onChange={(e) => setTiempoPreparacion(e.target.value)}
                                />
                            </div>

                            <div className="grupo-input">
                                <label htmlFor="estado-receta">
                                    Estado de la receta <span className="requerido">*</span>
                                </label>
                                <select
                                    id="estado-receta"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="1">Activa</option>
                                    <option value="0">Inactiva</option>
                                </select>
                            </div>
                        </div>

                        <h3>Ingredientes requeridos</h3>
                        <div className="contenedor-tabla-formulario">
                            <table className="tabla-datos">
                                <thead>
                                    <tr>
                                        <th>Materia prima</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Costo estimado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="lista-ingredientes">
                                    {ingredientes.map((fila, indice) => {
                                        const materia = obtenerMateriaPrima(fila.id_materia_prima);
                                        const unidadesDisponibles = obtenerUnidadesCompatibles(materia?.unidad_medida);
                                        const costoFila = calcularCostoFila(fila);

                                        return (
                                            <tr key={indice}>
                                                <td>
                                                    <select
                                                        value={fila.id_materia_prima}
                                                        onChange={(e) =>
                                                            actualizarIngrediente(indice, 'id_materia_prima', e.target.value)
                                                        }
                                                        style={{ width: '100%' }}
                                                    >
                                                        <option value="">Seleccione insumo...</option>
                                                        {materiasPrimas.map((mp) => (
                                                            <option key={mp.id_materia_prima} value={mp.id_materia_prima}>
                                                                {mp.nombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={fila.cantidad_ingresada}
                                                        onChange={(e) =>
                                                            actualizarIngrediente(indice, 'cantidad_ingresada', e.target.value)
                                                        }
                                                        style={{ width: '110px' }}
                                                    />
                                                </td>
                                                <td>
                                                    {materia ? (
                                                        <select
                                                            value={fila.unidad_seleccionada || materia.unidad_medida}
                                                            onChange={(e) =>
                                                                actualizarIngrediente(indice, 'unidad_seleccionada', e.target.value)
                                                            }
                                                        >
                                                            {unidadesDisponibles.map((unidad) => (
                                                                <option key={unidad} value={unidad}>
                                                                    {unidad}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                                <td>{formatearMoneda(costoFila)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn-icono btn-eliminar-fila"
                                                        title="Quitar ingrediente"
                                                        onClick={() => eliminarFilaIngrediente(indice)}
                                                        style={{ border: 'none', cursor: 'pointer' }}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                    marginTop: '12px',
                                }}
                            >
                                <button
                                    type="button"
                                    id="btn-agregar-ingrediente"
                                    className="btn-secundario"
                                    onClick={agregarFilaIngrediente}
                                    style={{ border: 'none', cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-plus"></i> Agregar ingrediente
                                </button>

                                <div style={{ fontSize: '14px', color: '#5c4033' }}>
                                    <strong>Costo total lote:</strong> {formatearMoneda(costoTotalEstimado)} &nbsp;|&nbsp;
                                    <strong>Costo unitario:</strong> {formatearMoneda(costoUnitarioEstimado)}
                                </div>
                            </div>
                        </div>

                        <h3>Instrucciones de preparación</h3>
                        <div className="formulario-cuadricula">
                            <div className="grupo-input">
                                <label htmlFor="temp-horneado">Temperatura de horneado (°C)</label>
                                <input
                                    type="number"
                                    id="temp-horneado"
                                    min="0"
                                    value={temperaturaHorneado}
                                    onChange={(e) => setTemperaturaHorneado(e.target.value)}
                                />
                            </div>

                            <div className="grupo-input">
                                <label htmlFor="tiempo-horneado">Tiempo de horneado (minutos)</label>
                                <input
                                    type="number"
                                    id="tiempo-horneado"
                                    min="0"
                                    value={tiempoHorneado}
                                    onChange={(e) => setTiempoHorneado(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grupo-input ancho-completo">
                            <label htmlFor="paso-a-paso">
                                Paso a paso detallado <span className="requerido">*</span>
                            </label>
                            <textarea
                                id="paso-a-paso"
                                rows="4"
                                value={pasoAPaso}
                                onChange={(e) => setPasoAPaso(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="acciones-formulario">
                            <button
                                type="button"
                                className="btn-secundario"
                                onClick={onVolver}
                                style={{ border: 'none', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                id="btn-actualizar-receta"
                                className="btn-principal"
                                disabled={guardando}
                                style={{ border: 'none', cursor: 'pointer' }}
                            >
                                {guardando ? 'Actualizando...' : 'Actualizar receta'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Modal de éxito al actualizar */}
            {modalExitoAbierto && (
                <div id="modal-exito-receta" className="fondo-modal">
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
                        <h3>¡Receta actualizada con éxito!</h3>
                        <p>Los cambios en la fórmula y el rendimiento se guardaron correctamente en el sistema.</p>
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

export default EditarReceta;