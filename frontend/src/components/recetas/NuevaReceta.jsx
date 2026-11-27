import { useState, useEffect } from 'react';

/**
 * Componente NuevaReceta
 * Permite registrar una nueva ficha técnica vinculada a un producto terminado,
 * añadir dinámicamente materias primas, calcular el costo estimado en tiempo real
 * y guardar el paso a paso en MySQL.
 */
function NuevaReceta({ onVolver }) {
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

    // Campos de datos generales
    const [nombreReceta, setNombreReceta] = useState('');
    const [idProducto, setIdProducto] = useState('');
    const [rendimiento, setRendimiento] = useState('');
    const [tiempoPreparacion, setTiempoPreparacion] = useState('');

    // Filas dinámicas de ingredientes
    const [ingredientes, setIngredientes] = useState([
        { id_materia_prima: '', cantidad_requerida: '' },
    ]);

    // Campos de instrucciones
    const [temperaturaHorneado, setTemperaturaHorneado] = useState('');
    const [tiempoHorneado, setTiempoHorneado] = useState('');
    const [pasoAPaso, setPasoAPaso] = useState('');

    // Estados de interfaz
    const [mensajeError, setMensajeError] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [modalExitoAbierto, setModalExitoAbierto] = useState(false);

    useEffect(() => {
        const cargarCatalogos = async () => {
            setCargandoCatalogos(true);
            try {
                const respuesta = await fetch(
                    'http://localhost/Pan%20en%20su%20punto/backend/recetas.php?accion=catalogos'
                );
                const datos = await respuesta.json();

                if (datos.exito) {
                    setProductosDisponibles(datos.productos);
                    setMateriasPrimas(datos.materias_primas);
                } else {
                    setMensajeError(datos.mensaje || 'No se pudieron cargar los productos e insumos.');
                }
            } catch (error) {
                setMensajeError('Error de conexión con el servidor. Verifica que Apache esté encendido.');
            } finally {
                setCargandoCatalogos(false);
            }
        };

        cargarCatalogos();
    }, []);

    // Al elegir un producto terminado, sugiere automáticamente el nombre de la fórmula
    const manejarCambioProducto = (nuevoIdProducto) => {
        setIdProducto(nuevoIdProducto);
        const productoEncontrado = productosDisponibles.find(
            (prod) => String(prod.id_producto) === String(nuevoIdProducto)
        );
        if (productoEncontrado) {
            setNombreReceta(`Fórmula ${productoEncontrado.nombre}`);
        }
    };

    // Agrega una nueva fila vacía de ingrediente
    const agregarFilaIngrediente = () => {
        setIngredientes((prev) => [...prev, { id_materia_prima: '', cantidad_requerida: '' }]);
    };

    // Elimina una fila de ingrediente por índice
    const eliminarFilaIngrediente = (indice) => {
        if (ingredientes.length === 1) {
            setIngredientes([{ id_materia_prima: '', cantidad_requerida: '' }]);
            return;
        }
        setIngredientes((prev) => prev.filter((_, idx) => idx !== indice));
    };

    // Actualiza materia prima o cantidad en una fila específica
    const actualizarIngrediente = (indice, campo, valor) => {
        setIngredientes((prev) =>
            prev.map((fila, idx) => (idx === indice ? { ...fila, [campo]: valor } : fila))
        );
    };

    // Busca los datos completos de una materia prima por su ID
    const obtenerMateriaPrima = (idMateria) => {
        return materiasPrimas.find((mp) => String(mp.id_materia_prima) === String(idMateria));
    };

    // Calcula el costo estimado de una fila
    const calcularCostoFila = (fila) => {
        const materia = obtenerMateriaPrima(fila.id_materia_prima);
        const cantidad = Number(fila.cantidad_requerida || 0);
        if (!materia || cantidad <= 0) return 0;
        return cantidad * Number(materia.costo_unitario || 0);
    };

    // Calcula el costo total y unitario estimado de toda la fórmula
    const costoTotalEstimado = ingredientes.reduce(
        (acumulado, fila) => acumulado + calcularCostoFila(fila),
        0
    );
    const costoUnitarioEstimado =
        Number(rendimiento) > 0 ? costoTotalEstimado / Number(rendimiento) : 0;

    const formatearMoneda = (valor) => {
        return `$ ${Math.round(Number(valor || 0)).toLocaleString('es-CO')}`;
    };

    /**
     * Valida todos los campos obligatorios y reglas antes de enviar a PHP.
     */
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
            return 'Debes agregar al menos un ingrediente a la receta.';
        }

        const idsSeleccionados = new Set();
        for (let i = 0; i < ingredientes.length; i += 1) {
            const fila = ingredientes[i];
            if (!fila.id_materia_prima) {
                return `Selecciona la materia prima en la fila ${i + 1} de ingredientes.`;
            }
            if (idsSeleccionados.has(String(fila.id_materia_prima))) {
                return 'Hay materias primas repetidas en la tabla. Suma las cantidades en una sola fila.';
            }
            idsSeleccionados.add(String(fila.id_materia_prima));

            if (!fila.cantidad_requerida || Number(fila.cantidad_requerida) <= 0) {
                return `Ingresa una cantidad válida mayor a 0 en la fila ${i + 1} de ingredientes.`;
            }
        }

        if (pasoAPaso.trim() === '') {
            return 'Escribe las instrucciones paso a paso de la preparación.';
        }

        return '';
    };

    /**
     * Envía la receta y sus ingredientes al backend PHP.
     */
    const manejarGuardarReceta = async (evento) => {
        evento.preventDefault();

        const errorValidacion = validarFormulario();
        if (errorValidacion !== '') {
            setMensajeError(errorValidacion);
            return;
        }

        setMensajeError('');
        setGuardando(true);

        try {
            const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/recetas.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'crear',
                    id_producto: Number(idProducto),
                    rendimiento: Number(rendimiento),
                    tiempo_preparacion: tiempoPreparacion,
                    temperatura_horneado: temperaturaHorneado,
                    tiempo_horneado: tiempoHorneado,
                    paso_a_paso: pasoAPaso.trim(),
                    ingredientes: ingredientes.map((item) => ({
                        id_materia_prima: Number(item.id_materia_prima),
                        cantidad_requerida: Number(item.cantidad_requerida),
                    })),
                }),
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                setModalExitoAbierto(true);
            } else {
                setMensajeError(datos.mensaje || 'No se pudo guardar la receta.');
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
                <div className="titulos">
                    <h2>Crear nueva receta</h2>
                    <p>Registra la ficha técnica y los ingredientes para calcular el costo de producción.</p>
                </div>
            </div>

            <div className="tarjeta-datos">
                {mensajeError && (
                    <div className="alerta-error" style={{ marginBottom: '16px' }}>
                        {mensajeError}
                    </div>
                )}

                {!cargandoCatalogos && (productosDisponibles.length === 0 || materiasPrimas.length === 0) && (
                    <div className="alerta-error" style={{ marginBottom: '16px' }}>
                        {productosDisponibles.length === 0
                            ? 'No hay productos terminados disponibles sin receta. Registra primero un producto en Inventario.'
                            : 'No hay materias primas activas registradas en Inventario para agregar como ingredientes.'}
                    </div>
                )}

                <form className="formulario-estandar" onSubmit={manejarGuardarReceta}>
                    <h3 className="titulo-divisor">Datos generales</h3>
                    <div className="grid-formulario mb-15">
                        <div className="grupo-form">
                            <label htmlFor="nombreReceta">Nombre de la receta *</label>
                            <input
                                type="text"
                                id="nombreReceta"
                                placeholder="Ej: Pan aliñado tradicional"
                                value={nombreReceta}
                                onChange={(e) => setNombreReceta(e.target.value)}
                            />
                        </div>

                        <div className="grupo-form">
                            <label htmlFor="idProducto">Producto terminado vinculado *</label>
                            <select
                                id="idProducto"
                                value={idProducto}
                                onChange={(e) => manejarCambioProducto(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                {productosDisponibles.map((producto) => (
                                    <option key={producto.id_producto} value={producto.id_producto}>
                                        {producto.codigo} - {producto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grupo-form">
                            <label htmlFor="rendimiento">Rendimiento (unidades) *</label>
                            <input
                                type="number"
                                id="rendimiento"
                                min="1"
                                placeholder="Ej: 20"
                                value={rendimiento}
                                onChange={(e) => setRendimiento(e.target.value)}
                            />
                        </div>

                        <div className="grupo-form">
                            <label htmlFor="tiempoPreparacion">Tiempo de preparación (minutos)</label>
                            <input
                                type="number"
                                id="tiempoPreparacion"
                                min="1"
                                placeholder="Ej: 120"
                                value={tiempoPreparacion}
                                onChange={(e) => setTiempoPreparacion(e.target.value)}
                            />
                        </div>
                    </div>

                    <h3 className="titulo-divisor mt-30">Ingredientes</h3>

                    <table className="tabla-datos mb-20">
                        <thead>
                            <tr>
                                <th>Materia prima</th>
                                <th>Cantidad</th>
                                <th>Unidad</th>
                                <th>Costo estimado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-ingredientes">
                            {ingredientes.map((fila, indice) => {
                                const materiaSeleccionada = obtenerMateriaPrima(fila.id_materia_prima);
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
                                                placeholder="Ej: 1000"
                                                value={fila.cantidad_requerida}
                                                onChange={(e) =>
                                                    actualizarIngrediente(indice, 'cantidad_requerida', e.target.value)
                                                }
                                                style={{ width: '120px' }}
                                            />
                                        </td>
                                        <td>{materiaSeleccionada ? materiaSeleccionada.unidad_medida : '-'}</td>
                                        <td>{formatearMoneda(costoFila)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn-icono btn-eliminar-fila"
                                                title="Eliminar ingrediente"
                                                onClick={() => eliminarFilaIngrediente(indice)}
                                                style={{ border: 'none', cursor: 'pointer' }}
                                            >
                                                <i className="fa-solid fa-trash btn-eliminar"></i>
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
                            marginBottom: '20px',
                        }}
                    >
                        <button
                            type="button"
                            id="btn-agregar-ingrediente"
                            className="btn-principal"
                            onClick={agregarFilaIngrediente}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            <i className="fa-solid fa-plus margen-icono"></i> Agregar ingrediente
                        </button>

                        <div style={{ fontSize: '14px', color: '#5c4033' }}>
                            <strong>Costo total lote:</strong> {formatearMoneda(costoTotalEstimado)} &nbsp;|&nbsp;
                            <strong>Costo unitario estimado:</strong> {formatearMoneda(costoUnitarioEstimado)}
                        </div>
                    </div>

                    <h3 className="titulo-divisor mt-30">Instrucciones de preparación</h3>

                    <div className="grid-formulario mb-15">
                        <div className="grupo-form">
                            <label htmlFor="temperaturaHorneado">Temperatura de horneado (°C)</label>
                            <input
                                type="number"
                                id="temperaturaHorneado"
                                min="0"
                                placeholder="Ej: 180"
                                value={temperaturaHorneado}
                                onChange={(e) => setTemperaturaHorneado(e.target.value)}
                            />
                        </div>

                        <div className="grupo-form">
                            <label htmlFor="tiempoHorneado">Tiempo de horneado (minutos)</label>
                            <input
                                type="number"
                                id="tiempoHorneado"
                                min="0"
                                placeholder="Ej: 45"
                                value={tiempoHorneado}
                                onChange={(e) => setTiempoHorneado(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grupo-form ancho-completo mb-20">
                        <label htmlFor="pasoAPaso">Paso a paso *</label>
                        <textarea
                            id="pasoAPaso"
                            rows="6"
                            placeholder={'1. Mezclar los ingredientes secos...\n2. Añadir el agua poco a poco...\n3. Amasar hasta obtener una textura lisa...'}
                            value={pasoAPaso}
                            onChange={(e) => setPasoAPaso(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="acciones-formulario borde-superior">
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
                            id="btn-guardar-receta"
                            className="btn-principal btn-abrir-modal"
                            disabled={guardando}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            {guardando ? 'Guardando...' : 'Guardar receta'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de éxito */}
            {modalExitoAbierto && (
                <div id="modal-exito" className="fondo-modal">
                    <div className="contenido-modal centrado">
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
                        <h3>¡Receta guardada!</h3>
                        <p>La ficha técnica se ha registrado correctamente.</p>
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

export default NuevaReceta;